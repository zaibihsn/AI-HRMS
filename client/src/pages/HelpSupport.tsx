import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Users, Bot, BookOpen } from "lucide-react";

export default function HelpSupport() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Help & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">Get help, ask questions, and find resources for your AI HRMS system.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Contact Support Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="supportMessage">Send us a message</Label>
          <Input id="supportMessage" placeholder="Describe your issue or question..." className="mb-2" />
          <Button variant="primary">Send Message</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" /> Ask AI Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="aiQuestion">Ask a question to our AI agent</Label>
          <Input id="aiQuestion" placeholder="Type your question..." className="mb-2" />
          <Button variant="secondary">Ask AI</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> FAQs & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>How do I reset my password?</li>
            <li>How do I update my profile information?</li>
            <li>How do I submit a leave request?</li>
            <li>Where can I find payroll details?</li>
            <li>Contact support for other issues.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Community Forum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Join our community forum to discuss, share tips, and get peer support.</p>
          <Button variant="outline">Go to Forum</Button>
        </CardContent>
      </Card>
    </div>
  );
}
