import axios from "axios";
import { storage } from "./storage";


const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "default_groq_key";

export class AIService {
  async generateResponse(message: string, userId: string, groqApiKey?: string): Promise<string> {
    try {
      // Minimal system prompt for Groq API test
      const systemPrompt = `You are MapleHR AI Assistant, an intelligent HR chatbot that helps employees with HR-related queries. Answer as helpfully and concisely as possible.`;

      const apiKey = groqApiKey || GROQ_API_KEY;
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "llama3-8b-8192", // use Llama 3 model for HR chat
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now. Please try again or contact HR support.";
    } catch (error: any) {
      // Show Groq error message if available
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        return `Groq API error: ${error.response.data.error.message}`;
      }
      console.error("Error generating AI response:", error);
      return "I apologize, but I'm currently experiencing technical difficulties. Please try again later or contact HR support directly.";
    }
  }

  async analyzeClaimForApproval(claim: any): Promise<{ shouldApprove: boolean; confidence: number; reason: string }> {
    try {
      const prompt = `Analyze this expense claim for automatic approval based on company policies:

Claim Details:
- Category: ${claim.category}
- Amount: $${claim.amount}
- Description: ${claim.description}
- Employee: ${claim.employee?.user?.firstName} ${claim.employee?.user?.lastName}
- Department: ${claim.employee?.department}

Standard approval rules:
- Meals: up to $50 per day
- Travel: up to $500 per trip with receipts
- Office supplies: up to $200 per month
- Training: up to $1000 per year with pre-approval

Respond with JSON only: { "shouldApprove": boolean, "confidence": number (0-1), "reason": "explanation" }`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.1,
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      const result = JSON.parse(response.data.choices[0].message.content || '{"shouldApprove": false, "confidence": 0, "reason": "Unable to analyze"}');
      return result;
    } catch (error) {
      console.error("Error analyzing claim:", error);
      return { shouldApprove: false, confidence: 0, reason: "Analysis failed" };
    }
  }

  async analyzeLeaveRequest(leaveRequest: any): Promise<{ shouldApprove: boolean; confidence: number; reason: string }> {
    try {
      const prompt = `Analyze this leave request for automatic approval:

Leave Details:
- Type: ${leaveRequest.type}
- Start Date: ${leaveRequest.startDate}
- End Date: ${leaveRequest.endDate}
- Days: ${leaveRequest.days}
- Reason: ${leaveRequest.reason}
- Employee: ${leaveRequest.employee?.user?.firstName} ${leaveRequest.employee?.user?.lastName}
- Department: ${leaveRequest.employee?.department}

Standard approval rules:
- Vacation: Check if within annual allowance and sufficient notice
- Sick leave: Auto-approve up to 5 consecutive days
- Personal leave: Requires manager approval for more than 2 days
- Emergency leave: Usually approved regardless

Respond with JSON only: { "shouldApprove": boolean, "confidence": number (0-1), "reason": "explanation" }`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.1,
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      const result = JSON.parse(response.data.choices[0].message.content || '{"shouldApprove": false, "confidence": 0, "reason": "Unable to analyze"}');
      return result;
    } catch (error) {
      console.error("Error analyzing leave request:", error);
      return { shouldApprove: false, confidence: 0, reason: "Analysis failed" };
    }
  }
}

export const aiService = new AIService();
