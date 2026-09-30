import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import SlokVideoPopup from "./components/SlokVideoPopup/SlokVideoPopup";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import Chatbot from "./components/Chatbot/Chatbot";

import {
  translatePageToHindi,
  restoreEnglishPage,
} from "./utils/translateDom";

function AppContent() {
  const location = useLocation();

  // Language change listener
  useEffect(() => {
    const handleLanguageChange = async (event) => {
      const language = event.detail?.language;

      localStorage.setItem("websiteLanguage", language);

      if (language === "hi") {
        // Page render hone ke baad translate
        setTimeout(async () => {
          await translatePageToHindi();
        }, 300);
      }

      if (language === "en") {
        restoreEnglishPage();
      }
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange
      );
    };
  }, []);

  // Route/page change detect
  useEffect(() => {
    const language =
      localStorage.getItem("websiteLanguage") || "en";

    if (language === "hi") {
      // React ko new page render karne ka time do
      const timer = setTimeout(async () => {
        await translatePageToHindi();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      <AppRoutes />
      <SlokVideoPopup />
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;