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
1. Each flashcard MUST have only one [Q] and one [A].
2. DO NOT repeat [A] multiple times inside the same card.
3. DO NOT add topics, symbols, or explanations outside the [Q] and [A] structure.
4. Generate as many flashcards as needed to cover every individual idea.
5. Keep answers concise (1–2 lines) but technically complete.
6. Avoid grouping multiple ideas in a single answer.
7. Focus on clear understanding, not just recall.

NOTES:
${notes}
`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content || "";
    const flashcards = parseFlashcards(content);

    res.json({
      success: true,
      flashcards
    });

  } catch (error) {
    next(error);
  }
};

function parseFlashcards(text) {
  const cards = [];
  const blocks = text.split(/\[Q\]/i).slice(1);

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
