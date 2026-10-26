import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(400).json({ message: "user not found" })
    }
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: "get current user error" })
  }
}

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body
    let assistantImage

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path)
    } else {
      assistantImage = imageUrl
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password")
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: "updateAssistant error" })
  }
}

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body || {}
    if (typeof command !== "string" || !command.trim()) {
      return res.status(400).json({ response: "command is required" })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(400).json({ response: "user not found" })
    }
    user.history.push(command)
    await user.save()

    const result = await geminiResponse(command, user.assistantName, user.name)
    if (!result) {
      return res.status(502).json({ response: "assistant is unavailable right now" })
    }

    const jsonMatch = result.match(/{[\s\S]*}/)
    if (!jsonMatch) {
      return res.status(400).json({ response: "sorry,i can't understand" })
    }

    let gemResult
    try {
      gemResult = JSON.parse(jsonMatch[0])
    } catch {
      return res.status(400).json({ response: "sorry,i can't understand" })
    }

    const type = gemResult.type
    const userInput = gemResult.userInput

    switch (type) {
      case "get-date":
        return res.json({ type, userInput, response: `current date is ${moment().format("YYYY-MM-DD")}` })
      case "get-time":
        return res.json({ type, userInput, response: `current time is ${moment().format("hh:mm A")}` })
      case "get-day":
        return res.json({ type, userInput, response: `Today is ${moment().format("dddd")}` })
      case "get-month":
        return res.json({ type, userInput, response: `This month is ${moment().format("MMMM")}` })

      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({ type, userInput, response: gemResult.response })

      default:
        return res.status(400).json({ response: "I didn't understand that command." })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ response: "Ask assistant error" })
  }
}
