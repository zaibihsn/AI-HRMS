import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default_openai_key"
});

export class AIService {
  async generateResponse(message: string, userId: string): Promise<string> {
    try {
      // Get user context
      const employee = await storage.getEmployeeByUserId(userId);
      const recentClaims = employee ? await storage.getClaimsByEmployee(employee.id) : [];
      const recentTickets = employee ? await storage.getTicketsByEmployee(employee.id) : [];
      const recentLeaves = employee ? await storage.getLeaveRequestsByEmployee(employee.id) : [];

      const context = {
        employee: employee ? {
          name: `${employee.user.firstName} ${employee.user.lastName}`,
          department: employee.department,
          position: employee.position,
          employeeId: employee.employeeId,
        } : null,
        recentClaims: recentClaims.slice(0, 3),
        recentTickets: recentTickets.slice(0, 3),
        recentLeaves: recentLeaves.slice(0, 3),
      };

      const systemPrompt = `You are MapleHR AI Assistant, an intelligent HR chatbot that helps employees with HR-related queries. You have access to the employee's information and can help with:

1. Leave requests and vacation balance
2. Claims and expense submissions
3. HR policies and procedures
4. Ticket status and support
5. Performance reviews
6. Benefits information
7. General HR questions

Current employee context: ${JSON.stringify(context)}

Provide helpful, accurate, and professional responses. If you need to perform actions like submitting requests, inform the user about the process and guide them to the appropriate forms or sections.

Keep responses concise but informative. Always maintain a professional and friendly tone.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now. Please try again or contact HR support.";
    } catch (error) {
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

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"shouldApprove": false, "confidence": 0, "reason": "Unable to analyze"}');
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

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"shouldApprove": false, "confidence": 0, "reason": "Unable to analyze"}');
      return result;
    } catch (error) {
      console.error("Error analyzing leave request:", error);
      return { shouldApprove: false, confidence: 0, reason: "Analysis failed" };
    }
  }
}

export const aiService = new AIService();
