import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is up');
});

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
