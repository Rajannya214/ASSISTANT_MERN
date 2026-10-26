import jwt from "jsonwebtoken"

const genToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" })
}

export default genToken
