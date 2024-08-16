import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { input } = req.body;

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Calculate the following: ${input}`,
        max_tokens: 50,
      });

      const result = completion.data.choices[0].text.trim();
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: "Error calculating" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
