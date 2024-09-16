import { useEffect, useState } from "react";

export default function ChatAction() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]) as any;

  const surpriseOptions = [
    "Who won the latest nobel peace prize",
    "where do they make BLT sandwich",
    "where does pizza comes from",
  ];

  // [
  //   {
  //     role: "user",
  //     parts: [{ text: "Hello" }],
  //   },
  //   {
  //     role: "model",
  //     parts: [{ text: "Great to meet you. What would you like to know?" }],
  //   },
  // ],

  const surprise = () => {
    const randomSurprise =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setInput(randomSurprise);
  };

  const getResponse = async () => {
    if (!input) {
      setError("Error: please ask a question");
      return;
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: input,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("/api/token.json", options);
      const data: any = await response.text();
      // console.log(data);

      setChatHistory((oldHistory: any) => [
        ...oldHistory,
        {
          role: "user",
          parts: [{ text: input }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);

      console.log(chatHistory);

      setInput("");
    } catch (error) {
      console.log("Error:", error);
      setError("Something went wrong!");
    }
  };

  const clear = () => {
    setInput("")
    setError("")
    setChatHistory([])
  }
  // console.log(chatHistory);

  return (
    <div className="bg-[#fafafc] text-[#777] h-screen text-sm w-full px-4">
      <div className=" max-w-5xl mx-auto py-10">
        <section className="flex gap-4 items-center">
          <p>What do you want to know?</p>
          <button
            className="bg-[#ececf1] text-black rounded-md font-bold py-1 px-4 border border-[#ececf1] hover:border-black"
            onClick={surprise}
            disabled={chatHistory.length > 0}
          >
            Surprise me
          </button>
        </section>

        <div className="border border-[#cacaca] mt-4 rounded-md shadow flex overflow-hidden">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="When is christmas?"
            className="outline-none text-[14px] placeholder:text-[15px] border-none px-4 py-3  flex-1   h-full"
          />
          {error ? (
            <button className="border px-8 active:bg-[#cacaca] " onClick={clear}>Clear</button>
          ) : (
            <button
              className="border border- px-8 active:bg-[#cacaca] "
              onClick={getResponse}
            >
              Ask me{" "}
            </button>
          )}
        </div>

        {error && <p>{error}</p>}

        <div className="mt-4 overflow-auto">
          {chatHistory.map((message: any, index: any) => (
            <div key={index} className="">
              <p className="border border-[#cacaca] py-3 px-4 rounded-md mx-4">
                {message.role} :
                {message.parts.map((part: any, partIndex: any) => (
                  <>
                    {/* <p key={partIndex}>{part.text}</p> */}
                    {part.text}
                  </>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
