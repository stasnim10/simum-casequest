export function suggestFollowups({ step, answers, caseData }) {
  if (step === 0) return [
    'What clarifying questions would help narrow the scope?',
    'What assumptions should we validate first?'
  ];
  if (step === 1) return [
    'What is the 1-2 sentence hypothesis linking drivers to the outcome?',
    'Which branch would you test first and why?'
  ];
  if (step === 2) return [
    'Name the top 3 drivers that would confirm or refute this hypothesis.',
    'How would you size the impact quickly?'
  ];
  if (step === 3) return [
    'Quantify revenue, cost, and margin with any assumptions you are making.',
    'What sensitivity would you run first?'
  ];
  if (step === 4) return [
    'State a crisp recommendation with impact, risk, and next step.',
    'What metric would you monitor in week one?'
  ];
  return [];
}
