const groq = require('../config/groqConfig');

const generateFlashcards = async (req, res, next) => {
  try {
    const notes = req.body.notes || '';

    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return res.status(400).json({ error: 'Notes content is required' });
    }

    const prompt = `
Create flashcards from the following notes. Follow the format and rules strictly:

FORMAT:
[Q] Your question here  
[A] Your concise answer here
[D] Difficulty level (Easy/Medium/Hard)

RULES:
1. Each flashcard MUST have [Q], [A], and [D].
2. Difficulty levels:
   - Easy: Simple recall, definitions
   - Medium: Application, understanding concepts
   - Hard: Complex analysis, multi-step reasoning
3. DO NOT repeat [A] multiple times inside the same card.
4. DO NOT add topics, symbols, or explanations outside the structure.
5. Generate as many flashcards as needed to cover every individual idea.
6. Keep answers concise (1–2 lines) but technically complete.
7. Avoid grouping multiple ideas in a single answer.

NOTES:
${notes}
`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "groq/compound",
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
    const lines = block.trim().split("\n");
    const questionLine = lines[0];
    
    let answerText = '';
    let difficulty = 'Medium';
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].match(/^\[D\]/i)) {
        difficulty = lines[i].replace(/^\[D\]\s*/i, "").trim();
      } else if (lines[i].match(/^\[A\]/i)) {
        answerText = lines.slice(i).join("\n").replace(/^\[A\]\s*/i, "").replace(/\[D\].*$/i, "").trim();
        break;
      }
    }

    if (questionLine && answerText) {
      cards.push({
        question: questionLine.trim(),
        answer: answerText,
        difficulty: difficulty
      });
    }
  }

  return cards;
}

module.exports = {
  generateFlashcards
};
