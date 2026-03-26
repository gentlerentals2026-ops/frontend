export const parseJsonSafely = async (response) => {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const contentType = response.headers.get("content-type") || "";
    const looksLikeHtml = contentType.includes("text/html") || raw.trim().startsWith("<");

    if (looksLikeHtml) {
      throw new Error("The server returned an HTML page instead of JSON. Check the deployed API URL.");
    }

    throw new Error("The server returned an invalid JSON response.");
  }
};

export const getErrorMessage = (response, payload, fallbackMessage) => {
  if (payload?.message) {
    return payload.message;
  }

  if (response.status >= 500) {
    return "The server is unavailable right now. Please try again shortly.";
  }

  return fallbackMessage;
};
