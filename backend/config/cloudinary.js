import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath)
    return uploadResult.secure_url
  } catch (error) {
    console.log("cloudinary error:", error)
    throw error // let the controller turn this into an HTTP response
  } finally {
    fs.unlink(filePath, () => {}) // always clean up the temp file
  }
}

export default uploadOnCloudinary
