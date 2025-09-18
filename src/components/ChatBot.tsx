import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Mic, X } from "lucide-react";
import AnimatedAvatar from "@/components/AnimatedAvatar";

// TypeScript declaration for n8n chatbot global object
declare global {
  interface Window {
    n8nChatbot?: {
      open: () => void;
      close: () => void;
    };
    ElevenLabsConvAI?: {
      open: () => void;
      close: () => void;
    };
  }
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'text' | 'voice'>('text');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const elevenLabsScriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Load the n8n chatbot script when component mounts
    const loadN8nChatbot = () => {
      if (scriptRef.current) return; // Already loaded

      const script = document.createElement('script');
      script.type = 'module';
      script.defer = true;
      script.innerHTML = `
        import Chatbot from "https://cdn.n8nchatui.com/v1/embed.js";
        Chatbot.init({
          "n8nChatUrl": "https://n8n.srv982383.hstgr.cloud/webhook/9b8ef8e3-0311-4910-9a9b-d05309a29777/chat",
          "metadata": {},
          "theme": {
            "button": {
              "backgroundColor": "#23665a",
              "right": 20,
              "bottom": 20,
              "size": 80,
              "iconColor": "#f5f4ef",
              "customIconSrc": "https://i.ibb.co/7bzcppC/pngwing-com-removebg-preview.png",
              "customIconSize": 95,
              "customIconBorderRadius": 0,
              "autoWindowOpen": {
                "autoOpen": false,
                "openDelay": 2
              },
              "borderRadius": "circle"
            },
            "tooltip": {
              "showTooltip": true,
              "tooltipMessage": "Hi There 👋",
              "tooltipBackgroundColor": "#a9ccc7",
              "tooltipTextColor": "#1c1c1c",
              "tooltipFontSize": 15
            },
            "chatWindow": {
              "borderRadiusStyle": "rounded",
              "avatarBorderRadius": 30,
              "messageBorderRadius": 8,
              "showTitle": true,
              "title": "HotelRBS AI Assistance",
              "titleAvatarSrc": "https://www.svgrepo.com/show/339963/chat-bot.svg",
              "avatarSize": 30,
              "welcomeMessage": "Welcome to HotelRBS! 😊",
              "errorMessage": "Please connect to the HotelRBS Team",
              "backgroundColor": "#ffffff",
              "height": 520,
              "width": 400,
              "fontSize": 16,
              "starterPrompts": [
                "What kind of hotels can use HotelRBS?",
                "What are the key features of the online booking ?"
              ],
              "starterPromptFontSize": 15,
              "renderHTML": false,
              "clearChatOnReload": false,
              "showScrollbar": false,
              "botMessage": {
                "backgroundColor": "#178070",
                "textColor": "#fafafa",
                "showAvatar": true,
                "avatarSrc": "https://www.svgrepo.com/show/334455/bot.svg",
                "showCopyToClipboardIcon": false
              },
              "userMessage": {
                "backgroundColor": "#efeeeb",
                "textColor": "#050505",
                "showAvatar": true,
                "avatarSrc": "https://i.ibb.co/7bzcppC/pngwing-com-removebg-preview.png"
              },
              "textInput": {
                "placeholder": "Type your query",
                "backgroundColor": "#ffffff",
                "textColor": "#1e1e1f",
                "sendButtonColor": "#23665a",
                "maxChars": 200,
                "maxCharsWarningMessage": "You exceeded the characters limit. Please input less than 200 characters.",
                "autoFocus": false,
                "borderRadius": 2,
                "sendButtonBorderRadius": 50
              }
            }
          }
        });
      `;
      
      document.head.appendChild(script);
      scriptRef.current = script;
    };

    // Load ElevenLabs voice assistant script
    const loadElevenLabsChatbot = () => {
      if (elevenLabsScriptRef.current) return; // Already loaded

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      document.head.appendChild(script);
      elevenLabsScriptRef.current = script;
    };

    loadN8nChatbot();
    loadElevenLabsChatbot();

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      if (elevenLabsScriptRef.current) {
        document.head.removeChild(elevenLabsScriptRef.current);
        elevenLabsScriptRef.current = null;
      }
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      setShowModeSelector(true);
    } else {
      setIsOpen(false);
      setShowModeSelector(false);
      // Close any open chatbots
      if (window.n8nChatbot) {
        window.n8nChatbot.close();
      }
      if (window.ElevenLabsConvAI) {
        window.ElevenLabsConvAI.close();
      }
    }
  };

  const handleModeSelect = (mode: 'text' | 'voice') => {
    setChatMode(mode);
    setShowModeSelector(false);
    setIsOpen(true);

    if (mode === 'text' && window.n8nChatbot) {
      window.n8nChatbot.open();
    } else if (mode === 'voice' && window.ElevenLabsConvAI) {
      window.ElevenLabsConvAI.open();
    }
  };

  return (
    <>
      {/* Mode Selector */}
      {showModeSelector && (
        <div className="fixed bottom-28 right-6 z-[10000]">
          <Card className="w-[300px] shadow-2xl border-0 animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-primary to-emerald-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Choose Assistant</h3>
                    <p className="text-xs text-white/80">Select your preferred mode</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModeSelector(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <Button
                onClick={() => handleModeSelect('text')}
                className="w-full justify-start h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Text Chat</div>
                  <div className="text-xs text-white/80">Type your questions</div>
                </div>
              </Button>

              <Button
                onClick={() => handleModeSelect('voice')}
                className="w-full justify-start h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <Mic className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Voice Assistant</div>
                  <div className="text-xs text-white/80">Speak naturally</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ElevenLabs Voice Assistant Element */}
      <elevenlabs-convai agent-id="agent_5801k5cfn9gxe2rsnwebn91b94e0"></elevenlabs-convai>

      {/* Animated Avatar - triggers mode selector */}
      <AnimatedAvatar onClick={handleToggle} isOpen={isOpen} />
    </>
  );
};

export default ChatBot;
