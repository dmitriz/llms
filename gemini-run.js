require ('dotenv').config();
const { env: { GEMINI_API_KEY } } = process;

const apiKey = GEMINI_API_KEY; // Replace with your actual API key
const model = 'gemini-1.5-flash';
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const prompt = {
  contents: [{
    parts: [{
      text: "Write a story about a magic backpack."
    }]
  }]
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(prompt),
})
.then(response => response.json())
.then(data => {
  console.log(data.candidates[0].content.parts[0].text);
  // Here you can process the response from the API and get the story from the data object, likely: data.candidates[0].content.parts[0].text
})
.catch(error => {
  console.error('Error:', error);
})
