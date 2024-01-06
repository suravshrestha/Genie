import { log } from "../utils/logger";
import { getApiKey } from "../utils/getApiKey";

import OpenAI from "openai";

export async function getModelResponse(code: string, action: string) {
  const openai = new OpenAI({
    apiKey: await getApiKey(),
  });

  let prompt = "";

  if (action === "document") {
    prompt = `Given the following code snippet ${code} include comprehensive docstrings directly within the code, do not modify the actual code. Assume the audience has intermediate-level programming knowledge. Do not provide documentation as a separate text; instead, incorporate it as docstrings and comments within the code.`;
  } else if (action === "explain") {
    prompt = `Given the following code snippet ${code} explain what the code does. Assume the audience has intermediate-level programming knowledge.`;
  }

  try {
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
