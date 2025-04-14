require("dotenv").config();
const { body, validationResult } = require("express-validator");
const DetectLanguage = require("detectlanguage");
const axios = require("axios");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatGroq } = require("@langchain/groq"); // Thay ChatOpenAI bằng ChatGroq
const { StringOutputParser } = require("@langchain/core/output_parsers");

//METHOD
/**
 * chunk input tu nguoi dung va gui tung doan 1 sau do hien thi text theo dang dan dan
 * chu khong dua text ra han giong nhu dang API stream
 */

// Khởi tạo các đối tượng
const detectlanguage = new DetectLanguage(process.env.DETECTLANGUAGE_API_KEY);
// console.log("API KEY:", process.env.DETECTLANGUAGE_API_KEY);

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // Tên model Grok, có thể cần kiểm tra tài liệu xAI
});

// Tạo prompt template
const prompt = ChatPromptTemplate.fromTemplate("translate from {origin} to {target}: {text}");
const outputParser = new StringOutputParser();

// Hàm dịch văn bản với Grok
const langchain = async (text,target,origin) => {
  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    text: text,
    origin:origin,
    target:target
  });

  console.log("Translated text:", response);
  return response;
};

const detectLanguage = async (input) => {
  try {
    console.log(input);
    const result = await detectlanguage.detect(input.input);
    console.log("Raw result:", result);

    if (!result || result.length === 0) {
      throw new Error("Không phát hiện được ngôn ngữ.");
    }
    return result;
  } catch (error) {
    console.error("Error detecting language:", error);  
    throw error;
  }
};

const translateText = async (input,origin,target, start_index, end_index) => {
  try {
    const translatedText = await langchain(input,target,origin);
    console.log("Translated text:", translatedText);

    const voices = await getListVoices(start_index, end_index);
    console.log("List voices:", voices);

    return {
      translatedText,
      voices,
    };
  } catch (error) {
    console.error("Error in translate", error.message);
    throw error;
  }
};



const getListVoices = async (start_index, end_index) => {
  try {
    const speech = await axios({
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SPEECHIFY_API_KEY}`,
      },
      url: "https://api.sws.speechify.com/v1/voices",
    });

    if (!Array.isArray(speech.data)) {
      throw new Error("Dữ liệu từ API không phải là mảng.");
    }

    return speech.data.slice(start_index, end_index);
  } catch (error) {
    console.error("Error getting voices:", error.message);
    throw error;
  }
};

module.exports = {
  detectLanguage,
  translateText,
  getListVoices,
};