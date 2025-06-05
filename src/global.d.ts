export interface jobDescription {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  company: string;
  location: string;
  language: string;
  experienceLevel: string;
}

export interface mail {
  to: string;
  subject: string;
  body: string;
}

export interface requestExpected {
  jobDescriptionAsText: string;
  mailTo: string;
}

export interface responseBody {
  mail: mail;
  sqlScript: string;
}
