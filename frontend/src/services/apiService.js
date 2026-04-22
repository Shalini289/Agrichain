const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic request handler
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
};