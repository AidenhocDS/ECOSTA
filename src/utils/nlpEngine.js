import { seatViewsData } from '../data/seatViewsData';

// ENGLISH KEYWORD DICTIONARY (Expanded with Greetings)
const KEYWORDS = {
  budget: {
    low: ['cheap', 'budget', 'student', 'affordable', 'low cost', 'economical', 'save', 'tight', 'free'],
    high: ['vip', 'premium', 'expensive', 'best', 'luxury', 'splurge', 'top tier', 'first class']
  },
  view: {
    panoramic: ['panoramic', 'high', 'overall', 'whole', 'full view', 'overview', 'bird'],
    close: ['close', 'near', 'action', 'courtside', 'front', 'clear', 'sweat'],
    corner: ['corner', 'angle', 'diagonal', 'tactical']
  },
  greetings: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy'],
  gratitude: ['thank', 'appreciate', 'awesome', 'great', 'perfect']
};

export const processChatInput = (inputText) => {
  const text = inputText.toLowerCase();

  // ==========================================
  // LOGIC 1: GREETINGS & SMALL TALK
  // ==========================================
  if (KEYWORDS.greetings.some(kw => text.includes(kw))) {
    return { 
      reply: "Hello there! Ready to find the perfect seats for your next match? Tell me your budget or preferred view!", 
      sectionId: null, image: null 
    };
  }
  if (KEYWORDS.gratitude.some(kw => text.includes(kw))) {
    return { 
      reply: "You're very welcome! Let me know if you want to explore any other sections of the stadium.", 
      sectionId: null, image: null 
    };
  }

  // ==========================================
  // LOGIC 2: DIRECT SECTION MATCHING (Regex)
  // ==========================================
  // Looks for phrases like "section 8", "sec 14", "section48"
  const sectionMatch = text.match(/(?:section|sec)\s*(\d+)/);
  if (sectionMatch) {
    const secNum = sectionMatch[1];
    const directSecId = `sec-${secNum}`;
    
    // Check if the requested section actually exists in our data
    if (seatViewsData[directSecId]) {
      return {
        sectionId: directSecId,
        reply: `Ah, you know exactly what you want! Here is the view right from Section ${secNum}.`,
        image: seatViewsData[directSecId].views[0]?.img || null,
        sectionName: seatViewsData[directSecId].name
      };
    } else {
      return { 
        reply: `I'm sorry, but Section ${secNum} doesn't seem to exist in our stadium layout. Please try a number between 1 and 55.`, 
        sectionId: null, image: null 
      };
    }
  }

  // ==========================================
  // LOGIC 3: ENTITY EXTRACTION (Ticket Quantity)
  // ==========================================
  // Looks for numbers before the words tickets, seats, or people (e.g., "3 tickets", "two seats")
  const quantityMatch = text.match(/(\d+|one|two|three|four|five)\s*(tickets|seats|people)/);
  let personalizedPrefix = "";
  if (quantityMatch) {
    personalizedPrefix = `I can definitely help find ${quantityMatch[1]} great seats for you. `;
  }

  // ==========================================
  // LOGIC 4: STANDARD INTENT CLASSIFICATION
  // ==========================================
  let detectedBudget = 'mid'; 
  let detectedView = 'standard';

  if (KEYWORDS.budget.low.some(kw => text.includes(kw))) detectedBudget = 'low';
  else if (KEYWORDS.budget.high.some(kw => text.includes(kw))) detectedBudget = 'high';

  if (KEYWORDS.view.panoramic.some(kw => text.includes(kw))) detectedView = 'panoramic';
  else if (KEYWORDS.view.close.some(kw => text.includes(kw))) detectedView = 'close';
  else if (KEYWORDS.view.corner.some(kw => text.includes(kw))) detectedView = 'corner';

  let recommendedSectionId = '';
  let replyText = '';

  if (detectedBudget === 'high' || detectedView === 'close') {
    recommendedSectionId = 'sec-8';
    replyText = personalizedPrefix + "Based on your preferences, I highly recommend VIP Section 8. This area offers the ultimate courtside experience!";
  } 
  else if (detectedBudget === 'low' || detectedView === 'panoramic') {
    recommendedSectionId = 'sec-48';
    replyText = personalizedPrefix + "Section 48 in the upper tier provides a fantastic panoramic view without breaking the bank.";
  } 
  else if (detectedView === 'corner') {
    recommendedSectionId = 'sec-14';
    replyText = personalizedPrefix + "The corner is brilliant for observing tactics! Section 14 will give you that perfect diagonal vantage point.";
  } 
  else {
    recommendedSectionId = 'sec-20'; 
    replyText = personalizedPrefix + "For that request, Section 20 strikes a great balance between ideal viewing angles and reasonable pricing.";
  }

  const sectionData = seatViewsData[recommendedSectionId];

  return {
    sectionId: recommendedSectionId,
    reply: replyText,
    image: sectionData?.views?.[0]?.img || null,
    sectionName: sectionData?.name || "Recommended Section"
  };
};