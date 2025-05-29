import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAnswer(
  systemPrompt: string,
  content: string,
  model: string = "gpt-4.1"
): Promise<string> {
  try {
    const response = await client.responses.create({
      model: model,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: content },
      ],
    });
    return response.output_text.trim();
  } catch (error) {
    console.error("Error generating SQL script:", error);
    throw error;
  }
}
