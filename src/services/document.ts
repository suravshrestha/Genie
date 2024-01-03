import { log } from "../utils/logger";
import { getApiKey } from "../utils/getApiKey";

import OpenAI from "openai";

export async function document(code: string) {
  const openai = new OpenAI({
    apiKey: await getApiKey(),
  });

  try {
    const prompt = `Given the following code snippet ${code} include comprehensive docstrings directly within the code. Assume the audience has intermediate-level programming knowledge. Do not provide documentation as a separate text; instead, incorporate it as docstrings and comments within the code.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.25,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || "";

    log("Response:", response);

    return content;
  } catch (error: any) {
    log("Error:", error);
    throw error;
  }
}
