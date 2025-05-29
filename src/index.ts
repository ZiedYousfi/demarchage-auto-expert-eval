import { generateSqlScript } from "./sqlCreator";

async function main() {
  const jobDescription = "Write a one-sentence bedtime story about a unicorn.";
  const sqlScript = await generateSqlScript(jobDescription);
  console.log(sqlScript);
}

main();
