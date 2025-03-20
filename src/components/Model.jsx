import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the client using the API key from Vite's environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); 
// My actual API key is in the .env file (so please don't share it)

// Set up the model (adjust the model name as needed)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateContent = async (prompt) => {
  const result = await model.generateContent(prompt);
  // Call the text() method to extract the generated text
  const text = result.response.text();
  console.log(text);
  return text;
};
/*code referenced from:
https://dev.to/tahrim_bilal/how-to-integrate-gemini-api-with-reactjs-a-step-by-step-guide-341b#:~:text=In%20this%20tutorial%2C%20we've,state%20management%20and%20react%2Dmarkdown%20.*/