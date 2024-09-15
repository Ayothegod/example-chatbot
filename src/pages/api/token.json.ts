// import fs, { writeFile } from "fs/promises";
// import path from "path";
import type { APIRoute } from "astro";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const userMessage = body.message;

    const genAI = new GoogleGenerativeAI(import.meta.env.NEW_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    let result = await chat.sendMessage("I have 2 dogs in my house.");
    console.log(result.response.text());
    result = await chat.sendMessage("How many paws are in my house?");
    console.log(result.response.text());

    return new Response(JSON.stringify({ reply: "text" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the AI response:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the AI response" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export async function GET({}) {
  return new Response(JSON.stringify({ msg: "Gemini pro builders" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
