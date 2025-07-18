import OpenAI from "openai";

// Initialize OpenAI with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CreativeIdea {
  title: string;
  description: string;
  category: 'business' | 'content' | 'product' | 'service' | 'marketing' | 'automation';
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: string;
  potentialRevenue: string;
  requiredSkills: string[];
  nextSteps: string[];
  inspiration: string;
}

export interface ContentIdea {
  title: string;
  description: string;
  type: 'blog' | 'video' | 'social' | 'email' | 'course' | 'podcast';
  audience: string;
  keyPoints: string[];
  callToAction: string;
  estimatedTime: string;
}

export async function generateCreativeIdeas(
  userContext: {
    industry?: string;
    skills?: string[];
    interests?: string[];
    currentProjects?: string[];
    goals?: string[];
  },
  ideaType: 'business' | 'content' | 'product' | 'mixed' = 'mixed',
  count: number = 3
): Promise<CreativeIdea[]> {
  try {
    const prompt = `
    As a creative AI assistant for solopreneurs, generate ${count} innovative and inspiring ${ideaType} ideas based on this context:

    User Context:
    - Industry: ${userContext.industry || 'General Business'}
    - Skills: ${userContext.skills?.join(', ') || 'Various'}
    - Interests: ${userContext.interests?.join(', ') || 'Technology, Business'}
    - Current Projects: ${userContext.currentProjects?.join(', ') || 'None specified'}
    - Goals: ${userContext.goals?.join(', ') || 'Growth and Success'}

    Generate creative, actionable, and inspiring ideas that could spark new projects or directions. Each idea should be:
    - Innovative but achievable
    - Tailored to the user's context
    - Inspiring and motivational
    - Practical with clear next steps

    Return the ideas in JSON format with the following structure for each idea:
    {
      "title": "Compelling title",
      "description": "Detailed description of the idea",
      "category": "business|content|product|service|marketing|automation",
      "difficulty": "easy|medium|hard",
      "timeToImplement": "estimated time",
      "potentialRevenue": "revenue potential description",
      "requiredSkills": ["skill1", "skill2"],
      "nextSteps": ["step1", "step2", "step3"],
      "inspiration": "motivational message about this idea"
    }

    Focus on ideas that leverage AI tools, automation, and modern digital opportunities.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative AI assistant specializing in generating innovative business and content ideas for solopreneurs. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.8
    });

    const result = JSON.parse(response.choices[0].message.content || '{"ideas": []}');
    return result.ideas || [];
  } catch (error) {
    console.error('Error generating creative ideas:', error);
    return [];
  }
}

export async function generateContentIdeas(
  topic: string,
  contentType: 'blog' | 'video' | 'social' | 'email' | 'course' | 'podcast' | 'mixed' = 'mixed',
  targetAudience: string = 'solopreneurs',
  count: number = 3
): Promise<ContentIdea[]> {
  try {
    const prompt = `
    Generate ${count} creative content ideas about "${topic}" for ${targetAudience}.
    
    Content type focus: ${contentType}
    
    Each idea should be:
    - Engaging and valuable to the target audience
    - Actionable and practical
    - Unique and fresh perspective
    - Include clear value proposition

    Return in JSON format with this structure:
    {
      "ideas": [
        {
          "title": "Compelling title",
          "description": "Detailed description",
          "type": "blog|video|social|email|course|podcast",
          "audience": "target audience",
          "keyPoints": ["point1", "point2", "point3"],
          "callToAction": "clear call to action",
          "estimatedTime": "time to create"
        }
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative content strategist specializing in generating engaging content ideas for digital entrepreneurs."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || '{"ideas": []}');
    return result.ideas || [];
  } catch (error) {
    console.error('Error generating content ideas:', error);
    return [];
  }
}

export async function generateInspirationalQuote(context: string = 'solopreneurship'): Promise<string> {
  try {
    const prompt = `
    Generate an inspiring and motivational quote related to ${context}. 
    The quote should be:
    - Original and unique
    - Motivational and uplifting
    - Relevant to entrepreneurs and creators
    - Memorable and shareable
    - Between 10-30 words

    Return just the quote without quotation marks.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an inspirational quote generator specializing in entrepreneurship and creativity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.9
    });

    return response.choices[0].message.content?.trim() || "Every great journey begins with a single step forward.";
  } catch (error) {
    console.error('Error generating inspirational quote:', error);
    return "Every great journey begins with a single step forward.";
  }
}

export async function generateProjectName(description: string): Promise<string> {
  try {
    const prompt = `
    Generate a creative, memorable project name for this description:
    "${description}"

    The name should be:
    - Catchy and memorable
    - Professional yet creative
    - Easy to pronounce and spell
    - Relevant to the project
    - 1-3 words maximum

    Return just the project name without quotes or explanations.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative naming specialist for business projects and ventures."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 50,
      temperature: 0.8
    });

    return response.choices[0].message.content?.trim() || "Project Alpha";
  } catch (error) {
    console.error('Error generating project name:', error);
    return "Project Alpha";
  }
}