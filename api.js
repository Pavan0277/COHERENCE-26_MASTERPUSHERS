const API_KEY = "AIzaSyBjfGddwhTcksLf_rYHPvjArjXO1j1S-xo";

async function callGemini() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Explain artificial intelligence in simple words"
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  console.log(data);
}

callGemini();