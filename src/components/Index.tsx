import React, { useState } from "react";

export default function ReactIndex() {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  const [showQuickResponses, setShowQuickResponses] = useState(true);

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      sendMessage(input);
      e.preventDefault();
    }
  };

  const quickResponse = (text: string) => {
    sendMessage(text);
    setShowQuickResponses(false);
  };

  const sendMessage = async (message: any) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setShowQuickResponses(false);

    const newMessage = { id: Date.now(), text: trimmedMessage, sender: "user" };
    setMessages((messages: any) => [...messages, newMessage]);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trimmedMessage }),
    });
    const { reply } = await response.json();
    const formattedReply = formatText(reply);

    setMessages((messages: any) => [
      ...messages,
      { id: Date.now() + 1, text: formattedReply, sender: "bot" },
    ]);
  };

  const formatText = (text: any) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedText = formattedText
      .split("\n")
      .map((line: any) => {
        if (line.trim().startsWith("* ")) {
          return `<li>${line.trim().substring(2)}</li>`;
        }
        return line;
      })
      .join("\n");

    if (formattedText.includes("<li>")) {
      formattedText = `<ul>${formattedText}</ul>`;
    }

    return formattedText;
  };

  const renderMessage = (msg: any) => {
    if (msg.sender === 'bot') {
        return <p key={msg.id} className="botMessage" dangerouslySetInnerHTML={{ __html: msg.text }}></p>;
    } else {
        return <p key={msg.id} className="userMessage">{msg.text}</p>;
    }
};

  return (
    <div className="container">
      <div className="chatArea">
        {messages.map((msg: any) => renderMessage(msg))}
        {showQuickResponses && (
          <div className="quickResponses">
            <button onClick={() => quickResponse("Hello!")}>Hello</button>
            <button
              onClick={() => quickResponse("Give a quick tip for a developer")}
            >
              Quick Tip
            </button>
            <button onClick={() => quickResponse("Tell me a joke!")}>
              Tell a Joke
            </button>
          </div>
        )}
      </div>
      <div className="controls">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input"
        />
        <button onClick={() => sendMessage(input)} className="sendButton">
          Send
        </button>
      </div>
    </div>
  );
}
