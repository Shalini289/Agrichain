"use client";
import { useState } from "react";

export default function Chatbot() {
  const [messages,setMessages] = useState([]);
  const [input,setInput] = useState("");

  const send = async () => {
    const res = await fetch("/api/chat", {
      method:"POST",
      body: JSON.stringify({message:input}),
      headers:{"Content-Type":"application/json"}
    });

    const data = await res.json();

    setMessages([...messages,
      {role:"user",text:input},
      {role:"bot",text:data.reply}
    ]);
  };

  return (
    <div style={{position:"fixed",bottom:20,right:20}}>
      {messages.map((m,i)=><p key={i}>{m.text}</p>)}
      <input onChange={e=>setInput(e.target.value)}/>
      <button onClick={send}>Send</button>
    </div>
  );
}