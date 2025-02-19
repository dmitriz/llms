require ('dotenv').config();
const { env: { GEMINI_API_KEY } } = process;
console.log(GEMINI_API_KEY);
