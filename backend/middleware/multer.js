import multer from "multer"
import fs from "fs"
import path from "path"
import crypto from "crypto"

fs.mkdirSync("./public", { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public"),
  filename: (req, file, cb) => {
    // random name: avoids collisions and ignores user-controlled file names
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, crypto.randomUUID() + ext)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true)
  cb(new Error("Only image files are allowed"))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
export default upload
