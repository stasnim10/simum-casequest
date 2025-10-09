import OpenAI from 'openai';

// Demo responses for when API key is not available
const demoResponses = {
  'market-sizing': [
    "Great! Let's work on estimating the market size for electric vehicles in the US. How would you approach this problem?",
    "Good thinking! What factors would you consider when estimating the total addressable market?",
    "Excellent! Now, how would you break down the US population to estimate potential EV buyers?",
    "That's a solid approach. What about the adoption rate - how would you factor that in?"
  ],
  'profitability': [
    "Let's analyze why this retail chain is losing money. What framework would you use?",
    "Good! The profit equation is Revenue - Costs. Which would you examine first?",
    "Excellent approach. How would you break down the revenue streams?",
    "That makes sense. What cost categories should we investigate?"
  ],
  'market-entry': [
    "Should our tech company enter the Indian market? How would you structure this analysis?",
    "Great framework! What market factors would you evaluate first?",
    "Good thinking. How would you assess the competitive landscape?",
    "Excellent. What about regulatory and operational considerations?"
  ],
  'operations': [
    "This factory has efficiency issues. How would you diagnose the problems?",
    "Good approach! What operational metrics would you examine?",
    "That's smart. How would you identify bottlenecks in the process?",
    "Excellent thinking. What solutions would you prioritize?"
  ]
};

let responseIndex = 0;

// Use environment variable for security - falls back to demo mode
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export const generateCaseResponse = async (messages, caseType = 'market-sizing') => {
  if (!openai) {
    // Demo mode with realistic responses
    const responses = demoResponses[caseType] || demoResponses['market-sizing'];
    const response = responses[responseIndex % responses.length];
    responseIndex++;
    
    // Add slight delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response + " (Demo Mode - Add OpenAI API key for full AI functionality)";
  }

  const getCasePrompt = (type) => {
    const prompts = {
      'market-sizing': 'Help estimate the market size for electric vehicles in the US.',
      'profitability': 'A retail chain is losing money. Help identify why and what to do.',
      'market-entry': 'Should a tech company enter the Indian market?',
      'operations': 'A factory has efficiency issues. How would you improve operations?'
    };
    return prompts[type] || prompts['market-sizing'];
  };

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
        ...messages.slice(-10)
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI service error:', error);
    // Fall back to demo mode on error
    const responses = demoResponses[caseType] || demoResponses['market-sizing'];
    return responses[responseIndex++ % responses.length] + " (AI temporarily unavailable)";
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
