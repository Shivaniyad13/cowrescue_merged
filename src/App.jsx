import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import SlokVideoPopup from "./components/SlokVideoPopup/SlokVideoPopup";
import ReportCowWidget from "./components/ReportCowWidget/ReportCowWidget";
import TrackCowWidget from "./components/TrackCowWidget/TrackCowWidget";

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
        setTimeout(async () => {
          await translatePageToHindi();
        }, 300);
      }

      if (language === "en") {
        restoreEnglishPage();
      }
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  // Route/page change detect
  useEffect(() => {
    const language = localStorage.getItem("websiteLanguage") || "en";

    if (language === "hi") {
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
      <ReportCowWidget />
      <TrackCowWidget />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;