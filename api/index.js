import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("SERVER running on PORT " + PORT));
