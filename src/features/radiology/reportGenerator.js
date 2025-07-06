const { createOpenAiGenerativeClient, getOpenAiGenerativeModel } = require('../../common/services/openAiClient');
const { clipboard } = require('electron');
let robot;
try {
  robot = require('robotjs');
} catch (e) {
  console.warn('robotjs not installed');
}

const RADIOLOGY_SYSTEM_PROMPT = process.env.radiology_system_prompt ||
  'Você é um radiologista especializado em gerar laudos claros e completos. Utilize o seguinte histórico para compor o laudo:';

async function generateRadiologyReport(transcript, apiKey) {
  const client = createOpenAiGenerativeClient(apiKey);
  const model = getOpenAiGenerativeModel(client, 'gpt-4o');
  const result = await model.generateContent([RADIOLOGY_SYSTEM_PROMPT, transcript]);
  const report = await result.response.text();
  return report;
}

function pasteText(text) {
  clipboard.writeText(text);
  if (robot) {
    const isMac = process.platform === 'darwin';
    robot.keyTap('v', isMac ? 'command' : 'control');
  }
}

module.exports = { generateRadiologyReport, pasteText };
