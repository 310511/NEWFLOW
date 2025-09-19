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
    element.style.transform = 'translateX(100px)';
  });
}

// Run immediately and on DOM changes
hideLovableComponents();
document.addEventListener('DOMContentLoaded', hideLovableComponents);
const observer = new MutationObserver(hideLovableComponents);
observer.observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById("root")!).render(<App />);
