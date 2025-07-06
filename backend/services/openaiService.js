const groq = require("../config/openai"); // Keep the filename for consistency

class OpenAIService {
  constructor() {
    this.systemPrompts = {
      "mental-health": `You are a compassionate AI assistant specializing in mental health support. You provide empathetic, supportive conversations while maintaining clear boundaries. Always remind users that you're not a replacement for professional mental health care. Be encouraging, validate feelings, and suggest healthy coping strategies. If someone mentions self-harm or suicide, immediately provide crisis resources.`,

      spiritual: `You are a wise and respectful AI assistant for spiritual guidance. You honor all spiritual traditions and beliefs. Provide thoughtful, non-dogmatic responses that encourage personal reflection and growth. Draw from various wisdom traditions when appropriate, but always respect the user's individual path and beliefs. Focus on inner peace, meaning, and spiritual development.`,

      general: `You are a helpful and supportive AI assistant. Be kind, empathetic, and provide thoughtful responses to user queries.`,
    };

    this.welcomeMessages = {
      "mental-health":
        "Hello! I'm here to provide a safe space for you to share your thoughts and feelings. Remember, while I can offer support and coping strategies, I'm not a replacement for professional mental health care. How are you feeling today?",

      spiritual:
        "Welcome, dear soul. I'm here to accompany you on your spiritual journey with wisdom and respect for all paths. Whether you seek guidance, reflection, or simply someone to listen to your spiritual thoughts, I'm here. What's on your heart today?",

      general:
        "Hello! I'm here to help and support you with whatever you'd like to discuss. How can I assist you today?",
    };
  }

  getWelcomeMessage(context = "general") {
    return this.welcomeMessages[context] || this.welcomeMessages.general;
  }

  async getChatResponse(messages, context = "general") {
    try {
      const systemMessage = {
        role: "system",
        content: this.systemPrompts[context] || this.systemPrompts.general,
      };

      const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192", // Using Groq's Llama model
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Groq API error:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  async generateChatTitle(messages) {
    try {
      const firstUserMessage =
        messages.find((msg) => msg.role === "user")?.content || "New Chat";

      const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192", // Using Groq's Llama model
        messages: [
          {
            role: "system",
            content:
              "Generate a short, descriptive title (4-6 words) for this conversation based on the user's first message. Make it empathetic and supportive.",
          },
          {
            role: "user",
            content: `Generate a title for a conversation that starts with: "${firstUserMessage}"`,
          },
        ],
        max_tokens: 20,
        temperature: 0.5,
      });

      return completion.choices[0].message.content.replace(/['"]/g, "").trim();
    } catch (error) {
      console.error("Error generating title:", error);
      return "New Chat";
    }
  }
}

module.exports = new OpenAIService();
