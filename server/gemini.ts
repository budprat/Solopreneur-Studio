import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface BusinessInsight {
  type: 'opportunity' | 'risk' | 'trend' | 'forecast' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionItems: string[];
  priority: number;
}

export interface PersonalizedRecommendation {
  category: 'productivity' | 'business' | 'ai-tools' | 'clients' | 'revenue';
  title: string;
  description: string;
  reasoning: string;
  expectedBenefit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: string;
  steps: string[];
}

export async function generateBusinessInsights(userData: any): Promise<BusinessInsight[]> {
  try {
    const prompt = `
    As an AI business advisor for solopreneurs, analyze the following business data and provide actionable insights:

    Business Data:
    - Monthly Revenue: $${userData.monthlyRevenue || 0}
    - Active Projects: ${userData.activeProjects || 0}
    - Completed Projects: ${userData.completedProjects || 0}
    - AI Tools Used: ${userData.aiToolsCount || 0}
    - Prompt Library Size: ${userData.promptCount || 0}
    - Average Response Time: ${userData.avgResponseTime || 'N/A'}
    - Client Satisfaction: ${userData.clientSatisfaction || 'N/A'}

    Provide 4-6 specific, actionable business insights in JSON format. Each insight should include:
    - type: 'opportunity', 'risk', 'trend', 'forecast', or 'recommendation'
    - title: Clear, concise title
    - description: Detailed explanation
    - impact: 'high', 'medium', or 'low'
    - confidence: Number between 60-95
    - actionItems: Array of specific actions to take
    - priority: Number 1-10 (10 being highest priority)

    Focus on practical, implementable advice that can improve business performance.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" },
                  confidence: { type: "number" },
                  actionItems: { type: "array", items: { type: "string" } },
                  priority: { type: "number" }
                },
                required: ["type", "title", "description", "impact", "confidence", "actionItems", "priority"]
              }
            }
          },
          required: ["insights"]
        }
      },
      contents: prompt
    });

    const result = JSON.parse(response.text || '{"insights": []}');
    return result.insights || [];
  } catch (error) {
    console.error('Error generating business insights:', error);
    return [];
  }
}

export async function generatePersonalizedRecommendations(userData: any, userPreferences: any): Promise<PersonalizedRecommendation[]> {
  try {
    const prompt = `
    As a personalized AI assistant, create specific recommendations for this solopreneur based on their data and preferences:

    User Data:
    - Business Focus: ${userPreferences.businessFocus || 'General'}
    - Primary Goals: ${userPreferences.goals || 'Growth'}
    - Current Challenges: ${userPreferences.challenges || 'Time management'}
    - Work Style: ${userPreferences.workStyle || 'Flexible'}
    - Monthly Revenue: $${userData.monthlyRevenue || 0}
    - Active Projects: ${userData.activeProjects || 0}
    - AI Tools Proficiency: ${userData.aiProficiency || 'Intermediate'}

    Generate 3-5 personalized recommendations in JSON format. Each recommendation should include:
    - category: 'productivity', 'business', 'ai-tools', 'clients', or 'revenue'
    - title: Clear, actionable title
    - description: Detailed explanation
    - reasoning: Why this recommendation is valuable for this specific user
    - expectedBenefit: What the user can expect to gain
    - difficulty: 'easy', 'medium', or 'hard'
    - timeToImplement: Realistic time estimate
    - steps: Array of specific implementation steps

    Make recommendations highly specific to the user's situation and goals.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  reasoning: { type: "string" },
                  expectedBenefit: { type: "string" },
                  difficulty: { type: "string" },
                  timeToImplement: { type: "string" },
                  steps: { type: "array", items: { type: "string" } }
                },
                required: ["category", "title", "description", "reasoning", "expectedBenefit", "difficulty", "timeToImplement", "steps"]
              }
            }
          },
          required: ["recommendations"]
        }
      },
      contents: prompt
    });

    const result = JSON.parse(response.text || '{"recommendations": []}');
    return result.recommendations || [];
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    return [];
  }
}

export async function analyzePerformanceTrends(performanceData: any): Promise<string> {
  try {
    const prompt = `
    Analyze the following performance data and provide insights about trends and patterns:

    Performance Data:
    ${JSON.stringify(performanceData, null, 2)}

    Provide a comprehensive analysis including:
    1. Key trends identified
    2. Performance patterns
    3. Areas of improvement
    4. Potential risks or opportunities
    5. Specific recommendations

    Keep the analysis professional and actionable.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text || "Unable to analyze performance trends at this time.";
  } catch (error) {
    console.error('Error analyzing performance trends:', error);
    return "Error analyzing performance trends. Please try again later.";
  }
}

export async function generateContentSuggestions(topic: string, contentType: string): Promise<string[]> {
  try {
    const prompt = `
    Generate 5 creative content ideas for a solopreneur's business:

    Topic: ${topic}
    Content Type: ${contentType}

    Provide specific, actionable content ideas that would be valuable for their audience.
    Format as a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["suggestions"]
        }
      },
      contents: prompt
    });

    const result = JSON.parse(response.text || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating content suggestions:', error);
    return [];
  }
}

export async function optimizePrompt(originalPrompt: string, context: string): Promise<{
  optimizedPrompt: string;
  improvements: string[];
  expectedImprovement: string;
}> {
  try {
    const prompt = `
    Optimize this AI prompt for better performance:

    Original Prompt: "${originalPrompt}"
    Context: ${context}

    Provide an optimized version with:
    1. Improved clarity and specificity
    2. Better structure and formatting
    3. More effective instructions
    4. Context-appropriate tone

    Return the result in JSON format with:
    - optimizedPrompt: The improved prompt
    - improvements: Array of specific improvements made
    - expectedImprovement: Description of expected performance gains
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            optimizedPrompt: { type: "string" },
            improvements: { type: "array", items: { type: "string" } },
            expectedImprovement: { type: "string" }
          },
          required: ["optimizedPrompt", "improvements", "expectedImprovement"]
        }
      },
      contents: prompt
    });

    const result = JSON.parse(response.text || '{}');
    return {
      optimizedPrompt: result.optimizedPrompt || originalPrompt,
      improvements: result.improvements || [],
      expectedImprovement: result.expectedImprovement || "No specific improvements identified"
    };
  } catch (error) {
    console.error('Error optimizing prompt:', error);
    return {
      optimizedPrompt: originalPrompt,
      improvements: [],
      expectedImprovement: "Error occurred during optimization"
    };
  }
}