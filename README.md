# 🚀 Smart Weekly Challenge Alert

A fully automated tool that:

* Scrapes the latest tech challenges (hiring, hackathons, ideation contests) from HackerEarth
* Summarizes them using AI (via OpenRouter's llama-4-scout model)
* Emails a clean and concise list of opportunities in a fixed 3-line format

---

## 🧰 Tech Stack

* ✅ [Playwright](https://playwright.dev/) — for web scraping
* ✅ [OpenRouter](https://openrouter.ai) — for AI summarization using `llama-4-scout` (free tier)
* ✅ [NodeMailer](https://nodemailer.com/) — to send summary email
* ✅ [GitHub Actions](https://docs.github.com/en/actions) — to automate weekly runs

---

## ⚙️ How to Set Up

### 1. Clone this repo

```bash
git clone https://github.com/rachuri-guna/qa-challenge-alert.git
cd qa-challenge-alert
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in the root with the following:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=recipient_email@gmail.com
```
---

## 🔐 How to Get Required API Keys

### 🛁 OpenRouter AI Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign in → Go to **API Keys** section
3. Click **Create New Key** and copy it
4. Paste it as `OPENROUTER_API_KEY` in your `.env`

✅ This project uses `meta-llama/llama-4-scout:free` model.

---

### 🔑 Gmail App Password (Not Your Email Password)

If your Gmail account has 2-Step Verification:

1. Go to: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Choose **Mail** as app → **Other** as device name → Generate
3. Copy the 16-character password and paste it as `EMAIL_PASS` in `.env`

> 🛡️ Use this instead of your Gmail login password. It’s safe for apps.

---

## 🧪 How to Run Manually

```bash
npx playwright test
```

This will:

* Scrape challenge listings
* Generate summaries
* Send a plain text email with all challenge info

---

## 🔁 Auto Schedule (Every Monday 9:00 AM IST)

GitHub Actions runs the script **every Monday at 9:00 AM IST (03:30 UTC)**

You can also run it manually using the **"Run workflow"** button on GitHub.

---

## 📝 Example Output Format (Each Challenge is 3 Lines Only)

```
Challenge: Juspay Hiring Challenge 2025  
💡 Type: Hiring Challenge | 💼 Organiser: Juspay | 📍 Location: Bangalore | 🎯 Eligibility: Python Programming | 📈 Experience: 4+ years | 🏆 Rewards: ₹42 LPA | 🕒 Deadline: June 25, 2025  
🔗 Apply: https://www.hackerearth.com/challenges/hiring/juspay-software-engineer-hiring-challenge-2025/
```

⛔ No `###` headers, markdown, or hallucinated data.

---

## 📬 Output

You’ll get a weekly plain-text email that lists challenges in the above format, ideal for quick skimming.
![image](https://github.com/user-attachments/assets/b70e8a0b-6a01-4b78-ac81-1c274bcd5f06)


---

## 📄 License

MIT License

---

## 💡 Credits

Built by Guna Rachuri using Playwright + AI + GitHub Actions for developer productivity.
