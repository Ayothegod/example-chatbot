// import { GoogleGenerativeAI } from "@google/generative-ai";
// import type { APIRoute } from "astro";
// const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

// export async function GET({}) {
//   return new Response(JSON.stringify({ msg: "Welcome to astro, the builders",  }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// export const POST: APIRoute = async ({ request }) => {
//  try {
//    const body = await request.json();
//    const userMessage = body.message;
 
//    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
//    const result = await model.generateContent(userMessage);
//    const response = await result.response;
//    const text = await response.text();
 
//    return new Response(JSON.stringify({ reply: text  }), {
//      status: 200,
//      headers: {
//        "Content-Type": "application/json",
//      },
//    });
//  } catch (error) {
//    console.error("Error processing the AI response:", error);
//    return new Response(JSON.stringify({ error: "Failed to process the AI response"   }), {
//     status: 500,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//  }
// }



import type { APIContext } from 'astro';
import { writeFile } from 'fs/promises';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename);
console.log(__dirname);

// File routes export a get() function, which gets called to generate the file.
// Return an object with `body` to save the file contents in your final build.
export async function post({ params, request }: APIContext) {
  const formData = await request.formData();
  await Promise.all(
    formData
      .getAll('files')
      .map(async (file: File) =>
        writeFile(
          resolve(__dirname, 'tmp', file.webkitRelativePath ?? file.name),
          new Uint8Array(await file.arrayBuffer())
        )
      )
  );

  return {
    body: JSON.stringify({
      fileNames: await Promise.all(
        formData.getAll('files').map(async (file: File) => {
          return {
            webkitRelativePath: file.webkitRelativePath,
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type,
            buffer: {
              type: 'Buffer',
              value: Array.from(
                new Int8Array(await file.arrayBuffer()).values()
              ),
            },
          };
        })
      ),
    }),
  };
}


---
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Welcome to Astro</title>
	</head>

	<body>
		<button type="button" class="button">Send FormData post request</button>
		<div class="results"></div>

		<script src="/src/index.ts"></script>
	</body>
</html>


const btn = document.querySelector('.button');
const results = document.querySelector('.results');

btn.addEventListener('click', async (e: MouseEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append(
    'files',
    new File(
      [new Blob([new TextEncoder().encode('Lorem Ipsium')])],
      'new-file.txt',
      { type: 'text/plain' }
    )
  );

  const res = await fetch('/cool-profile', {
    method: 'POST',
    body: formData,
  });
  const result = await res.json();
  results.textContent = JSON.stringify(result);
});


// export async function POST({ request }: APIContext) {
//   const formData = await request.formData();

//   console.log("Hitted:", formData);

//   const data = JSON.stringify({
//     fileNames: await Promise.all(
//       formData.getAll("files").map(async (file: any) => {
//         return {
//           webkitRelativePath: file.webkitRelativePath,
//           lastModified: file.lastModified,
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           buffer: {
//             type: "Buffer",
//             value: Array.from(new Int8Array(await file.arrayBuffer()).values()),
//           },
//         };
//       })
//     ),
//   });

//   return new Response(JSON.stringify({ data: data }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }