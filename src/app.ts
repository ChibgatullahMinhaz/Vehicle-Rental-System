import { Request, Response, urlencoded } from "express";
import express from "express";
import router from "./routes/routes";
import intiDB from "./config/db";
import notFound from "./middleware/notFound";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

intiDB();
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(notFound);
export default app;
