/**
 * ============================================================
 *  GOOGLE APPS SCRIPT — Buzón de Fotos de Valeria
 *  Guarda fotos en Google Drive y registra en una hoja de cálculo
 * ============================================================
 *
 *  INSTRUCCIONES DE INSTALACIÓN:
 *
 *  1. Ve a: https://script.google.com  y crea un "Nuevo proyecto"
 *  2. Borra todo el código que aparece y pega este archivo completo
 *  3. Cambia FOLDER_ID_AQUI por el ID de tu carpeta de Google Drive
 *     (el ID es la parte final de la URL de la carpeta)
 *     Ej.: https://drive.google.com/drive/folders/1ABC123xyz  → ID = 1ABC123xyz
 *  4. Haz clic en "Guardar" (ícono de disquete)
 *  5. Haz clic en "Implementar" → "Nueva implementación"
 *  6. Tipo:  "Aplicación web"
 *     Ejecutar como: "Yo"
 *     Acceso:  "Cualquier usuario"  ← importante
 *  7. Haz clic en "Implementar" y copia la URL que aparece
 *  8. Pega esa URL en index.html donde dice PEGAR_URL_DE_GOOGLE_APPS_SCRIPT_AQUI
 *
 * ============================================================
 */

// 🔧 CAMBIA ESTO por el ID de tu carpeta de Google Drive
const FOLDER_ID = "FOLDER_ID_AQUI";

// ============================================================

function doPost(e) {
  try {
    const payload  = JSON.parse(e.postData.contents);
    const name     = payload.name     || "Invitado";
    const email    = payload.email    || "";
    const message  = payload.message  || "";
    const fileName = payload.fileName || "foto.jpg";
    const mimeType = payload.mimeType || "image/jpeg";
    const data     = payload.data;      // base64
    const isFirst  = payload.isFirst === true;

    // 1. Guardar foto en Drive
    const folder  = DriveApp.getFolderById(FOLDER_ID);
    const bytes   = Utilities.base64Decode(data);
    const blob    = Utilities.newBlob(bytes, mimeType, `[${name}] ${fileName}`);
    folder.createFile(blob);

    // 2. Si es la primera foto del lote, registrar en una hoja de cálculo
    if (isFirst) {
      registrarInvitado(name, email, message);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Registra nombre, correo y mensaje en una hoja del mismo Spreadsheet
function registrarInvitado(name, email, message) {
  try {
    // Busca o crea una hoja de cálculo llamada "Registro Valeria" en el mismo Drive
    const files = DriveApp.getFolderById(FOLDER_ID)
                           .getFilesByName("Registro Invitados – Valeria");
    let ss;
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create("Registro Invitados – Valeria");
      // Moverla a la carpeta correcta
      DriveApp.getFileById(ss.getId()).moveTo(DriveApp.getFolderById(FOLDER_ID));
      // Cabeceras
      const sheet = ss.getActiveSheet();
      sheet.appendRow(["Fecha", "Nombre", "Correo", "Mensaje"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }

    const sheet = ss.getActiveSheet();
    const now   = Utilities.formatDate(new Date(), "America/Caracas", "dd/MM/yyyy HH:mm");
    sheet.appendRow([now, name, email, message]);

  } catch (err) {
    // No es crítico si falla el registro, las fotos ya se guardaron
    console.log("Error al registrar invitado:", err.message);
  }
}

// Función de prueba — puedes ejecutarla desde el editor para verificar permisos
function testSetup() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  Logger.log("✅ Carpeta encontrada: " + folder.getName());
}

// ============================================================
// Endpoint GET para obtener la lista de fotos y videos
// ============================================================
function doGet(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const fileList = [];

    while (files.hasNext()) {
      const file = files.next();
      fileList.push({
        id: file.getId(),
        name: file.getName(),
        url: `https://drive.google.com/uc?export=view&id=${file.getId()}`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${file.getId()}`,
        mimeType: file.getMimeType()
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, files: fileList }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
