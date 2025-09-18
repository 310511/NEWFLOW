import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";
import AnimatedAvatar from "@/components/AnimatedAvatar";

// TypeScript declaration for n8n chatbot global object
declare global {
  interface Window {
    n8nChatbot?: {
      open: () => void;
      close: () => void;
    };
  }
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

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

    loadN8nChatbot();

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Trigger the n8n chatbot to open/close
    if (window.n8nChatbot) {
      if (isOpen) {
        window.n8nChatbot.close();
      } else {
        window.n8nChatbot.open();
      }
    }
  };

  return (
    <>
      {/* Animated Avatar - triggers n8n chatbot */}
      <AnimatedAvatar onClick={handleToggle} isOpen={isOpen} />
    </>
  );
};

export default ChatBot;
