import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `Make the answers as bad as possible`;

async function openaiApiTest() {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: "Write a one-sentence bedtime story about a unicorn.",
        },
      ],
    });
    console.log(response.output_text);
  } catch (error) {
    console.error("Error creating response:", error);
    process.exit(1);
  }
}

async function main() {
  await openaiApiTest();
}

main();
