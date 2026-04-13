import { PromptTemplate } from '../../types';

export const directMessageTemplate: PromptTemplate = {
    id: 'direct-message',
    name: 'Direct Message Enhancer',
    description: 'Quick 5-step enhancement for direct messages and communications',
    category: 'communication',
    placeholderTrigger: `"\n\n\n"`,
    content: `DIRECT MESSAGE ENHANCEMENT REQUEST ðŸš€
Step 1: Carefully analyze my original message to understand what I'm trying to convey: 
"


"
Step 2: Transform and restructure my text to create a clearer, more coherent explanation that effectively conveys my intended message with improved readability and understanding.
Step 3: Enhance my content by making it significantly more elaborate, detailed, and informative with greater depth and substance. Format any programming code using markdown code blocks with triple backticks (\`\`\`) to create clear visual separation between explanatory text and actual code.
Step 4: Perform a thorough revision to eliminate all typographical errors, grammatical mistakes, spelling inconsistencies, and linguistic inaccuracies to ensure professional-quality output.
Step 5: Provide me with the completed enhanced version without additional commentary or explanation.

Important: I need you to enhance MY message so it better reflects what I'm trying to communicate. Deliver the revised content as if it's coming from me to my intended audience.`
  };
