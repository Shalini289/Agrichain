export const askAI = async (message, history = []) => {
  const aiUrl = process.env.AI_URL || "http://localhost:8000";
  const res = await fetch(`${aiUrl}/chat/`, {
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

export const getAIPrediction = async () => {
  const aiUrl = process.env.AI_URL || "http://localhost:8000";
  const res = await fetch(`${aiUrl}/chat/predict`);

  if (!res.ok) {
    throw new Error("AI prediction service failed");
  }

  return res.json();
};
