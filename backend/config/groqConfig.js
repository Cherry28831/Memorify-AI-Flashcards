const Groq = require("groq");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

module.exports = groq;