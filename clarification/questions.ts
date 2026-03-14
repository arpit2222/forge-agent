const vagueSignals = ["something", "anything", "app", "website", "platform", "tool"];

export function needsClarification(prompt: string) {
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  const tooShort = words.length < 6;
  const vague = vagueSignals.some((word) => prompt.toLowerCase().includes(word));
  return tooShort || vague;
}

export function clarificationQuestions(prompt: string) {
  const questions = [
    "Which tech stack do you prefer?",
    "Do you want authentication?",
    "Should a database be included?"
  ];
  if (prompt.toLowerCase().includes("dashboard")) {
    questions.push("What key metrics should the dashboard highlight?");
  }
  return questions.slice(0, 4);
}
