# 🌊 Monitor de Alagamentos — GitHub Pages

App estático (HTML + JS puro) para registro colaborativo de alagamentos escolares.  
Funciona 100% no navegador, sem servidor Python. Os dados vão direto para o Google Sheets via Apps Script.

---

## 📁 Arquivos

```
/
├── index.html       ← App completo (HTML + CSS + JS em um arquivo)
├── apps-script.js   ← Código para colar no Google Apps Script
└── README.md
```

---

## 🚀 Passo a passo para publicar

### 1. Criar o repositório no GitHub

1. Crie um repositório público no GitHub (ex: `monitor-alagamentos`)
2. Faça upload dos arquivos `index.html` e `apps-script.js`
3. Vá em **Settings → Pages**
4. Source: **Deploy from a branch** → branch `main` → pasta `/ (root)`
5. Salve. Em ~1 minuto, o app estará em:
   `https://seu-usuario.github.io/monitor-alagamentos`

---

### 2. Criar a planilha no Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha
2. Renomeie a aba para **Registros**
3. Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/  →ESTE_TRECHO←  /edit
   ```

---

### 3. Criar o Google Apps Script

1. Acesse [script.google.com](https://script.google.com) → **Novo projeto**
2. Apague o código existente e cole o conteúdo de `apps-script.js`
3. Na linha `SPREADSHEET_ID`, substitua pelo ID copiado no passo anterior
4. Salve (Ctrl+S) e dê um nome ao projeto

---

### 4. Publicar o Apps Script como Web App

1. Clique em **Implantar** → **Nova implantação**
2. Tipo: clique na engrenagem ⚙️ → **App da Web**
3. Configure:
   - **Descrição**: Monitor de Alagamentos
   - **Executar como**: Eu (seu e-mail)
   - **Quem tem acesso**: Qualquer pessoa
4. Clique em **Implantar** e autorize as permissões
5. **Copie a URL** gerada (começa com `https://script.google.com/macros/s/...`)

---

### 5. Conectar o app à planilha

1. Abra `index.html` em um editor de texto
2. Localize a seção `CONFIG` no JavaScript (início do `<script>`)
3. Cole a URL no campo `APPS_SCRIPT_URL`:

```js
APPS_SCRIPT_URL: "https://script.google.com/macros/s/SEU_ID/exec",
```

4. Faça commit e push para o GitHub. O GitHub Pages atualiza em ~30 segundos.

---

### 6. Personalizar usuários e setores

Ainda no bloco `CONFIG` do `index.html`:

```js
// Adicione ou remova usuários
USERS: {
  "admin":       "escola123",
  "professora.ana": "minhasenha",
},

// Nome da escola
SCHOOL_NAME: "E.M. João da Silva",

// Ajuste os setores da planta (x, y, w, h em %)
SECTORS: [
  { id:"a1", label:"Bloco A · Salas 1–4", x:0, y:0, w:33, h:33 },
  // ...
],
```

---

## 📊 Resultado na planilha

Cada clique no botão "Confirmar Registro" adiciona uma linha:

| Data | Hora | Setor / Local | Nível | Usuário | Observações | Timestamp ISO |
|------|------|---------------|-------|---------|-------------|---------------|
| 25/03/2026 | 09:42:15 | Pátio Coberto Norte | Moderado | prof.ana | Água vindo da calha | 2026-03-25T12:42:15.000Z |

---

## ⚠️ Avisos importantes

- **Senhas no HTML são visíveis no código-fonte** — adequado para uso interno escolar, mas não para dados sensíveis.
- Se precisar de mais segurança, considere usar [Netlify Identity](https://www.netlify.com/products/identity/) ou migrar para Streamlit/Render.
- O Apps Script com acesso "Qualquer pessoa" aceita requests sem autenticação — proteja a URL do script se necessário.
- O app usa `mode: 'no-cors'` para o fetch, então não consegue ler a resposta do servidor. Se o envio falhar silenciosamente, verifique a URL do Apps Script no console do navegador (F12).
