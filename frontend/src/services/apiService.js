const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRequest = async (endpoint, options = {}) => {
  // ✅ Guard: catch misconfigured env early
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const { headers, ...restOptions } = options;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { // ✅ removed extra "/"
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers, // ✅ cleaner spread, headers already defaults to undefined safely
      },
      ...restOptions, // ✅ spread rest AFTER headers so options.headers doesn't override the merged headers
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || `API Error ${res.status}`); // ✅ include status code
    }

    return data;

  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
};