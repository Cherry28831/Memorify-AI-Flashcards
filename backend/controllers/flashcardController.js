const groq = require('../config/groqConfig');

const generateFlashcards = async (req, res, next) => {
  try {
    const { notes } = req.body;
    
    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return res.status(400).json({ error: 'Notes content is required' });
    }

    const prompt = `
    Create flashcards from the following notes. Follow the format and rules strictly:
    
    FORMAT:
    [Q] Your question here  
    [A] Your concise answer here  
    
    RULES:
    1. Generate as many flashcards as needed to cover **every individual idea**, even if it means 50 cards.
    Cover 100% of the notes.
    2. Each flashcard should cover **one concept only** (no grouping of ideas).
    3. Keep answers concise (1-2 lines max) but **technically complete**.
    4. Avoid very long answers—**split into multiple Q/A** if needed.
    5. Focus on **understanding**, not just recall.
    6. Include all technical terms and important keywords from the notes.
    7. No introduction or explanations.
    8. Don't add card numbers or any other formatting.
    
    NOTES:
    ${notes}
    `;
    

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.3,              // Less randomness
      max_tokens: 8192               // Allow more output
    });

    const content = response.choices[0]?.message?.content || "";
    const flashcards = parseFlashcards(content);

    res.json({
      success: true,
      flashcards: flashcards
    });

  } catch (error) {
    next(error);
  }
};

function parseFlashcards(text) {
  const cards = [];
  const blocks = text.split(/\[Q\]/i).slice(1); // Skip first empty split

  for (let block of blocks) {
    const [questionLine, ...answerLines] = block.trim().split("\n");
    const answerText = answerLines.join("\n").replace(/^\[A\]\s*/i, "").trim();
    
    if (questionLine && answerText) {
      cards.push({
        question: questionLine.trim(),
        answer: answerText
      });
    }
  }

  return cards;
}

module.exports = {
  generateFlashcards
};