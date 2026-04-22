export const askAI = async (message, history = []) => {
  const res = await fetch(process.env.AI_URL + "/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, history })
  });

  if (!res.ok) {
    throw new Error("AI service failed");
  }

  const data = await res.json();

  return data.reply;
};