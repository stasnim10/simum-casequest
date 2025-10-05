import OpenAI from 'openai';

// For production deployment, you need to add your API key here temporarily
// OR set it as a GitHub secret for automated deployment
const apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';

const openai = apiKey && apiKey !== 'YOUR_OPENAI_API_KEY_HERE' ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
}) : null;

const getCasePrompt = (caseType) => {
  const prompts = {
    'market-sizing': 'Help estimate the market size for electric vehicles in the US.',
    'profitability': 'A retail chain is losing money. Help identify why and what to do.',
    'market-entry': 'Should a tech company enter the Indian market?',
    'operations': 'A factory has efficiency issues. How would you improve operations?'
  };
  return prompts[caseType] || prompts['market-sizing'];
};

export const generateCaseResponse = async (messages, caseType = 'market-sizing') => {
  if (!openai) {
    return `AI features are currently unavailable. This is a demo mode - please describe your approach to this ${caseType.replace('-', ' ')} case: ${getCasePrompt(caseType)}`;
  }

  const systemPrompt = `You are an experienced McKinsey case interviewer conducting a ${caseType.replace('-', ' ')} case interview.

Case: ${getCasePrompt(caseType)}

Guidelines:
- Ask one question at a time
- Provide hints when the candidate struggles  
- Give constructive feedback
- Keep responses concise (2-3 sentences max)
- Guide the candidate through the case structure
- Be encouraging but challenging
- Use frameworks like MECE, profitability trees, market sizing approaches`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-10) // Keep last 10 messages for context
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI service error:', error);
    if (error.status === 401) {
      return "API key issue detected. Please check your OpenAI configuration.";
    }
    return "I'm having trouble connecting right now. Let's continue with the case - what's your initial approach?";
  }
};

export const generateFeedback = async (userResponse, caseContext) => {
  if (!openai) {
    return "Good thinking! Continue with your analysis.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Provide brief, constructive feedback on the candidate's case interview response. Focus on structure, logic, and next steps."
        },
        {
          role: "user",
          content: `Case context: ${caseContext}\nCandidate response: ${userResponse}`
        }
      ],
      max_tokens: 100,
      temperature: 0.5
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Feedback generation error:', error);
    return "Good thinking! Let's continue.";
  }
};
