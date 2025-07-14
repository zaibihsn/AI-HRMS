import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: number;
  message: string;
  isFromUser: boolean;
  createdAt: string;
}

const quickActions = [
  "Leave request",
  "Payslip",
  "Benefits",
  "Expense claim",
  "Help",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  // Mock user ID - in real app this would come from auth
  const userId = "mock-user-1";

  const { data: chatHistory = [], refetch } = useQuery({
    queryKey: ["/api/chat/history", userId],
    enabled: isOpen,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        userId,
        message: messageText,
      });
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleQuickAction = (action: string) => {
    sendMessageMutation.mutate(action);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg maple-gradient hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-2xl animate-fade-in">
          <CardHeader className="maple-gradient text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 bg-white/20">
                  <AvatarFallback className="text-green-600 bg-white">
                    🤖
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">HR Assistant</h3>
                  <p className="text-xs text-green-100">AI-powered support</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 w-6 h-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6 bg-gray-100 flex-shrink-0 mt-1">
                    <AvatarFallback className="text-gray-600 text-xs">
                      🤖
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs chat-bubble-ai">
                    <p className="text-sm">
                      Hello! I'm your AI HR assistant. How can I help you today?
                    </p>
                  </div>
                </div>
              )}

              {chatHistory.map((msg: ChatMessage) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start space-x-2",
                    msg.isFromUser ? "justify-end" : ""
                  )}
                >
                  {!msg.isFromUser && (
                    <Avatar className="w-6 h-6 bg-gray-100 flex-shrink-0 mt-1">
                      <AvatarFallback className="text-gray-600 text-xs">
                        🤖
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-xs",
                      msg.isFromUser
                        ? "bg-primary text-white chat-bubble-user"
                        : "bg-gray-100 text-gray-800 chat-bubble-ai"
                    )}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}

              {sendMessageMutation.isPending && (
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6 bg-gray-100 flex-shrink-0 mt-1">
                    <AvatarFallback className="text-gray-600 text-xs">
                      🤖
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2 mb-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 text-sm"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="maple-gradient"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    disabled={sendMessageMutation.isPending}
                    className="text-xs h-6 px-2"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
