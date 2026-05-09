const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCRQBaXfFrAfuClZOw-rHzFGFQjl425MjY');

async function list() {
  try {
    const models = await genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    // wait, list models is available on the genAI instance or via fetch.
    // The easiest is just standard node-fetch to the endpoint:
  } catch (e) {
    console.error(e);
  }
}
// Using fetch to call the REST API directly:
async function fetchModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCRQBaXfFrAfuClZOw-rHzFGFQjl425MjY`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
fetchModels();
