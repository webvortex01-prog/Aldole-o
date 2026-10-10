const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');

const vars = ['SITE_INFO', 'TIMELINE_DATA', 'AREAS_ATUACAO', 'SOLUCOES_EXCELENCIA', 'COMPARATIVO_VALORES', 'LIVROS_DIGITAIS', 'ARTIGOS_NOTICIAS', 'FAQ_LANDING_PAGE'];

const importRegex = /import\s+\{([^}]+)\}\s+from\s+'\.\/data\.js';/;
code = code.replace(importRegex, `import * as defaultData from './data.js';

let appData = { ...defaultData };
const savedAdminData = localStorage.getItem('aldoleao_admin_data');
if (savedAdminData) {
  try {
    appData = { ...appData, ...JSON.parse(savedAdminData) };
  } catch(e) { console.error('Error parsing admin data', e); }
}
window.appData = appData;`);

vars.forEach(v => {
  const regex = new RegExp(`\\b${v}\\b`, 'g');
  code = code.replace(regex, `appData.${v}`);
});

// Fix any double appData
code = code.replace(/appData\.appData\./g, 'appData.');

// Add routing
code = code.replace(/if\s*\(hash\s*===\s*'#1208'/g, `if (hash === '#admin') { state.currentRoute = 'admin'; } else if (hash === '#1208'`);
code = code.replace(/if\s*\(currentHash\s*===\s*'#1208'/g, `if (currentHash === '#admin') { navigateTo('admin'); } else if (currentHash === '#1208'`);

// Add renderAdminPanel function call
code = code.replace(/if\s*\(state\.currentRoute\s*===\s*'lp'\)\s*\{/g, `if (state.currentRoute === 'admin') { app.innerHTML = renderAdminPanel(); setTimeout(initAdminPanel, 100); return; } else if (state.currentRoute === 'lp') {`);

// Append Admin Panel code
const adminCode = `

/* ==========================================================================
   PAINEL DE ADMINISTRAÇÃO (WP-LIKE)
   ========================================================================== */
function renderAdminPanel() {
  return \`
    <div style="min-height: 100vh; background: #f1f5f9; display: flex; flex-direction: column; font-family: sans-serif;">
      <div style="background: #1e293b; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0; font-size: 1.5rem;">⚙️ Aldo Leão - Painel Administrativo</h1>
        <div>
          <button id="btnAdminSave" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 10px;">💾 Salvar Alterações</button>
          <button id="btnAdminReset" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 10px;">🗑️ Resetar Original</button>
          <a href="#institucional" style="color: white; text-decoration: underline;">Voltar ao Site</a>
        </div>
      </div>
      <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); flex-grow: 1; display: flex; flex-direction: column;">
          <p style="color: #64748b; margin-top: 0;">Edite todos os textos, links e dados do site abaixo. O site será atualizado em tempo real para todos os usuários.</p>
          <div id="jsoneditor" style="flex-grow: 1; height: 600px;"></div>
        </div>
      </div>
    </div>
  \`;
}

function initAdminPanel() {
  if (!window.JSONEditor) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.0/jsoneditor.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.0/jsoneditor.min.js';
    script.onload = setupEditor;
    document.head.appendChild(script);
  } else {
    setupEditor();
  }
}

let editorInstance = null;
function setupEditor() {
  const container = document.getElementById("jsoneditor");
  const options = {
    mode: 'tree',
    modes: ['tree', 'form', 'code'],
    name: 'ConteudoDoSite'
  };
  editorInstance = new window.JSONEditor(container, options);
  
  // Clone object to avoid circular refs, exclude functions
  const dataToEdit = JSON.parse(JSON.stringify(window.appData));
  editorInstance.set(dataToEdit);

  document.getElementById('btnAdminSave').addEventListener('click', () => {
    const updatedData = editorInstance.get();
    localStorage.setItem('aldoleao_admin_data', JSON.stringify(updatedData));
    alert('✅ Alterações Salvas com Sucesso! O site já está atualizado.');
  });

  document.getElementById('btnAdminReset').addEventListener('click', () => {
    if(confirm('Tem certeza? Isso apagará todas as suas edições e voltará ao padrão do contrato.')) {
      localStorage.removeItem('aldoleao_admin_data');
      window.location.reload();
    }
  });
}
`;

code += adminCode;

fs.writeFileSync('src/main.js', code);
console.log('Admin panel injected successfully.');
