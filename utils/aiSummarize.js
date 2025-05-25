import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAISummary(htmlContent) {
  const prompt = `
You are an assistant that reads the HTML content of a coding challenge page and extracts a short, clear summary useful for QA automation engineers.

Here is the HTML content:
${htmlContent}

Please provide the summary in this format:
Challenge: <name>
💼 Role: <role> | 📍 Location: <location> |Type: <Full-time/Part-time/Contract> | 📈 Experience: <years> | 🕒 Deadline: <date>
Apply Now: <Direct Link>

If any information is missing, please write "Not specified" for that field.

Keep it concise and professional.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',  // or 'gpt-4' if you have access
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}
