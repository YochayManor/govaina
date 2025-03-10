import '../config/env';
import express, { Request, Response } from 'express';
import ViteExpress from "vite-express";
import routes from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.send('Server is up');
});

app.use('/api', routes)

ViteExpress.listen(app, PORT, () =>
  console.log("Server is listening on port 3000..."),
);
