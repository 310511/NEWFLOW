import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hide any element containing "Edit with Lovable" text
function hideLovableComponents() {
  const elements = document.querySelectorAll('*');
  elements.forEach(element => {
    if (element.textContent && element.textContent.includes('Edit with Lovable')) {
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.pointerEvents = 'none';
    }
  });
}

// Run immediately and on DOM changes
hideLovableComponents();
document.addEventListener('DOMContentLoaded', hideLovableComponents);
const observer = new MutationObserver(hideLovableComponents);
observer.observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById("root")!).render(<App />);
