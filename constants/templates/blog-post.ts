import { PromptTemplate } from '../../types';

export const blogPostTemplate: PromptTemplate = {
    id: 'blog-post',
    name: 'Blog Post Generator',
    description: 'Creates SEO-optimized blog posts with structure and CTA',
    category: 'creative',
    placeholderTrigger: `[Paste your specific topic or outline here]`,
    content: `### BLOG POST GENERATOR

**Objective:** Create a comprehensive, engaging, and SEO-optimized blog post based on the provided topic or outline.

**Target Audience:** [Specify Audience]
**Tone:** [Specify Tone, e.g., Professional, Conversational, Witty]
**Keywords:** [List Keywords]

**Structure:**
1.  **Catchy Title:** Create 3 options.
2.  **Introduction:** Hook the reader and state the problem/solution.
3.  **Key Body Paragraphs:** Use subheadings (H2, H3).
4.  **Conclusion:** Summarize key takeaways.
5.  **Call to Action (CTA):** Encourage engagement.

**Instructions:**
*   Ensure the content is original and high-quality.
*   Use bullet points and short paragraphs for readability.
*   Include relevant examples or analogies.
*   Optimize for the specified keywords naturally.

[Paste your specific topic or outline here]`
  };
