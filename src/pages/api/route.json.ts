import { GoogleGenerativeAI } from "@google/generative-ai";
import type { APIRoute } from "astro";
const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

export async function GET({}) {
  // const gemini_api = import.meta.env.GEMINI_API_KEY;
  return new Response(JSON.stringify({ msg: "Welcome to astro, the builders",  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
 try {
   const body = await request.json();
   const userMessage = body.message;
 
   const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
   const result = await model.generateContent(userMessage);
   const response = await result.response;
   const text = await response.text();
 
   return new Response(JSON.stringify({ reply: text  }), {
     status: 200,
     headers: {
       "Content-Type": "application/json",
     },
   });
 } catch (error) {
   console.error("Error processing the AI response:", error);
   return new Response(JSON.stringify({ error: "Failed to process the AI response"   }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
 }
}
