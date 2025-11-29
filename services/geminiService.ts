import { GoogleGenAI, Type } from "@google/genai";
import { StudyContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the structured JSON response
const studySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Um título criativo e espiritual para o sermão." },
    theme: { type: Type.STRING, description: "O tema central em poucas palavras." },
    introduction: { type: Type.STRING, description: "Uma introdução envolvente para o sermão que capte a atenção." },
    key_verses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING, description: "Ex: João 3:16" },
          text: { type: Type.STRING, description: "O texto bíblico completo na versão Almeida." }
        }
      },
      description: "3 a 5 versículos chave para o estudo bíblico."
    },
    sermon_body: { 
      type: Type.STRING, 
      description: "O TEXTO COMPLETO da pregação (não apenas esboço). Escreva o sermão inteiro, parágrafo por parágrafo, com retórica oral, pronto para ser lido ou pregado no púlpito. Use Markdown para estruturar." 
    },
    illustration_prompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 descrições visuais detalhadas e artísticas de cenas bíblicas ou metafóricas relacionadas ao tema para gerar imagens (Prompt em Inglês)."
    },
    practical_application: { type: Type.STRING, description: "Como aplicar este estudo na vida moderna (3 pontos práticos)." },
    conclusion: { type: Type.STRING, description: "Uma conclusão inspiradora e um apelo final ao coração (chamado)." },
    hymns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título do hino" },
          number: { type: Type.STRING, description: "Número no Hinário Adventista do Sétimo Dia" },
          reason: { type: Type.STRING, description: "Breve razão teológica da escolha." }
        }
      },
      description: "Sugestão de 3 hinos específicos do Hinário Adventista do Sétimo Dia (HASD)."
    }
  },
  required: ["title", "introduction", "key_verses", "sermon_body", "illustration_prompts", "hymns", "conclusion"]
};

export const generateStudyContent = async (topic: string): Promise<StudyContent> => {
  const prompt = `
    Atue como um teólogo experiente e orador da Igreja Adventista do Sétimo Dia.
    
    TAREFA:
    Crie um conteúdo completo baseado na descrição/tema: "${topic}".
    
    O conteúdo deve ser dividido em duas partes principais:
    1. ESTUDO BÍBLICO: Versículos chave e base teológica sólida.
    2. PREGAÇÃO INTEIRA: Um sermão textual completo (não apenas tópicos), escrito com eloquência, emoção e profundidade, pronto para ser pregado.
    
    DIRETRIZES:
    - Use a versão da Bíblia João Ferreira de Almeida.
    - O tom deve ser solene, esperançoso e Cristo-cêntrico.
    - PREGAÇÃO: Desenvolva a introdução, o desenvolvimento (pontos 1, 2, 3) e a conclusão de forma fluida e textual.
    - HINOS: Selecione hinos clássicos do Hinário Adventista que existam no YouTube.
    - IMAGENS: Crie prompts artísticos para ilustrar o sermão.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: studySchema,
        systemInstruction: "Você é um mentor espiritual adventista, focado na Bíblia, na graça e na esperança do advento.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text response received");
    
    return JSON.parse(text) as StudyContent;
  } catch (error) {
    console.error("Error generating study:", error);
    throw error;
  }
};

export const generateIllustration = async (prompt: string): Promise<string | null> => {
  try {
    const refinedPrompt = `Biblical art style, oil painting, dramatic lighting, detailed, spiritual, masterpiece, 8k resolution: ${prompt}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: refinedPrompt,
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};