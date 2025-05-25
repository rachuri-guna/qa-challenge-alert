import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function getAISummary(htmlContent) {
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
        model: 'mistralai/mixtral-8x7b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI summarization failed:', error.response?.data || error.message);
    return '⚠️ AI summarization failed. Please check the logs.';
  }
}
