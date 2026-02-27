/**
 * ═══════════════════════════════════════════════════════════════
 *  GOOGLE APPS SCRIPT — Monitor de Alagamentos Escolares
 *  Cole este código em: script.google.com → Novo projeto
 * ═══════════════════════════════════════════════════════════════
 *
 *  Passos para configurar:
 *  1. Acesse https://script.google.com e crie um novo projeto
 *  2. Cole este código substituindo o conteúdo existente
 *  3. Altere SPREADSHEET_ID abaixo com o ID da sua planilha
 *  4. Clique em "Implantar" → "Nova implantação"
 *  5. Tipo: "App da Web"
 *     - Executar como: "Eu (seu e-mail)"
 *     - Quem tem acesso: "Qualquer pessoa" (para acesso público)
 *  6. Autorize as permissões quando solicitado
 *  7. Copie a URL gerada e cole em CONFIG.APPS_SCRIPT_URL no index.html
 */

// ── Sua planilha ──────────────────────────────────────────────
// Pegue o ID na URL: docs.google.com/spreadsheets/d/ESTE_ID/edit
const SPREADSHEET_ID = "COLE_O_ID_DA_SUA_PLANILHA_AQUI";
const SHEET_NAME     = "Registros"; // nome da aba (crie uma aba com esse nome)
// ─────────────────────────────────────────────────────────────

/**
 * Recebe os dados enviados pelo app (via GET com query params)
 * Escreve uma nova linha na planilha e retorna JSON.
 */
function doGet(e) {
  try {
    const params = e.parameter;

    // Validação mínima
    if (!params.setor || !params.usuario) {
      return jsonResponse({ success: false, error: "Parâmetros obrigatórios ausentes." });
    }

    const sheet = getOrCreateSheet();
    ensureHeader(sheet);

    const row = [
      params.data    || new Date().toLocaleDateString('pt-BR'),
      params.hora    || new Date().toLocaleTimeString('pt-BR'),
      params.setor   || "",
      params.nivel   || "Leve",
      params.usuario || "",
      params.obs     || "",
      new Date().toISOString(),  // timestamp ISO para auditoria
    ];

    sheet.appendRow(row);

    return jsonResponse({ success: true, message: "Registro salvo com sucesso." });

  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ── Helpers ───────────────────────────────────────────────────

function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeader(sheet) {
  // Se a primeira linha está vazia, insere o cabeçalho
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === "") {
    const header = ["Data", "Hora", "Setor / Local", "Nível", "Usuário", "Observações", "Timestamp ISO"];
    sheet.appendRow(header);

    // Formata o cabeçalho
    const headerRange = sheet.getRange(1, 1, 1, header.length);
    headerRange.setBackground("#083D5E")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setFontSize(11);

    // Congela a primeira linha
    sheet.setFrozenRows(1);

    // Largura automática das colunas
    sheet.autoResizeColumns(1, header.length);
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
