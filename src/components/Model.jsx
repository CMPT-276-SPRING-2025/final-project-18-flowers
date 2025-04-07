import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client using the API key from Vite's environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper: Extract bullet points or return a concise snippet if bullets aren't detected.
const processResponse = (text) => {
  // Split the raw text into lines and trim whitespace.
  const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
  // Filter lines that appear to be bullet points (start with "*" or "-").
  const bulletLines = lines.filter(line => line.startsWith("*") || line.startsWith("-"));
  if (bulletLines.length >= 2) {
    // Return only the first 3 bullet options.
    return bulletLines.slice(0, 3).join("\n");
  }
  // If no clear bullet points, return a truncated version.
  return text.substring(0, 300) + (text.length > 300 ? "..." : "");
};

export const generateContent = async (prompt) => {
  // Append instruction to ask for a concise, bullet-point answer.
  const modifiedPrompt = `${prompt}\n\nPlease provide 2-3 suggestions in bullet points.`;
  
  const result = await model.generateContent(modifiedPrompt);
  const rawText = result.response.text();
  console.log("Raw response:", rawText);
  
  const processedText = processResponse(rawText);
  return processedText;
};

/*code referenced from:
https://dev.to/tahrim_bilal/how-to-integrate-gemini-api-with-reactjs-a-step-by-step-guide-341b#:~:text=In%20this%20tutorial%2C%20we've,state%20management%20and%20react%2Dmarkdown%20.*/