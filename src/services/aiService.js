import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateCaseResponse = async (messages, caseType = 'market-sizing') => {
  const systemPrompt = `You are an experienced McKinsey case interviewer conducting a ${caseType} case interview. 
  
  Guidelines:
  - Ask one question at a time
  - Provide hints when the candidate struggles
  - Give constructive feedback
  - Keep responses concise (2-3 sentences max)
  - Guide the candidate through the case structure
  - Be encouraging but challenging
  
  Current case: Help the candidate solve a market sizing problem step by step.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI service error:', error);
    return "I'm having trouble connecting right now. Let's continue with the case - what's your initial approach?";
  }
};

export const generateFeedback = async (userResponse, caseContext) => {
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
