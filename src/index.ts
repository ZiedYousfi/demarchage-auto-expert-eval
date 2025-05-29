import { generateSqlScript } from "./sqlCreator";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer));
  });
}

async function userInputJobDescription(): Promise<jobDescription> {
  const title = await askQuestion("Enter job title: ");
  const description = await askQuestion("Enter job description: ");
  const requirements = (await askQuestion("Enter job requirements (comma-separated): ")).split(",").map(req => req.trim());
  const responsibilities = (await askQuestion("Enter job responsibilities (comma-separated): ")).split(",").map(resp => resp.trim());
  const company = await askQuestion("Enter company name: ");
  const location = await askQuestion("Enter job location: ");
  const language = await askQuestion("Enter job language: ");
  const experienceLevel = await askQuestion("Enter experience level: ");
  return {
    title,
    description,
    requirements,
    responsibilities,
    company,
    location,
    language,
    experienceLevel,
  };
}

async function main() {
  const jobDescription: jobDescription = await userInputJobDescription();
  const sqlScript = await generateSqlScript(jobDescription);
  console.log(sqlScript);
  rl.close();
}

main();
