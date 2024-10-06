import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;


let i = 0;

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send(`Hello, TypeScript with ESNext on Node.js!${i++}`);
});

app.get('/bat', (req: Request, res: Response) => {
  res.send(`Hello, Bat with ESNext on Node.js!${i++}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
