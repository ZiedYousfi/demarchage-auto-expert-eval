# Demarchage Auto

An AI-powered tool that automatically generates MySQL scripts for creating recruitment skill tests based on job descriptions. The system uses OpenAI's GPT models to analyze job requirements and generate expert-level multiple-choice questions organized by skill categories.

## Features

- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT models to extract job requirements and generate relevant questions
- 📝 **Automatic Test Generation**: Creates 30 expert-level MCQ questions across 6 skill categories
- 🗄️ **Ready-to-Run SQL**: Generates complete MySQL scripts that create clients, tests, categories, and questions
- 🌐 **Multi-Language Support**: Supports test generation in the same language as the job description
- 📋 **Flexible Input**: Accept job descriptions as free text or structured manual input

## Prerequisites

- Node.js (v16 or higher)
- TypeScript
- OpenAI API key

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ZiedYousfi/demarchage-auto-expert-eval
   cd demarchage-auto-expert-eval
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to the `.env` file:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Running the Application

The application provides two input methods:

1. **Automatic Extraction**: Paste a job description text and let AI extract the structured information
2. **Manual Input**: Enter job details step by step through prompts

The system will generate a complete MySQL script that:

- Creates a new client account
- Sets up a recruitment test
- Defines 6 skill categories based on job requirements
- Generates 30 expert-level questions (5 per category)
- Links questions to the test

## Database Schema

The generated SQL script works with the following database structure:

```sql
-- Client management
clients(id, username, email, password, token, confirmed, reset_token, lang)

-- Test definitions
tests(id, name, client_id, nb_questions)

-- Skill categories
categories(id, name, description, client_id)

-- Questions with 4 multiple choice options
questions(id, question, category_id, res1, res2, res3, res4, correct, is_sample)

-- Test-question assignments
assigns(id, test_id, question_id, category_id)
```

## Project Structure

```text
src/
├── index.ts           # Main application entry point
├── sqlCreator.ts      # SQL script generation logic
├── opaiApiCaller.ts   # OpenAI API integration
└── global.d.ts        # TypeScript type definitions
```

## Configuration

### OpenAI Models

The system uses different GPT models for different tasks:

- `gpt-4.1-mini`: For job description extraction
- `gpt-4.1`: For SQL script generation (default)

### Question Generation Rules

- **Expert Level**: Questions focus on advanced concepts, not basic definitions
- **Six Categories**: Automatically extracted from job requirements
- **30 Questions Total**: 5 questions per category
- **Multiple Choice**: 4 options per question, exactly one correct
- **Varied Patterns**: Correct answers distributed randomly across positions
- **Language Matching**: All content generated in the job description's language

## Example Output

The system generates complete MySQL scripts like:

```sql
-- Create client
INSERT INTO clients (username,email,password)
VALUES ('TechCorp','techcorp@example.com',MD5('admin742'));

-- Create test
INSERT INTO tests (name,client_id)
VALUES ('Senior Developer Skill Test',@client_id);

-- Categories and questions...
-- (Complete 30-question test suite)
```

## Scripts

- `npm run dev`: Run in development mode with ts-node
- `npm run build`: Compile TypeScript and run linting
- `npm run start`: Run compiled JavaScript
- `npm run lint`: Run ESLint checks

## Error Handling

The application includes comprehensive error handling for:

- OpenAI API failures
- Invalid job description parsing
- SQL generation errors
- Missing environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

ISC License

## Support

For issues or questions, please create an issue in the repository.
