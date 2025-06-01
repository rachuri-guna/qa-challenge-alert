import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function getAISummary(htmlContent) {
  if (!htmlContent || htmlContent.trim() === '') {
    return '⚠️ No HTML content provided for summarization.';
  }

  const prompt = `
You are a helpful assistant that reads the HTML content of a challenge page (such as coding contests, hackathons, or ideation challenges) and creates a short, clear summary for enthusiastic participants.

Here is the HTML content:
${htmlContent}

Please extract and summarize the challenge using this pipe format:

Challenge: <Name>  
💡 Type: <Type> | 💼 Organiser: <Host> | 📍 Location: <Location> | 🎯 Eligibility: <Eligibility> | 📈 Experience: <Level> | 🏆 Rewards: <Prizes> | 🕒 Deadline: <Date>  
🔗 Apply: <Direct Link>

Use "Not specified" if any info is missing.  
Keep it concise, clean, and useful for emails.

Output only the formatted summary.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-4-scout:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI summarization failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return '⚠️ AI summarization failed. Please check the logs.';
  }
}
