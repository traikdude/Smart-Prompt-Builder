import { PromptTemplate } from '../../types';

export const responseRefinerTemplate: PromptTemplate = {
    id: 'response-refiner',
    name: 'Professional Response Refiner',
    description: 'Elevates AI output by enhancing formality, persuasiveness, and depth.',
    category: 'communication',
    placeholderTrigger: `\n\n`,
    content: `I'd like to request a more refined and elaborated version of your previous response, addressing the following specific areas where greater depth and polish would significantly strengthen the output:

1. Formality and Persuasiveness
The previous response conveyed the correct meaning, but the overall tone leaned slightly informal and lacked the persuasive quality that the context called for. A more elevated and compelling register would better serve the intended purpose and leave a stronger impression on the reader.

2. Depth and Elaboration
While the core information was present, the response did not fully honor the request for a more elaborate and informative rewrite. Each key point deserved fuller development â€” with richer context, more precise language, and a greater level of detail â€” to truly maximize the value and substance of the output.

3. Closing Tone
The closing section, in particular, could have been more thoughtfully crafted. A stronger conclusion would not only reinforce the main message but also strike a warmer, more appreciative and collaborative tone â€” one that acknowledges the shared effort and invites continued engagement in a genuine and respectful way.

I believe that addressing these three dimensions in the revised output will bring it much closer to the standard of the reference version, and I very much look forward to seeing the enhanced result. Thank you sincerely for your attention to this feedback â€” your continued effort and care in refining this work are genuinely appreciated.`
  };
