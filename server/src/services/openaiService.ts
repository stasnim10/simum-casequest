import OpenAI from 'openai';
import { config } from '../config.js';

export async function getFeedbackFromModel(prompt: string): Promise<string> {
  // DEV mock for local verification without keys
  if (process.env.DEV_MOCK === '1' || !config.openaiKey) {
    const mock = {
      strengths: ["Clear hypothesis path", "Strong numeracy under time pressure"],
      gaps: ["Structure was not fully MECE in the market branch", "Recommendation lacked quantified risk"],
      actionItems: [
        "Rehearse a 3-level issue tree for profitability",
        "State explicit assumptions before math",
        "Close with impact, risk, next step format"
      ],
      scorecard: { structuring: 72, quant: 81, insight: 68, communication: 74, overall: 74 },
      nextBestLessonId: "profitability-201"
    };
    return JSON.stringify(mock);
  }

  const client = new OpenAI({ apiKey: config.openaiKey });
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a consulting case coach. Return only valid JSON per schema.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  });
  return res.choices[0]?.message?.content ?? '{}';
}
