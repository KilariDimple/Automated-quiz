// server/services/pdfService.js
const pdf = require('pdf-parse');
const fs = require('fs');

const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
};

module.exports = { extractTextFromPDF };

