const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const translateTexts = async (texts) => {
  try {
    const response = await fetch(
      `${API_URL}/api/translate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts,
          source: "EN",
          target: "HI",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Translation failed"
      );
    }

    return data.translations;
  } catch (error) {
    console.error(
      "Translation service error:",
      error
    );

    return null;
  }
};