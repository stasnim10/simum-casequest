// Smart Case AI - Zero-cost intelligent case interviewing
class SmartCaseAI {
  constructor() {
    this.sessionState = {
      currentStep: 'introduction',
      userResponses: [],
      caseData: {},
      score: { structure: 0, math: 0, insight: 0 },
      hintsUsed: 0
    };
  }

  // Analyze user response for keywords and patterns
  analyzeResponse(response) {
    const text = response.toLowerCase();
    const analysis = {
      hasStructure: /framework|mece|structure|first|second|third|step/.test(text),
      hasMath: /\d+|calculate|estimate|multiply|divide|percent|million|billion/.test(text),
      hasInsight: /because|therefore|however|insight|recommend|suggest/.test(text),
      mentionsPricing: /price|pricing|cost|revenue|margin/.test(text),
      mentionsMarket: /market|customer|segment|size|demand/.test(text),
      mentionsCompetition: /competitor|competition|competitive|market share/.test(text),
      isQuestion: /\?/.test(text),
      length: response.length
    };
    
    return analysis;
  }

  // Get next AI response based on context and user input
  getResponse(userInput, caseType = 'profitability') {
    const analysis = this.analyzeResponse(userInput);
    this.sessionState.userResponses.push({ input: userInput, analysis });
    
    // Update scores based on analysis
    if (analysis.hasStructure) this.sessionState.score.structure += 10;
    if (analysis.hasMath) this.sessionState.score.math += 10;
    if (analysis.hasInsight) this.sessionState.score.insight += 10;

    const response = this.generateContextualResponse(analysis, caseType);
    
    return {
      message: response.message,
      feedback: response.feedback,
      hint: response.hint,
      score: this.sessionState.score,
      nextStep: response.nextStep
    };
  }

  generateContextualResponse(analysis, caseType) {
    const responses = this.getCaseResponses(caseType);
    const currentResponses = this.sessionState.userResponses;
    const stepCount = currentResponses.length;

    // Introduction phase
    if (stepCount === 1) {
      return this.getIntroductionResponse(analysis, responses);
    }
    
    // Structure phase
    if (stepCount <= 3) {
      return this.getStructureResponse(analysis, responses);
    }
    
    // Deep dive phase
    if (stepCount <= 6) {
      return this.getDeepDiveResponse(analysis, responses, caseType);
    }
    
    // Conclusion phase
    return this.getConclusionResponse(analysis, responses);
  }

  getIntroductionResponse(analysis, responses) {
    if (analysis.hasStructure) {
      return {
        message: responses.positive.structure[Math.floor(Math.random() * responses.positive.structure.length)],
        feedback: "Great start with a structured approach!",
        nextStep: "deep_dive"
      };
    }
    
    if (analysis.isQuestion) {
      return {
        message: responses.clarifying[Math.floor(Math.random() * responses.clarifying.length)],
        feedback: "Good questions help clarify the problem.",
        hint: "Try structuring your approach using a framework like profitability = revenue - costs."
      };
    }
    
    return {
      message: responses.prompts.structure[Math.floor(Math.random() * responses.prompts.structure.length)],
      hint: "Consider using the MECE principle to structure your thinking."
    };
  }

  getStructureResponse(analysis, responses) {
    if (analysis.hasMath && analysis.hasStructure) {
      return {
        message: responses.positive.comprehensive[Math.floor(Math.random() * responses.positive.comprehensive.length)],
        feedback: "Excellent! You're combining structure with quantitative thinking."
      };
    }
    
    if (!analysis.hasMath && analysis.hasStructure) {
      return {
        message: responses.prompts.quantify[Math.floor(Math.random() * responses.prompts.quantify.length)],
        hint: "Try to put some numbers behind your framework."
      };
    }
    
    return {
      message: responses.prompts.elaborate[Math.floor(Math.random() * responses.prompts.elaborate.length)],
      hint: "Walk me through your reasoning step by step."
    };
  }

  getDeepDiveResponse(analysis, responses, caseType) {
    const caseSpecific = this.getCaseSpecificPrompts(caseType);
    
    if (analysis.hasInsight) {
      return {
        message: responses.positive.insight[Math.floor(Math.random() * responses.positive.insight.length)],
        feedback: "Strong business insight!"
      };
    }
    
    return {
      message: caseSpecific[Math.floor(Math.random() * caseSpecific.length)],
      hint: "Think about the business implications of your analysis."
    };
  }

  getConclusionResponse(analysis, responses) {
    const totalScore = Object.values(this.sessionState.score).reduce((a, b) => a + b, 0);
    
    if (totalScore > 60) {
      return {
        message: responses.conclusion.strong[Math.floor(Math.random() * responses.conclusion.strong.length)],
        feedback: `Excellent performance! Score: Structure ${this.sessionState.score.structure}, Math ${this.sessionState.score.math}, Insight ${this.sessionState.score.insight}`
      };
    }
    
    return {
      message: responses.conclusion.improvement[Math.floor(Math.random() * responses.conclusion.improvement.length)],
      feedback: `Good effort! Areas to improve: ${this.getImprovementAreas()}`,
      hint: "Practice more cases to strengthen your weak areas."
    };
  }

  getCaseResponses(caseType) {
    return {
      positive: {
        structure: [
          "That's a solid framework! Walk me through each component.",
          "Great structure. Let's dive deeper into each part.",
          "I like your systematic approach. Tell me more about the first bucket."
        ],
        comprehensive: [
          "Excellent! You're thinking both structurally and quantitatively.",
          "Perfect combination of framework and numbers. Continue with this approach.",
          "This is exactly the kind of structured, analytical thinking we look for."
        ],
        insight: [
          "That's a valuable insight! What led you to that conclusion?",
          "Interesting perspective. How would you test that hypothesis?",
          "Great business intuition. What are the implications?"
        ]
      },
      prompts: {
        structure: [
          "How would you structure this problem?",
          "What framework would you use to approach this?",
          "Let's break this down systematically. Where would you start?"
        ],
        quantify: [
          "Can you put some numbers behind that?",
          "How would you estimate that?",
          "What's your math on that assumption?"
        ],
        elaborate: [
          "Tell me more about your thinking there.",
          "Can you walk me through that logic?",
          "What factors are you considering?"
        ]
      },
      clarifying: [
        "That's a good question. For this case, assume...",
        "Let me clarify that point...",
        "Here's some additional context..."
      ],
      conclusion: {
        strong: [
          "Outstanding work! You demonstrated strong analytical skills and business judgment.",
          "Excellent case performance. Your structured approach and insights were impressive.",
          "Great job! You'd be ready for the next round."
        ],
        improvement: [
          "Good effort! Focus on being more structured in your approach.",
          "Nice work. Practice quantifying your assumptions more.",
          "Solid attempt. Work on developing stronger business insights."
        ]
      }
    };
  }

  getCaseSpecificPrompts(caseType) {
    const prompts = {
      'profitability': [
        "What's driving the revenue decline?",
        "Have you considered the cost structure?",
        "What about pricing vs. volume effects?"
      ],
      'market-sizing': [
        "How would you estimate the market size?",
        "What's your approach to segmentation?",
        "Can you validate that assumption?"
      ],
      'new-product': [
        "What's the market opportunity?",
        "How would you assess competitive response?",
        "What are the key success factors?"
      ]
    };
    
    return prompts[caseType] || prompts['profitability'];
  }

  getImprovementAreas() {
    const areas = [];
    if (this.sessionState.score.structure < 20) areas.push("structure");
    if (this.sessionState.score.math < 20) areas.push("quantitative analysis");
    if (this.sessionState.score.insight < 20) areas.push("business insights");
    return areas.join(", ") || "overall approach";
  }

  // Get personalized practice recommendations
  getRecommendations() {
    const weak = this.getImprovementAreas();
    const recommendations = {
      structure: "Practice the MECE framework and case structuring",
      "quantitative analysis": "Work on market sizing and financial calculations", 
      "business insights": "Read business cases and practice hypothesis formation"
    };
    
    return Object.keys(recommendations)
      .filter(area => weak.includes(area))
      .map(area => recommendations[area]);
  }

  // Reset for new case
  reset(caseType) {
    this.sessionState = {
      currentStep: 'introduction',
      userResponses: [],
      caseData: {},
      score: { structure: 0, math: 0, insight: 0 },
      hintsUsed: 0,
      caseType
    };
  }
}

export default SmartCaseAI;
