import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

const cookieOptions = () => ({
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production"
})

const isValidEmail = (e) => typeof e === "string" && /^\S+@\S+\.\S+$/.test(e)

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body || {}

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "name is required" })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "valid email is required" })
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "password must be atleast 6 characters" })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existEmail = await User.findOne({ email: normalizedEmail })
    if (existEmail) {
      return res.status(400).json({ message: "email already exists!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    })

    res.cookie("token", genToken(user._id), cookieOptions())

    const safeUser = user.toObject()
    delete safeUser.password
    return res.status(201).json(safeUser)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "sign up error" })
  }
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!isValidEmail(email) || typeof password !== "string") {
      return res.status(400).json({ message: "email and password are required" })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "email does not exists!" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password!" })
    }

    res.cookie("token", genToken(user._id), cookieOptions())

    const safeUser = user.toObject()
    delete safeUser.password
    return res.status(200).json(safeUser)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "login error" })
  }
}

export const logOut = async (req, res) => {
  try {
    const { maxAge, ...opts } = cookieOptions()
    res.clearCookie("token", opts)
    return res.status(200).json({ message: "logOut successfully" })
  } catch (err) {
    return res.status(500).json({ message: "logOut error" })
  }
}
