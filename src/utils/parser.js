export function parseMCQs(text) {
  if (!text || text.trim() === "") {
    throw new Error("MCQ input is empty.");
  }

  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== "");

  const title = lines[0];
  const questions = [];
  let currentQuestion = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Detect questions (supports multiple formats)
    if (/^(Q\.?\s*\d+|\d+)[).]?\s+/i.test(line)) {
      if (currentQuestion) {
        if (currentQuestion.options.length !== 4) {
          throw new Error(
            `Each question must have exactly 4 options: "${currentQuestion.question}"`
          );
        }
        questions.push(currentQuestion);
      }

      currentQuestion = {
        question: line.replace(/^(Q\.?\s*\d+|\d+)[).]?\s+/i, ""),
        options: [],
        correctAnswer: null,
        points: 10
      };
    }

    // Detect options (A, B, C, D)
    else if (/^[A-Da-d][).]\s*/.test(line)) {
      if (!currentQuestion) {
        throw new Error("Option found before a question.");
      }

      let optionText = line.replace(/^[A-Da-d][).]\s*/, "");
      const isCorrect = optionText.includes("*");

      optionText = optionText.replace("*", "").trim();
      currentQuestion.options.push(optionText);

      if (isCorrect) {
        currentQuestion.correctAnswer =
          currentQuestion.options.length - 1;
      }
    }
  }

  // Push the last question
  if (currentQuestion) {
    if (currentQuestion.options.length !== 4) {
      throw new Error(
        `Each question must have exactly 4 options: "${currentQuestion.question}"`
      );
    }
    questions.push(currentQuestion);
  }

  if (questions.length === 0) {
    throw new Error("No valid MCQs detected. Please check the format.");
  }

  return { title, questions };
}