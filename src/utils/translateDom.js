import { translateTexts } from "../services/translationService";

// Original English texts store karne ke liye
const originalTexts = new Map();

// Translation currently running hai ya nahi
let isTranslating = false;

// Elements jinko translate nahi karna
const ignoredTags = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "SVG",
  "PATH",
  "CODE",
  "PRE",
  "TEXTAREA",
  "OPTION",
]);

const shouldIgnoreNode = (node) => {
  const parent = node.parentElement;

  if (!parent) return true;

  // Ignore specific HTML tags
  if (ignoredTags.has(parent.tagName)) {
    return true;
  }

  // Jis element par data-no-translate="true" ho
  // uske andar kuch translate nahi hoga
  if (parent.closest("[data-no-translate='true']")) {
    return true;
  }

  return false;
};

// Website ke saare valid text nodes collect karega
const getTextNodes = () => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const nodes = [];

  let node;

  while ((node = walker.nextNode())) {
    const text = node.nodeValue.trim();

    // Empty text skip
    if (!text) continue;

    // Ignored elements skip
    if (shouldIgnoreNode(node)) continue;

    nodes.push(node);
  }

  return nodes;
};

// English → Hindi
export const translatePageToHindi = async () => {
  if (isTranslating) return;

  isTranslating = true;

  try {
    const textNodes = getTextNodes();

    const nodesToTranslate = [];
    const texts = [];

    textNodes.forEach((node) => {
      const text = node.nodeValue.trim();

      // Original English text save karo
      // taaki English select karne par wapas restore ho sake
      if (!originalTexts.has(node)) {
        originalTexts.set(node, node.nodeValue);
      }

      nodesToTranslate.push(node);
      texts.push(text);
    });

    if (texts.length === 0) {
      return;
    }

    // Ek baar me maximum 30 texts bhejenge
    const batchSize = 30;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batchTexts = texts.slice(i, i + batchSize);

      const translations = await translateTexts(batchTexts);

      // Agar API response nahi mila to next batch
      if (!translations) continue;

      const batchNodes = nodesToTranslate.slice(
        i,
        i + batchSize
      );

      translations.forEach((translatedText, index) => {
        if (batchNodes[index]) {
          batchNodes[index].nodeValue = translatedText;
        }
      });
    }
  } catch (error) {
    console.error(
      "Page translation error:",
      error
    );
  } finally {
    isTranslating = false;
  }
};

// Hindi → Original English restore
export const restoreEnglishPage = () => {
  originalTexts.forEach((originalText, node) => {
    if (node && document.body.contains(node)) {
      node.nodeValue = originalText;
    }
  });
};