require ('dotenv').config();
const { GEMINI_API_KEY } = process.env;
const { axios_cps } = require('./req_cps')

// const model = 'gemini-1.5-flash';
const model = 'gemini-2.0-flash-lite-preview-02-05';
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

const text = "Which model version are you?"

const requestOptions = {
  url: url,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    contents: [{
      parts: [{text}]
    }]
  })
};

axios_cps(requestOptions)(
  (response) => {
    console.log(response.data.candidates[0].content.parts[0].text);
  },
  (error) => {
    console.error(error);
  }
)
