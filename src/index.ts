/// <reference path="./global.d.ts" />
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
  const requirements = (
    await askQuestion("Enter job requirements (comma-separated): ")
  )
    .split(",")
    .map((req) => req.trim());
  const responsibilities = (
    await askQuestion("Enter job responsibilities (comma-separated): ")
  )
    .split(",")
    .map((resp) => resp.trim());
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

async function jobDescriptionOutOfText(text: string): Promise<jobDescription> {
  const jobDescription: jobDescription = {
    title: "devops engineer",
    description: 'We are looking for a skilled DevOps Engineer to join our team.',
    // This is a mock job description. In a real scenario, you would extract this from the provided text.
    requirements: ["Cloud computing experience", "Container orchestration knowledge"],
    responsibilities: ["Implement CI/CD pipelines", "Manage cloud infrastructure"],
    company: "Tech Innovations Inc.",
    location: "Remote",
    language: "English",
    experienceLevel: "Senior",
  };
  return jobDescription;
}

async function main() {
  const jobDesc: jobDescription = await jobDescriptionOutOfText("");
  const sqlScript = await generateSqlScript(jobDesc);
  console.log(sqlScript);
  rl.close();
}

main();
