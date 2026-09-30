import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Chatbot.module.css";
import chatbotData from "./chatbotData";


// =========================================================
// LANGUAGE DETECTION
// =========================================================

const detectLanguage = (text) => {
  const lowerText = text.toLowerCase();

  const hinglishWords = [
    "kya",
    "kaise",
    "hai",
    "hain",
    "mujhe",
    "mera",
    "meri",
    "hamara",
    "hamare",
    "ke",
    "ki",
    "ka",
    "se",
    "mein",
    "me",
    "batao",
    "bataiye",
    "chahiye",
    "karna",
    "sakta",
    "sakti",
    "kahan",
    "kyun",
    "kyon",
    "kaise",
  ];

  const words = lowerText.split(/\s+/);

  const hasHinglish = hinglishWords.some((word) =>
    words.includes(word)
  );

  return hasHinglish ? "hinglish" : "english";
};


// =========================================================
// FIND RELEVANT WEBSITE INFORMATION
// =========================================================

const findAnswer = (message) => {
  const lowerMessage = message.toLowerCase();

  for (const key in chatbotData) {
    const data = chatbotData[key];

    const matched = data.keywords.some((keyword) =>
      lowerMessage.includes(keyword.toLowerCase())
    );

    if (matched) {
      return data;
    }
  }

  return null;
};


// =========================================================
// CHATBOT
// =========================================================

export default function Chatbot() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text:
        "Namaste 🙏 Welcome to Panchgavya Se Panchparivartan. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");


  // =======================================================
  // SEND MESSAGE
  // =======================================================

  const sendMessage = () => {
    const message = input.trim();

    if (!message) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const language = detectLanguage(message);

    const result = findAnswer(message);

    let botText = "";
    let link = null;
    let linkText = null;


    // =====================================================
    // MATCHING ANSWER
    // =====================================================

    if (result) {
      botText =
        language === "hinglish"
          ? result.hinglish
          : result.english;

      link = result.link;
      linkText = result.linkText;
    }


    // =====================================================
    // UNKNOWN QUESTION
    // =====================================================

    else {
      botText =
        language === "hinglish"
          ? "Sorry 🙏 mujhe is question ka exact answer website information mein nahi mila. Aap GauVansh, Projects, Government Initiatives, NGO, CBO, Products, Donation ya Contact ke baare mein mujhse pooch sakte hain."
          : "Sorry 🙏 I could not find an exact answer to that question in our website information. You can ask me about GauVansh, Projects, Government Initiatives, NGO, CBO, Products, Donation or Contact.";
    }


    const botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: botText,
      link,
      linkText,
    };


    // Small typing delay

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 400);

    setInput("");
  };


  // =======================================================
  // ENTER KEY
  // =======================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };


  // =======================================================
  // QUICK QUESTION
  // =======================================================

  const askQuickQuestion = (question) => {
    const language = detectLanguage(question);
    const result = findAnswer(question);

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);


    if (result) {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          language === "hinglish"
            ? result.hinglish
            : result.english,
        link: result.link,
        linkText: result.linkText,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
      }, 300);
    } else {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          language === "hinglish"
            ? "Sorry 🙏 mujhe is question ka exact answer nahi mila."
            : "Sorry 🙏 I could not find an exact answer to that question.",
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
      }, 300);
    }

    setInput("");
  };


  // =======================================================
  // OPEN / CLOSE CHATBOT
  // =======================================================

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };


  return (
    <>
      {/* ===================================================
          FLOATING CHATBOT BUTTON
      =================================================== */}

      <button
        className={`${styles.chatButton} ${
          isOpen ? styles.chatButtonOpen : ""
        }`}
        onClick={toggleChatbot}
        aria-label={
          isOpen
            ? "Close chatbot"
            : "Open chatbot"
        }
      >
        {isOpen ? (
          <>
            <span className={styles.closeIcon}>×</span>
            <span></span>
          </>
        ) : (
         <>
  <img
    src="https://connect.lime-technologies.com/wp-content/uploads/2025/03/chatbot-for-website-blue-ai-chatbot.png"
    alt="Chatbot"
    className={styles.chatIcon}
  />
  <span></span>
</>
        )}
      </button>


      {/* ===================================================
          CHAT WINDOW
      =================================================== */}

      {isOpen && (
        <div className={styles.chatWindow}>

          {/* HEADER */}

          <div className={styles.chatHeader}>

            <div className={styles.botAvatar}>
              🐄
            </div>

            <div className={styles.headerText}>
              <h3>
                Panchgavya Assistant
              </h3>

              <span>
                Online • Ready to help
              </span>
            </div>

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className={styles.messagesContainer}>

            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender === "user"
                    ? styles.userMessageWrapper
                    : styles.botMessageWrapper
                }
              >

                <div
                  className={
                    message.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage
                  }
                >
                  {message.text}
                </div>


                {/* PAGE LINK */}

                {message.link && (
                  <button
                    className={styles.pageButton}
                    onClick={() => {
                      navigate(message.link);
                      setIsOpen(false);
                    }}
                  >
                    {message.linkText} →
                  </button>
                )}

              </div>
            ))}

          </div>


          {/* =================================================
              QUICK QUESTIONS
          ================================================= */}

          <div className={styles.quickQuestions}>

            <button
              onClick={() =>
                askQuickQuestion(
                  "What is GauVansh protection?"
                )
              }
            >
              🐄 GauVansh
            </button>

            <button
              onClick={() =>
                askQuickQuestion(
                  "What are your projects?"
                )
              }
            >
              🌱 Projects
            </button>

            <button
              onClick={() =>
                askQuickQuestion(
                  "What cow-based products are available?"
                )
              }
            >
              🛍 Products
            </button>

            <button
              onClick={() =>
                askQuickQuestion(
                  "How can I donate?"
                )
              }
            >
              💚 Donation
            </button>

          </div>


          {/* =================================================
              INPUT
          ================================================= */}

          <div className={styles.inputArea}>

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              aria-label="Ask chatbot"
            />

            <button
              onClick={sendMessage}
              aria-label="Send message"
              type="button"
            >
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
}