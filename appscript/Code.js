function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Smart Prompt Builder')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function fetchPageContent(url) {
  try {
    if (!url || !url.match(/^https?:\/\//)) {
      throw new Error("Invalid URL. Please include http:// or https://");
    }
    
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      validateHttpsCertificates: false
    });
    
    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      throw new Error("Failed to fetch page. Status: " + responseCode);
    }
    
    const html = response.getContentText();
    
    // Basic cleanup: extract title and body text to reduce noise
    // Note: This is a very simple regex stripper. For production, a library is better, 
    // but GAS has limited library support without bundles.
    // We will extract text inside <body> and strip tags.
    
    let textContent = "";
    
    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      textContent += "Title: " + titleMatch[1] + "\n\n";
    }
    
    // Remove scripts and styles
    const cleanHtml = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");
      
    // Strip tags
    let bodyText = cleanHtml.replace(/<[^>]+>/g, ' ');
    
    // Clean up whitespace
    bodyText = bodyText.replace(/\s+/g, ' ').trim();
    
    // Limit length to prevent errors (GAS return limit is usually fine for text, but good practice)
    if (bodyText.length > 50000) {
      bodyText = bodyText.substring(0, 50000) + "... (truncated)";
    }
    
    textContent += bodyText;
    
    return { success: true, content: textContent };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
