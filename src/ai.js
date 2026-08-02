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
You are generating a Hangman hint.

Word: "${word}"

Requirements:
- Write exactly one hint.
- Maximum 10 words.
- The hint must accurately describe the word's primary meaning.
- Do NOT include the word itself or any part of it.
- Do NOT reveal any letters.
- Do NOT mention the number of letters.
- Do NOT use synonyms that make the answer obvious.
- If the word has multiple meanings, use the most common one.
- At the end, append the grammatical form in parentheses, such as:
  - (Noun)
  - (Plural noun)
  - (Verb - Present)
  - (Verb - Past)
  - (Verb - Present participle)
  - (Adjective)
  - (Adverb)

Output only the hint.
        `,
      },
    ],
  });

  return completion.choices[0].message.content;
}
