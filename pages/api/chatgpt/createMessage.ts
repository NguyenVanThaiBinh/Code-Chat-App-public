import { NextApiRequest, NextApiResponse } from "next";

export default async function createMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = req.body;

  const api_1 = "sk-YXLPHwtprMOMPHEDMrXTT3Blb";
  const api_2 = "kFJuJKR4vPdDBsurAlCegha";
  const apiKey = api_1 + api_2;
  const url = "https://api.openai.com/v1/chat/completions";

  const body = JSON.stringify({
    messages,
    model: "gpt-3.5-turbo",
    max_tokens: 512,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });
    const data = await response.json();

    res.send(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
