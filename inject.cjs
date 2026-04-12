const fs = require('fs');

const path = 'C:/Users/traik/.gemini/antigravity/brain/11ba3034-0051-4e76-946c-0046ae47a632/.system_generated/steps/274/output.txt';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const answer = data.data.answer;

const startIndex = answer.indexOf('# Elite Google Slides Architect');
const endIndex = answer.indexOf('Evidence Grounding:');
const promptPayload = answer.substring(startIndex, endIndex).trim();

if (startIndex === -1 || endIndex === -1) {
    console.error('Failed to parse prompt borders.');
    process.exit(1);
}

const constantsFile = 'C:/Users/traik/.gemini/antigravity/Github Repo/Smart-Prompt-Builder/constants.ts';
let constantsContent = fs.readFileSync(constantsFile, 'utf8');

// Find where TEMPLATES starts
const insertTarget = 'export const TEMPLATES: PromptTemplate[] = [';
const insertPoint = constantsContent.indexOf(insertTarget) + insertTarget.length;

if (insertPoint < insertTarget.length) {
    console.error('Cannot find TEMPLATES array in constants.ts');
    process.exit(1);
}

const cleanContent = promptPayload.replace(/`/g, '\\`');

const newTemplateStr = `
  {
    id: 'elite-slides-architect',
    name: 'Elite Google Slides Architect',
    description: 'Intelligent Text-to-Presentation Transformation System using a 4-Tier Hotkey framework.',
    category: 'creative',
    placeholderTrigger: '\\n\\n[Paste your raw text for sliding below]\\n\\n',
    content: \`${cleanContent}\`
  },`;

const newContent = constantsContent.substring(0, insertPoint) + newTemplateStr + constantsContent.substring(insertPoint);

fs.writeFileSync(constantsFile, newContent);
console.log('Successfully injected Elite Google Slides Architect as a new template!');
