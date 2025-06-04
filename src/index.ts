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
  const mail = await generateMail(jobDesc, sqlScript, "zied.essaber@gmail.com");
  console.log(mail);
  rl.close();
}

async function generateMail(
  job: jobDescription,
  sqlScript: string,
  to: string
): Promise<mail> {
  console.log("Generating mail for the job description...");
  const mail = await generateAnswer(
    `Out of the info the user gives you, write a mail to advertive our product. The product is called Expert Eval. It is a tool that helps companies to evaluate candidates for their job positions. The mail should be written in a professional tone and should include the following information: the product name, the main features of the product, and how it can help the company to evaluate candidates for their job positions. The mail should be written in the language you get out of the infos. Here is an example:
    Objet : Plateforme de test personnalisée pour vos recrutements chez JUST Schweiz

Bonjour M. Klinghoffer,

Je me permets de vous contacter afin de vous présenter un outil innovant que vous pourriez intégrer à votre processus de recrutement pour le poste de Verkaufsberater chez JUST Schweiz.

Nous avons développé une plateforme de tests techniques entièrement personnalisables, qui vous permet d’évaluer rapidement et efficacement les compétences des candidats avant même l'entretien.

✅ Avantages pour votre recrutement :
Test adapté au poste : Les questions sont spécifiquement conçues pour refléter les exigences du rôle de conseiller(ère) en vente directe chez JUST Schweiz, avec un niveau expert.

Gain de temps : Vous filtrez automatiquement les profils les plus qualifiés.

Équité : Tous les candidats passent le même test dans les mêmes conditions.

Accessibilité : Les tests sont accessibles en ligne depuis n’importe quel appareil, sans installation.

👇 Comment ça fonctionne :
Nous créons pour vous un test complet (déjà prêt pour ce poste) avec 6 catégories de compétences clés, chacune composée de questions techniques expertes.

Vous recevez un lien unique à partager avec vos candidats.

Le candidat accède au test, le complète, et vous recevez automatiquement son score détaillé par compétence.

Vous pouvez ensuite prendre votre décision en vous appuyant sur des données objectives.

🚀 Comment procéder :
Dites-nous simplement combien de candidats vous souhaitez évaluer.

Nous générons un lien de test personnalisé (gratuit dans un premier temps pour évaluation).

Vous recevez les résultats par email ou via un tableau de bord dédié.

Si cela vous intéresse, je serais ravi(e) de vous faire une démonstration rapide ou de vous envoyer un accès test pour vous familiariser avec l'outil.

Restant à votre disposition pour toute question ou planification de mise en place.

Bien cordialement,
Expert Eval
📧 contact@expert-eval.com

Always keep these contact info.

Return the mail in JSON format for this type:
interface mail {
    to: string;
    subject: string;
    body: string;
}`,
    JSON.stringify(job) +
      sqlScript +
      "Please write the mail in " +
      job.language +
      " and address it to " +
      to,
    "gpt-4.1-mini"
  );

  let mailFinal: mail;
  try {
    mailFinal = JSON.parse(mail);
    mailFinal.to = to;

    return mailFinal;
  } catch (e) {
    console.error("Failed to parse mail from response:", mail);
    throw e;
  }
}

main();
