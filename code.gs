/**
 * Simple Apps Script to receive POSTed JSON and append to a Google Sheet.
 * Deploy as Web App (Execute as: Me; Who has access: Anyone, even anonymous)
 */

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }

    // Sheet ID or name
    var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // Replace with your sheet ID
    var SHEET_NAME = "Locations"; // tab name

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Ensure header row
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Timestamp","Latitude","Longitude","Accuracy","UserAgent","Referrer","Note"]);
    }

    var row = [
      data.timestamp || new Date().toISOString(),
      data.latitude || "",
      data.longitude || "",
      data.accuracy || "",
      data.userAgent || "",
      data.referrer || "",
      data.note || ""
    ];

    sh.appendRow(row);
    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
