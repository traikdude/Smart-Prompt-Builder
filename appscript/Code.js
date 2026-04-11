const CONFIG = {
  // TODO: Replace with your actual Google Sheet ID
  SHEET_ID: "YOUR_GOOGLE_SHEET_ID_HERE",
  SHEET_NAME: "Sheet1"
};

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Smart Prompt Builder')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Saves data to the configured Google Sheet
 * Called from the frontend via google.script.run
 */
function saveDataFromFrontend(data) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) throw new Error("Sheet not found");
    
    // Example: appending a row with the timestamp and the data payload
    sheet.appendRow([new Date(), JSON.stringify(data)]);
    return { success: true, message: "Data saved successfully!" };
  } catch (error) {
    console.error("Error saving data:", error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Retrieves data from the configured Google Sheet
 * Called from the frontend via google.script.run
 */
function loadDataForFrontend() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) throw new Error("Sheet not found");
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Assuming First Row contains headers
    if (values.length <= 1) return { success: true, data: [] };
    
    const headers = values[0];
    const rows = values.slice(1);
    
    const formattedData = rows.map(row => {
        let obj = {};
        headers.forEach((header, idx) => {
            obj[header] = row[idx];
        });
        return obj;
    });
    
    return { success: true, data: formattedData };
  } catch (error) {
    console.error("Error loading data:", error);
    return { success: false, error: error.toString() };
  }
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
