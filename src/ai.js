import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getHint(word) {
  const completion = await client.chat.completions.create({
    model: "openrouter/free",

    messages: [
      {
        role: "user",
        content: `
Create a hint for this Hangman word:

"${word}"

Rules:
- Maximum 10 words.
- Do not include the word.
- Do not reveal any letters.
- Do not mention word length.
- Make it a useful clue.

Return only the hint.
        `,
      },
    ],
  });

  return completion.choices[0].message.content;
}