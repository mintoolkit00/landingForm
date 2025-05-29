# 📝 Landing Form – React + Netlify Functions + Notion or Google Sheets

A simple and customizable landing page built with **React (Vite)**, styled using **CSS Modules**, and powered by **Netlify Functions**. Collect feedback without setting up a backend — submissions are sent directly to your **Notion database** or **Google Sheets**.

---

## 🚀 Features

- ✅ Fast React + Vite setup
- 🎨 Minimal and clean design
- 📨 Feedback form powered by serverless functions
- 🧠 Feedback stored in Notion or Google Sheets
- 🔧 Easily customizable and deployable

---

## 📦 Getting Started

```bash
git clone https://github.com/yourusername/landing-form.git
cd landing-form
npm install
```

---

## 🧱 Project Structure

```
/src
  /components
    Header.jsx
    HeroSection.jsx
    DetailsSection.jsx
    ContactForm.jsx
    Footer.jsx
/netlify
  /functions
    send-feedback.js
    send-feedback-google-sheet.cjs
netlify.toml
.env               (ignored by Git)
```

---

## 🔧 Setup

### Option 1: Using Notion

1. Create a **Notion database** (table) with the following properties:

   - `Name` (type: **Title**)
   - `Email` (type: **Email**)
   - `Message` (type: **Rich text**)

2. Create a [Notion integration](https://www.notion.com/my-integrations) and copy the **internal integration token**.

3. Share the database with your integration (via "Share" > Invite).

4. Add the following environment variables in your `.env`:

```
NOTION_SECRET=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

5. Also include them in `netlify.toml` under `[build.environment]`:

```toml
[build.environment]
  NOTION_SECRET = "your_notion_integration_token"
  NOTION_DATABASE_ID = "your_notion_database_id"
```

### Option 2: Using Google Sheets

1. Create a new Google Sheet and name the first tab `Sheet1`.

2. Add a header row:

   - `Name` | `Email` | `Message`

3. Go to [Google Cloud Console](https://console.cloud.google.com/):

   - Create a project
   - Enable the **Google Sheets API**
   - Create a **Service Account**
   - Generate a key as JSON
   - Copy the `client_email` and `private_key` from the JSON

4. Share your Google Sheet with the `client_email` as an editor.

5. Add the following environment variables to `.env`:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id
```

6. Also include them in `netlify.toml`:

```toml
[build.environment]
  GOOGLE_SERVICE_ACCOUNT_EMAIL = "your-service-account@project.iam.gserviceaccount.com"
  GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  GOOGLE_SHEET_ID = "your_google_sheet_id"
```

---

## 🧪 Run Locally

```bash
netlify dev
```

Your site will be live at `http://localhost:8888` with the serverless functions running.

---

## ⬆️ Deploy to Netlify

You can either:

1. Use the **Netlify CLI**:

   ```bash
   netlify deploy --prod
   ```

2. Or push your project to GitHub and connect it with [Netlify.com](https://app.netlify.com/) (it will auto-deploy on commit).

---

## 📤 Feedback Storage

The contact form sends data to:

- `/netlify/functions/send-feedback` → stores in Notion
- `/netlify/functions/send-feedback-google-sheet` → stores in Google Sheets

You can choose which one to use in the component like this:

```jsx
<ContactForm target="notion" /> // default
<ContactForm target="sheet" />
```

---

## 📄 License

MIT – free to use and modify.
