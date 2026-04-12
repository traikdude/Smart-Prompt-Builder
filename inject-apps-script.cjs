const fs = require('fs');

const path = 'C:/Users/traik/.gemini/antigravity/brain/11ba3034-0051-4e76-946c-0046ae47a632/.system_generated/steps/346/output.txt';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const answer = data.data.answer;

const startIndex = answer.indexOf('🏗️ Elite Google Apps Script Architect: Unified Development & Automation System');
const endIndex = answer.indexOf('Evidence Grounding:');
const promptPayload = answer.substring(startIndex, endIndex).trim();

if (startIndex === -1 || endIndex === -1) {
    console.error('Failed to parse prompt borders.');
    process.exit(1);
}

const constantsFile = 'C:/Users/traik/.gemini/antigravity/Github Repo/Smart-Prompt-Builder/constants.ts';
let constantsContent = fs.readFileSync(constantsFile, 'utf8');

const insertTarget = 'export const TEMPLATES: PromptTemplate[] = [';
const insertPoint = constantsContent.indexOf(insertTarget) + insertTarget.length;

if (insertPoint < insertTarget.length) {
    console.error('Cannot find TEMPLATES array in constants.ts');
    process.exit(1);
}

const cleanContent = promptPayload.replace(/`/g, '\\`').replace(/\$/g, '$$$$');

const newTemplateStr = `
  {
    id: 'google-apps-script-architect',
    name: 'Elite Google Apps Script Architect',
    description: 'Advanced developer, automation engineer, and instructional guide specializing in Google Apps Script.',
    category: 'development',
    placeholderTrigger: '\\n\\n[Describe the automation or script you want to build]\\n\\n',
    content: \`${cleanContent}\`
  },`;

const newContent = constantsContent.substring(0, insertPoint) + newTemplateStr + constantsContent.substring(insertPoint);

fs.writeFileSync(constantsFile, newContent);
console.log('Successfully injected Elite Google Apps Script Architect as a new template!');
