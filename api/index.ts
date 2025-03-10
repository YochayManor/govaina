import '../config/env.js'
import fs from 'node:fs/promises'
import express from 'express'
import { OpenAI } from 'openai'
import { ASSISTANT_INSTRUCTIONS } from '../utils/ASSISTANT_INSTRUCTIONS.js'
import { cwd } from 'node:process'
import path from 'node:path'
import { ViteDevServer } from 'vite'
import sirv from 'sirv'
// import * as compression from 'compression'
import { render as entryRender } from '../src/entry-server.tsx'

const app = express();

app.use(express.static('public'));
app.use(express.static('dist/client'));

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const base = process.env.BASE || '/'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-fgvdbOMEi46sit0opJ6AlWJi",
});

// Cached production assets
const templateHtml = isProduction
    ? await fs.readFile('../dist/client/index.html', 'utf-8')
    : ''


app.use(express.json());

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite: ViteDevServer
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base,
    })
    app.use(vite.middlewares)
} else {
    // app.use(compression())
    app.use(base, sirv('../dist/client', { extensions: [] }))
}

// Serve HTML
app.get('/', async (req, res) => {
    try {
        console.log(req.originalUrl, req.method)
        const url = req.originalUrl.replace(base, '')

        let template: string
        /** @type {import('../src/entry-server.ts').render} */
        let render: (param1?: string) => { head?: string, html: string } | Promise<{ head?: string, html: string }>
        if (!isProduction) {
            // Always read fresh template in development
            template = await fs.readFile(path.join(cwd(), '/dist/client/index.html'), 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
        } else {
            template = templateHtml
            render = entryRender
        }

        const rendered = await render(url)

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e: unknown) {
        vite?.ssrFixStacktrace(e as Error)
        console.log((e as Error).stack)
        res.status(500).end((e as Error).stack)
    }
})

app.get('/api/health', async (_req, res) => {
    res.send('ok')
})
app.post('/api/evaluations', async (req, res) => {
    const { decisionNumber, decisionText } = req.body;

    // TODO: check if evaluation exists in database (by decisionNumber)
    if (!decisionNumber || !decisionText) {
        res.status(400).send('Missing decision number or decision text');
        return
    }

    console.log(`Evaluating decision number ${decisionNumber} with text: ${decisionText}`);

    const [error, evaluationText] = await evaluateDecision(decisionText);

    if (error) {
        res.status(400).send(error.toString());
    } else {
        res.send(evaluationText);
    }
});

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

async function catchError<T>(promise: Promise<T>): Promise<[Error] | [undefined, T]> {
    return promise
        .then((data: T) => [undefined, data] as [undefined, T])
        .catch((error: Error) => [error])
}


async function performCompletion(userMessageText: string): Promise<[Error] | [undefined, string]> {
    const [error, completionObj] = await catchError(openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 1,
        top_p: 1,
        messages: [
            { role: 'system', content: ASSISTANT_INSTRUCTIONS }, 
            { role: "user", content: userMessageText }
        ],
    }));
    
    if (error) {
        return [error];
    }

    const evaluation = completionObj.choices[0].message.content
    if (!evaluation) return [new Error('Empty evaluation')]
    
    return [undefined, evaluation]
}

async function evaluateDecision (decisionText: string): Promise<[Error] | [undefined, string]> {
  const userMessageText = `${decisionText}`;
  const [error, message] = await performCompletion(userMessageText);

  if (error) {
      return [error];
  }

  if (!message) return [new Error('Empty response')];

  return [undefined, message];
}
