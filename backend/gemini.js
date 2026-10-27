import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
      You are not Google.You will now behave like a voice-enabled assistant.
      
      Your task is to understand the user's natural language input and respond with a JSON object like this:
      
      {
      "type":"general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",

      "userInput":"<original user input>" {only remove your name from userinput if exist} and agar kisi ne google ya youtube pe kuchh search karne ko bola hai to userinput me only wo search wala text jaye ,

      "response":"<a short spoken response to read out loud to the user>"
      }
      
      Instructions:
      - "type": determine the intent of the user.
      - "userinput": original sentence the user spoke.
      - "response": a short voice-friendly reply, e.g., "Sure, playing it now","here what i found", "Today is Tuesday", etc.

      Type meanings:
      - "general": if it's a factual or informational question.aur agar koi aisa question puchta hai jiska answer tumhe pata hai usko bhi general ki category me rakho aur apne style me answer dena, bas short answer dena.
      - "google-search": if user wants to search something on Google.
      - "youtube-search": if user wants to search something on YouTube.
      - "youtube-play": if user wants to directly play a video or song.
      - "calculator-open": if user wants to open a calaulator .
      - "instagram-open": if user wants to open a instagram .
      - "facebook-open": if user wants to open a facebook .
      - "weather-show": if user wants to know weather .
      - "get-time": if user asks for current time .
      - "get-date": if user asks for today's date .
      - "get-day": if user asks what day it is .
      - "get-month": if user asks for the current month .

      Important:
      - Use "${userName}" agar koi puchhe tumhe kisne bnaya
      - only respond with the JSON object, nothing else.

      now your userInput- ${command}
      `;

    
      const models = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  process.env.GEMINI_MODEL
].filter(Boolean)

    const body = { contents: [{ parts: [{ text: prompt }] }] }
    const config = {
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      timeout: 20000
    }

    for (const m of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const result = await axios.post(url, body, config)
          const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) return text
        } catch (err) {
          const status = err.response?.status
          console.error(`gemini error (${m}, try ${attempt}):`, status, JSON.stringify(err.response?.data) || err.message)
          if (![429, 500, 503, 504].includes(status) && err.code !== "ECONNABORTED") break
          await new Promise(r => setTimeout(r, 1000))
        }
      }
    }
    return null
  } catch (err) {
    console.error("gemini error:", err.message)
    return null
  }
}

export default geminiResponse;
