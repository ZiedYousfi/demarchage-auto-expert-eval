import { generateSqlScript } from "./sqlCreator";

async function main() {
  const jobDescription: jobDescription = {
    title: "Bedtime Story Writer",
    description: "Write a one-sentence bedtime story about a unicorn.",
    requirements: ["Creativity", "Imagination"],
    responsibilities: ["Write short stories", "Engage with children"],
    company: "StoryTime Inc.",
    location: "Remote",
    language: "English",
    experienceLevel: "Entry-level",
  };
  const sqlScript = await generateSqlScript(jobDescription);
  console.log(sqlScript);
}

main();
