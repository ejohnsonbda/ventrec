/**
 * VentRec — Google Apps Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Receives audio recordings from the VentRec web app and saves them to a
 * specific Google Drive folder.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project.
 * 2. Paste this entire file into the editor.
 * 3. Set DRIVE_FOLDER_ID below to the ID of your target Google Drive folder.
 *    (The folder ID is the last part of the folder's URL:
 *     https://drive.google.com/drive/folders/FOLDER_ID_HERE)
 * 4. Click Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL and paste it into index.html as GOOGLE_SCRIPT_URL.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── CONFIGURE THIS ────────────────────────────────────────────────────────────
const DRIVE_FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Handle POST requests from the VentRec web app.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action !== 'upload_audio') {
      return buildResponse({ success: false, error: 'Unknown action' });
    }

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

    // Decode base64 audio
    const audioBytes = Utilities.base64Decode(data.audioData);
    const audioBlob = Utilities.newBlob(audioBytes, data.mimeType, data.filename);

    // Save to Drive
    const file = folder.createFile(audioBlob);
    file.setDescription(
      `VentRec recording\n` +
      `Session: ${data.sessionId}\n` +
      `Duration: ${data.duration}s\n` +
      `Size: ${(data.fileSize / 1024).toFixed(1)} KB\n` +
      `Recorded: ${data.timestamp}`
    );

    // Make the file viewable by anyone with the link (optional)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return buildResponse({
      success: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      filename: data.filename
    });

  } catch (err) {
    return buildResponse({ success: false, error: err.message });
  }
}

/**
 * Handle GET requests (health check).
 */
function doGet(e) {
  return buildResponse({ success: true, message: 'VentRec Google Apps Script is running' });
}

/**
 * Build a JSON response with CORS headers.
 */
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
