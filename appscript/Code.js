const CONFIG = {
  DOC_ID: "1fuoaLaI7u4ndUbbq_X-1X1c0d6dXROV0iQmlx570Kz0",
};

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Smart Prompt Builder')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Saves data to the configured Google Document
 * Called from the frontend via google.script.run
 */
function saveDataFromFrontend(data) {
  try {
    const doc = DocumentApp.openById(CONFIG.DOC_ID);
    if (!doc) throw new Error("Document not found");
    
    const body = doc.getBody();
    
    // Format the entry for the Google Doc
    body.appendParagraph(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    body.appendParagraph(`timestamp: ${new Date().toLocaleString()}`);
    body.appendParagraph(`template: ${data.templateName}`);
    body.appendParagraph(`\n[USER INPUT]`);
    body.appendParagraph(data.userContent);
    body.appendParagraph(`\n[GENERATED PROMPT]`);
    body.appendParagraph(data.generatedContent);
    body.appendParagraph(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    doc.saveAndClose();
    return { success: true, message: "Data saved to Google Doc successfully!" };
  } catch (error) {
    console.error("Error saving data:", error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Reading structured data from a plain text Document is complex,
 * so we return an empty history array for remote sync, relying on LocalStorage
 * for the sidebar instead!
 */
function loadDataForFrontend() {
  return { success: true, data: [] };
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
    let textContent = "";
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      textContent += "Title: " + titleMatch[1] + "\n\n";
    }
    
    const cleanHtml = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");
      
    let bodyText = cleanHtml.replace(/<[^>]+>/g, ' ');
    bodyText = bodyText.replace(/\s+/g, ' ').trim();
    
    if (bodyText.length > 50000) {
      bodyText = bodyText.substring(0, 50000) + "... (truncated)";
    }
    
    textContent += bodyText;
    
    return { success: true, content: textContent };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
