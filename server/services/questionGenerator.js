// server/services/questionGenerator.js
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const generateQuestions = async (text) => {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyD1xYzmD_wTqQ9Lm8VTDRwbzgiWsFIn7SQ");

    const schema = {
      description: "Quiz questions with multiple choice answers",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          text: {
            type: SchemaType.STRING,
            description: "The question text",
            nullable: false,
          },
          options: {
            type: SchemaType.ARRAY,
            description: "Array of 4 answer options",
            items: {
              type: SchemaType.STRING
            },
            minItems: 4,
            maxItems: 4
          },
          correctOption: {
            type: SchemaType.STRING,
            description: "Correct answer option (A, B, C, or D)",
            enum: ["A", "B", "C", "D"],
            nullable: false,
          }
        },
        required: ["text", "options", "correctOption"],
      }
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const prompt = `Generate 5 multiple choice questions based on this text: "${text}". 
    Each question should test understanding of key concepts from the text.
    Provide 4 distinct options for each question. Only one of the options should be correct.`;

    const result = await model.generateContent(prompt);
    const questions = JSON.parse(result.response.text());

    return questions.slice(0, 5); // Ensure we only return 5 questions

  } catch (error) {
    console.error('Question generation error:', error);
    throw new Error('Failed to generate questions');
  }
};

module.exports = { generateQuestions };
