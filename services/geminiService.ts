import { GoogleGenAI, Type } from "@google/genai";
import { Market } from "../types";

const apiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MOCK_HISTORY_LENGTH = 20;

const generateMockHistory = (startProb: number): number[] => {
  const history = [startProb];
  let current = startProb;
  for (let i = 0; i < MOCK_HISTORY_LENGTH; i++) {
    const change = (Math.random() - 0.5) * 10;
    current = Math.max(1, Math.min(99, current + change));
    history.push(Number(current.toFixed(1)));
  }
  return history;
};

export const generateMarketFromTopic = async (
  topic: string,
  isSocial: boolean = false
): Promise<Market | null> => {
  if (!ai) {
    console.warn("Gemini API key missing; skipping AI market generation.");
    return null;
  }
  try {
    const prompt = isSocial
      ? `Create a fun, social prediction market for friends based on: "${topic}". 
         Return a JSON object with a title, a short description, a category (e.g., Personal, Dating, Work, Fun), 
         a realistic initial probability (1-99), and an end date.`
      : `Create a professional prediction market based on the topic: "${topic}". 
         Return a JSON object with a title, a short description, a category, a realistic initial probability (1-99), and an end date.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            probability: { type: Type.INTEGER },
            endDate: { type: Type.STRING },
          },
          required: [
            "title",
            "description",
            "category",
            "probability",
            "endDate",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");

    if (!data.title) return null;

    return {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      imageUrl: isSocial
        ? `https://picsum.photos/400/300?random=${Math.floor(
            Math.random() * 1000
          )}`
        : `https://picsum.photos/400/300?grayscale&random=${Math.floor(
            Math.random() * 1000
          )}`,
      probability: data.probability,
      volume: isSocial
        ? Math.floor(Math.random() * 500)
        : Math.floor(Math.random() * 100000),
      category: data.category,
      endDate: data.endDate,
      history: generateMockHistory(data.probability),
      isAiGenerated: true,
      type: isSocial ? "social" : "global",
      aiInsight: "Market created. Data gathering in progress.",
    };
  } catch (error) {
    console.error("Failed to generate market:", error);
    return null;
  }
};

export const analyzeMarket = async (
  market: Market
): Promise<{ insight: string; bullCase: string[]; bearCase: string[] }> => {
  if (!ai) {
    console.warn("Gemini API key missing; returning fallback market analysis.");
    return {
      insight: "Analysis unavailable.",
      bullCase: [],
      bearCase: [],
    };
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this prediction market: "${market.title}". 
      Current probability of YES: ${market.probability}%.
      Description: ${market.description}.
      
      Return a JSON object with:
      1. "insight": A 1-sentence snappy summary of the current sentiment.
      2. "bullCase": An array of 2 short, punchy strings explaining why YES might happen.
      3. "bearCase": An array of 2 short, punchy strings explaining why NO might happen.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insight: { type: Type.STRING },
            bullCase: { type: Type.ARRAY, items: { type: Type.STRING } },
            bearCase: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      insight: result.insight || "Analysis currently unavailable.",
      bullCase: result.bullCase || ["Positive momentum detected"],
      bearCase: result.bearCase || ["Resistance levels approaching"],
    };
  } catch (error) {
    console.error("Failed to analyze market:", error);
    return {
      insight: "Analysis unavailable.",
      bullCase: [],
      bearCase: [],
    };
  }
};

export const chatAboutMarket = async (
  market: Market,
  userMessage: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API key missing; returning fallback chat response.");
    return "AI chat unavailable. Please add your Gemini API key.";
  }
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are Chromarock AI, an expert financial analyst for prediction markets. 
                You are discussing: "${market.title}". 
                Current Odds: ${market.probability}% YES.
                Be concise, professional, but approachable. Use data-driven language.`,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  } catch (e) {
    console.error("Chat error", e);
    return "Connection interrupted. Please retry.";
  }
};

export const suggestTrendingMarkets = async (): Promise<Market[]> => {
  if (!ai) {
    console.warn("Gemini API key missing; returning empty trending markets.");
    return [];
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 trending prediction markets based on current world events (Politics, Tech, Finance).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              probability: { type: Type.INTEGER },
              endDate: { type: Type.STRING },
              aiInsight: { type: Type.STRING },
            },
            required: [
              "title",
              "description",
              "category",
              "probability",
              "endDate",
            ],
          },
        },
      },
    });

    const list = JSON.parse(response.text || "[]");
    return list.map((item: any) => ({
      id: crypto.randomUUID(),
      title: item.title,
      description: item.description,
      imageUrl: `https://picsum.photos/400/300?grayscale&random=${Math.floor(
        Math.random() * 1000
      )}`,
      probability: item.probability,
      volume: Math.floor(Math.random() * 1000000),
      category: item.category,
      endDate: item.endDate,
      history: generateMockHistory(item.probability),
      isAiGenerated: true,
      type: "global",
      aiInsight: item.aiInsight || "High volatility expected.",
    }));
  } catch (e) {
    return [];
  }
};
