import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"

const app = express()
app.set("trust proxy", 1)

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "https://virtual-assistant-8kl3.onrender.com",
  "http://localhost:5173"
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    return cb(new Error("Not allowed by CORS"))
  },
  credentials: true
}))

const port = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, () => {
  connectDb()
  console.log(`server started on port ${port}`)
})
