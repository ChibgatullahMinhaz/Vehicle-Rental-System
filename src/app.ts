import { Request, Response, urlencoded } from "express";
import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
