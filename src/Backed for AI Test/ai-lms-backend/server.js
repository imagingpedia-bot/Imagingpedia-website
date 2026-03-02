import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import questionRoutes from "./routes/questions.js";
import submissionRoutes from "./routes/submission.js";
import studentRoutes from "./routes/students.js";
import subjectRoutes from "./routes/subjects.js";
import courseRoutes from "./routes/courses.js";
import adminRoutes from "./routes/admin.js";
import practiceQuestionsRoutes from "./routes/practiceQuestions.js";
import practiceSubjectsRoutes from "./routes/practiceSubjects.js";
import path from "path";
import fs from "fs";

const port =process.env.PORT || 3000;
const app=express();

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:8081",
  "https://imagingpedia-testing.vercel.app",
  "https://imagingpedia-testing.onrender.com",
  "https://imagingpedia-testing-production.up.railway.app",
];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...envOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isRailwayApp = /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin);
      const isVercelApp = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
      const isRenderApp = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(origin);
      const isNetlifyApp = /^https:\/\/[a-z0-9-]+\.netlify\.app$/i.test(origin);

      if (allowedOrigins.has(origin) || isRailwayApp || isVercelApp || isRenderApp || isNetlifyApp) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});
app.use("/uploads", express.static(uploadsDir));
app.use("/questions",questionRoutes);
app.use("/practice-questions", practiceQuestionsRoutes);
app.use("/practice-subjects", practiceSubjectsRoutes);
app.use("/submission",submissionRoutes);
app.use("/students",studentRoutes);
app.use("/subjects",subjectRoutes);
app.use("/courses",courseRoutes);
app.use("/admin",adminRoutes);


app.listen(port,'0.0.0.0',()=>{
    console.log(`server started at ${port}`);
});