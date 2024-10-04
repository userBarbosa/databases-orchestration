import express, { json, urlencoded } from "express";
import cors from "cors";
import { environment } from '../config/config';
// import { run } from '../services/database';

const app = express();

app.use(
  cors({
    // any port from localhost:
    origin: /^https?:\/\/localhost(:\d{1,5})?$/,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// app.get("/db", async (req, res) => {
//   await run()
//   res.json({ message: "db run" });
// });

app.listen(environment.API_PORT, () =>
  console.log(`Running on server on ${environment.API_PORT} port`)
);
