# KUDEX AI

KUDEX AI is an AI-powered creator toolkit designed to help creators generate content ideas quickly.

## Features

- Shorts Script Generator
- Hooks Generator
- Titles Generator
- Thumbnail Text Generator
- Video Ideas Generator
- English, Hindi and Hinglish support
- Audience targeting for Global, USA, UK, Canada, Australia and India
- Style and length controls
- Saved files and generation history
- Mobile-friendly interface
- AI generation through a secure server-side API

## Project Structure

```text
/
├── index.html
├── vercel.json
├── package.json
├── README.md
└── api/
    └── generate.js
```

## Deployment

KUDEX AI is designed to be deployed on Vercel.

### Environment Variables

Add these environment variables in Vercel:

- `OPENAI_API_KEY` — your OpenAI API key
- `OPENAI_MODEL` — the model you want the app to use

Keep API keys on the server. Never put secret API keys directly inside `index.html` or other public frontend files.

## Authentication

The current login interface provides Google and phone-login UI. Real authentication can be connected later using Firebase Authentication.

## Storage

Saved files and generation history currently use browser local storage. Cloud synchronization can be added later with a database such as Firebase Firestore.

## Payments

The Pro and Creator plans are currently represented in the interface. Real subscriptions require a payment provider and secure server-side payment verification.

## License

This project is currently private to the KUDEX AI project owner. No license for redistribution is granted by this README.
