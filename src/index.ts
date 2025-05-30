/// <reference path="./global.d.ts" />
import { generateSqlScript } from "./sqlCreator";
import { generateAnswer } from "./opaiApiCaller";
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
  const response = await generateAnswer(
    `You are an expert in extracting job descriptions from text. Please extract the job description from the provided text. Break down the job description into the following fields: title, description, requirements, responsibilities, company, location, language, and experience level and return it in JSON format for this type:
interface jobDescription {
    title: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    company: string;
    location: string;
    language: string;
    experienceLevel: string;
}
    Here is an example of a job description in JSON format:
{
   title: "DevOps Engineer",
     description:
       "We are looking for a skilled DevOps Engineer to join our team.",
     requirements: [
       "Cloud computing experience",
       "Container orchestration knowledge",
     ],
     responsibilities: [
       "Implement CI/CD pipelines",
       "Manage cloud infrastructure",
     ],
     company: "Tech Innovations Inc.",
     location: "Remote",
     language: "English",
     experienceLevel: "Senior",
   };`,
    text,
    "gpt-4.1-mini"
  );

  try {
    const jobDesc: jobDescription = JSON.parse(response);
    return jobDesc;
  } catch (e) {
    console.error("Failed to parse job description from response:", response);
    throw e;
  }
}

async function main() {
  let jobDesc: jobDescription;
  const text = await askQuestion(
    "Enter the job description text (or press Enter to use manual input): "
  );
  if (text.trim()) {
    console.log("Extracting job description from text...");
    jobDesc = await jobDescriptionOutOfText(text);
    console.log("Job description extracted successfully.");
  } else {
    console.log("Using manual input for job description.");
    jobDesc = await userInputJobDescription();
    console.log("Job description input successfully.");
  }
  console.log("Generating SQL script for the job description...");
  const sqlScript = await generateSqlScript(jobDesc);
  console.log(sqlScript);
  rl.close();
}

main();
