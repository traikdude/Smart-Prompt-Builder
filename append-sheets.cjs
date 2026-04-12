const fs = require('fs');

const path = 'C:/Users/traik/.gemini/antigravity/brain/11ba3034-0051-4e76-946c-0046ae47a632/.system_generated/steps/334/output.txt';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const answer = data.data.answer;

const startIndex = answer.indexOf('# 📚 Comprehensive Function Library');
const endIndex = answer.indexOf('Evidence Grounding:');
const expandedPayload = answer.substring(startIndex, endIndex).trim();

if (startIndex === -1 || endIndex === -1) {
    console.error('Failed to parse references borders.');
    process.exit(1);
}

const constantsFile = 'C:/Users/traik/.gemini/antigravity/Github Repo/Smart-Prompt-Builder/constants.ts';
let constantsContent = fs.readFileSync(constantsFile, 'utf8');

// We need to inject this expanded payload INSIDE the `google-sheets-architect` prompt.
// we will just replace `| 9-10 | Enterprise | Multi-workbook ecosystem, custom functions, API integrations |\n\nThis score helps set expectations and guides the depth of analysis needed.`
// With itself + the new payload.

const searchString = "This score helps set expectations and guides the depth of analysis needed.";
if (!constantsContent.includes(searchString)) {
    console.error('Could not find injection point inside constants.ts');
    process.exit(1);
}

const cleanExpanded = "\\n\\n--- APPENDED REFERENCES ---\\n\\n" + expandedPayload.replace(/`/g, '\\`').replace(/\$/g, '$$$$');

constantsContent = constantsContent.replace(searchString, searchString + cleanExpanded);

fs.writeFileSync(constantsFile, constantsContent);
console.log('Successfully appended library and hotkeys to Google Sheets Architect!');
