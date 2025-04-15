import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = import.meta.env.VITE_OPENAI_API_URL;
console.log(API_KEY, API_URL);

export async function analyzeImage(imageUrl: string, orderDetails: string) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-vision-preview",
        messages: [
          { role: "system", content: "You are an AI that verifies restaurant orders before delivery." },
          { role: "user", content: `Does this image contain the correct items: ${JSON.stringify(orderDetails)}?` },
          { role: "user", content: { type: "image_url", image_url: imageUrl } }
        ]
      },
      { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing image:", error);
  }
}