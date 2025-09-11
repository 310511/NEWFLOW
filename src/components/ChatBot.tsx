import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import AnimatedAvatar from "@/components/AnimatedAvatar";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hi! I'm here to help you find the perfect hotel. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
      {
        role: "bot",
        content:
          "Thanks for your message! Our AI assistant is coming soon. For now, please use our search to find hotels or contact our support team.",
      },
    ];

    setMessages(newMessages);
    setInput("");
  };

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-[10000]">
          <Card className="w-[400px] h-[70vh] max-h-[90vh] shadow-2xl border-0 animate-scale-in flex flex-col">
            <CardHeader className="bg-gradient-to-r from-primary to-emerald-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hotel Assistant</h3>
                    <p className="text-xs text-white/80">Online now</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        message.role === "user"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="mt-auto p-4 border-t bg-gray-50">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 rounded-full border-2 focus:border-primary"
                  />
                  <Button
                    onClick={handleSend}
                    size="sm"
                    className="rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Animated Avatar */}
      <AnimatedAvatar onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    </>
  );
};

export default ChatBot;
