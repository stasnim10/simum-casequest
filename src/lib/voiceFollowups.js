import { fetchAIFollowups } from './followupsAPI';

const fallbackFollowups = {
  0: ['What clarifying questions would help narrow the scope?', 'What assumptions should we validate first?'],
  1: ['What is the 1-2 sentence hypothesis linking drivers to the outcome?', 'Which branch would you test first and why?'],
  2: ['Name the top 3 drivers that would confirm or refute this hypothesis.', 'How would you size the impact quickly?'],
  3: ['Quantify revenue, cost, and margin with any assumptions you are making.', 'What sensitivity would you run first?'],
  4: ['State a crisp recommendation with impact, risk, and next step.', 'What metric would you monitor in week one?']
};

export async function suggestFollowups({ step, answers, caseData }) {
  const aiFollowups = await fetchAIFollowups({
    step,
    caseTitle: caseData?.title,
    userAnswer: getCurrentAnswer(step, answers),
    previousAnswers: getPreviousAnswers(step, answers)
  });
  
  return aiFollowups || fallbackFollowups[step] || [];
}

function getCurrentAnswer(step, answers) {
  if (step === 0) return answers.clarifying?.filter(Boolean).join('; ');
  if (step === 1) return answers.hypothesis;
  if (step === 2) return answers.structure;
  if (step === 3) return JSON.stringify(answers.quant);
  if (step === 4) return answers.recommendation;
  return '';
}

function getPreviousAnswers(step, answers) {
  const prev = {};
  if (step > 0) prev.clarifying = answers.clarifying;
  if (step > 1) prev.hypothesis = answers.hypothesis;
  if (step > 2) prev.structure = answers.structure;
  if (step > 3) prev.quant = answers.quant;
  return Object.keys(prev).length ? prev : null;
}
