// import fs, { writeFile } from "fs/promises";
// import path from "path";
import type { APIRoute } from "astro";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const userMessage = body.message;
    const chatHistory = body.history;

    const genAI = new GoogleGenerativeAI(import.meta.env.NEW_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: chatHistory,
    });

    let result = await chat.sendMessage(userMessage);
    let response = await result.response.text();

    console.log(response);

    return new Response(response, {
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
