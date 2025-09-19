import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hide any element containing "Edit with Lovable" or "Made with Lovable" text
function hideLovableComponents() {
  const elements = document.querySelectorAll('*');
  elements.forEach(element => {
    if (element.textContent && (
      element.textContent.includes('Edit with Lovable') || 
      element.textContent.includes('Made with Lovable') ||
      element.textContent.includes('lovable') ||
      element.textContent.includes('Lovable')
    )) {
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.pointerEvents = 'none';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
    }
  });
  
  // Also hide any elements with lovable data attributes
  const lovableElements = document.querySelectorAll('[data-lovable-tagger], [data-lovable]');
  lovableElements.forEach(element => {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.pointerEvents = 'none';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    element.style.transform = 'scale(0)';
    // Minimize size to absolute minimum
    element.style.width = '0';
    element.style.height = '0';
    element.style.minWidth = '0';
    element.style.minHeight = '0';
    element.style.maxWidth = '0';
    element.style.maxHeight = '0';
    element.style.fontSize = '0';
    element.style.lineHeight = '0';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.border = 'none';
    element.style.boxShadow = 'none';
    element.style.background = 'transparent';
    element.style.color = 'transparent';
    element.style.textShadow = 'none';
    element.style.overflow = 'hidden';
    element.style.clip = 'rect(0, 0, 0, 0)';
    element.style.clipPath = 'inset(50%)';
    element.style.whiteSpace = 'nowrap';
    element.style.zIndex = '-9999';
  });
}

// Run immediately and on DOM changes
hideLovableComponents();
document.addEventListener('DOMContentLoaded', hideLovableComponents);
const observer = new MutationObserver(hideLovableComponents);
observer.observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById("root")!).render(<App />);
