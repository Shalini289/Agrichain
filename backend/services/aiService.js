export const askAI = async (message, history = []) => {
  const aiUrl = process.env.AI_URL || "http://localhost:8000";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(`${aiUrl}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, history }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    throw new Error("AI service failed");
  }

  const data = await res.json();

  return data.reply;
};

export const getAIPrediction = async () => {
  const aiUrl = process.env.AI_URL || "http://localhost:8000";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const res = await fetch(`${aiUrl}/chat/predict`, { signal: controller.signal })
    .finally(() => clearTimeout(timeout));

  if (!res.ok) {
    throw new Error("AI prediction service failed");
  }

  return res.json();
};
