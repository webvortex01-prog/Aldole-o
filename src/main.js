import * as defaultData from './data.js';

let appData = { ...defaultData };
const savedAdminData = localStorage.getItem('aldoleao_admin_data');
if (savedAdminData) {
  try {
    appData = { ...appData, ...JSON.parse(savedAdminData) };
  } catch(e) { console.error('Error parsing admin data', e); }
}
window.appData = appData;

import './style.css';

// Estado da Aplicação
const state = {
  currentRoute: 'institucional', // 'institucional' | 'lp'
  heroSlideIndex: 0,
  sliderTimer: null,
  blogSearchQuery: '',
  blogCategoryFilter: 'all',
  blogAreaFilter: 'all',
  blogVisibleCount: 6,
  experienceYears: new Date().getFullYear() - 1986,
  counterAnimated: false,
};

// Utilitário para construir links do WhatsApp
function createWhatsAppUrl(customMessage) {
  const phone = appData.SITE_INFO.phones.rawWhatsApp;
  const encodedText = encodeURIComponent(customMessage.trim());
  return `https://wa.me/${phone}?text=${encodedText}`;
}

// Inicializador
document.addEventListener('DOMContentLoaded', () => {
  initRouting();
  renderApp();
  setupRouteListeners();
});

// Sistema de Roteamento Simples e Robusto
function initRouting() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#admin') { state.currentRoute = 'admin'; } else if (hash === '#1208' || hash === '#landing-page' || hash === '#lp') {
    state.currentRoute = 'lp';
  } else {
    state.currentRoute = 'institucional';
  }

  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.toLowerCase();
    if (currentHash === '#admin') { navigateTo('admin'); } else if (currentHash === '#1208' || currentHash === '#landing-page' || currentHash === '#lp') {
      navigateTo('lp');
    } else {
      navigateTo('institucional');
    }
  });
}

function navigateTo(route) {
  state.currentRoute = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
  updateRouteSwitcherUI();
}

function updateRouteSwitcherUI() {
  const label = document.getElementById('activeRouteLabel');
  const btnSite = document.getElementById('btnSwitchToSite');
  const btnLP = document.getElementById('btnSwitchToLP');

  if (state.currentRoute === 'admin') { app.innerHTML = renderAdminPanel(); setTimeout(initAdminPanel, 100); return; } else if (state.currentRoute === 'lp') {
    if (label) label.textContent = 'Landing Page Oculta (aldoleao.adv.br/1208/)';
    if (btnSite) btnSite.classList.remove('active');
    if (btnLP) btnLP.classList.add('active');
  } else {
    if (label) label.textContent = 'Site Institucional (aldoleao.adv.br)';
    if (btnSite) btnSite.classList.add('active');
    if (btnLP) btnLP.classList.remove('active');
  }
}

function setupRouteListeners() {
  const btnSite = document.getElementById('btnSwitchToSite');
  const btnLP = document.getElementById('btnSwitchToLP');

  if (btnSite) {
    btnSite.addEventListener('click', () => {
      window.location.hash = '#institucional';
      navigateTo('institucional');
    });
  }

  if (btnLP) {
    btnLP.addEventListener('click', () => {
      window.location.hash = '#1208';
      navigateTo('lp');
    });
  }
}

// Renderizador Principal
function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  if (state.currentRoute === 'admin') { app.innerHTML = renderAdminPanel(); setTimeout(initAdminPanel, 100); return; } else if (state.currentRoute === 'lp') {
    app.innerHTML = renderLandingPage();
    attachLandingPageEvents();
  } else {
    app.innerHTML = renderSiteInstitucional();
    attachInstitucionalEvents();
  }

  renderFloatingWhatsApp();
  renderFloatingAdminBtn();
  updateRouteSwitcherUI();
}

function renderFloatingAdminBtn() {
  const existing = document.getElementById('floatingAdminBtn');
  if (existing) existing.remove();

  const btn = document.createElement('a');
  btn.id = 'floatingAdminBtn';
  btn.href = '#admin';
  btn.title = 'Acessar Painel de Controle';
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #1e293b;
    color: #fff;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    z-index: 9999;
    font-size: 24px;
    transition: transform 0.3s ease;
  `;
  btn.innerHTML = '⚙️';
  
  btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';

  document.body.appendChild(btn);
}

/* ==========================================================================
   RENDERIZAÇÃO: SITE INSTITUCIONAL
   ========================================================================== */
function renderSiteInstitucional() {
  return `
    <!-- Topbar Institucional -->
    <div class="site-topbar">
      <div class="container topbar-container">
        <div class="topbar-contact">
          <span class="topbar-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <a href="tel:51998088998">${appData.SITE_INFO.phones.primary}</a>
          </span>
          <span class="topbar-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <a href="mailto:${appData.SITE_INFO.emails[0]}">${appData.SITE_INFO.emails[0]}</a>
          </span>
        </div>
        <div class="topbar-badge">
          <span>🏛️ Escritório de Advocacia Mais Antigo do Brasil • Tradição Desde 1908</span>
        </div>
      </div>
    </div>

    <!-- Header Principal Sticky -->
    <header class="site-header">
      <div class="container header-container">
        <a href="#institucional" class="brand-logo" onclick="event.preventDefault(); window.location.hash='#institucional';">
          <div class="logo-lion-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">ALDO LEÃO</span>
            <span class="brand-subtitle">ADVOCACIA ESTRATÉGICA</span>
            <span class="brand-badge">Tradição Jurídica Centenária Desde 1908</span>
          </div>
        </a>

        <button class="menu-toggle-btn" id="mobileMenuBtn" aria-label="Abrir menu">☰</button>

        <nav class="main-nav" id="mainNav">
          <a href="#home" class="nav-link">Início</a>
          <a href="#presenca" class="nav-link">Presença Nacional</a>
          <a href="#experiencia" class="nav-link">Experiência</a>
          <a href="#legado" class="nav-link">O Legado</a>
          <a href="#head" class="nav-link">Head Jurídico</a>
          <a href="#areas" class="nav-link">Áreas</a>
          <a href="#solucoes" class="nav-link">Soluções</a>
          <a href="#publicacoes" class="nav-link">Publicações</a>
          <a href="#livros" class="nav-link">Livros</a>
          <a href="#contato" class="nav-link">Contato</a>
          <button class="btn btn-primary btn-sm nav-cta" id="btnHeaderConsulta">
            Agendar Consulta
          </button>
        </nav>
      </div>
    </header>

    <!-- 1. HERO SLIDER (2 SLIDES) -->
    <section class="hero-slider-section" id="home">
      <!-- Slide 1: Tradição & Autoridade Institucional -->
      <div class="hero-slide active" id="heroSlide0">
        <div class="hero-slide-bg" style="background-image: url('/assets/images/hero_office.jpg');"></div>
        <div class="hero-slide-overlay"></div>
        <div class="container">
          <div class="hero-content">
            <span class="eyebrow eyebrow-dark">ALDO LEÃO ADVOCACIA ESTRATÉGICA</span>
            <h1 class="hero-title">TRADIÇÃO JURÍDICA DESDE 1908</h1>
            <p class="hero-description">
              Desde 1908, o escritório de advocacia mais antigo do Brasil une tradição jurídica, 
              experiência e inovação na proteção e perpetuação de legados familiares. 
              Com sede em Porto Alegre e atuação digital em todo o território nacional, o Dr. Aldo Leão 
              representa a terceira geração da família na Advocacia Estratégica (1986).
            </p>
            <div class="hero-ctas">
              <button class="btn btn-primary" id="btnSlide1WhatsApp">
                Agendar Consulta Digital
              </button>
              <a href="#1208" class="btn btn-outline-white" onclick="event.preventDefault(); window.location.hash='#1208';">
                Conheça a Holding Familiar 4.0
              </a>
            </div>
            
            <div class="hero-boxes-grid">
              <div class="hero-box">
                <div class="hero-box-label">Excelência Jurídica Centenária</div>
                <div class="hero-box-title">ADVOCACIA ESTRATÉGICA</div>
                <p class="hero-box-desc">
                  Um legado familiar construído desde 1908, que atravessa três gerações e se traduz em soluções jurídicas multidisciplinares e planejamento de alto nível.
                </p>
              </div>
              <div class="hero-box">
                <div class="hero-box-label">Planejamento Patrimonial 4.0</div>
                <div class="hero-box-title">PROTEJA E PERPETUE SEU LEGADO</div>
                <p class="hero-box-desc">
                  Solução preventiva que integra patrimônio, família e empresas para estruturar em vida a proteção patrimonial e a sucessão pacífica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 2: Holding Familiar 4.0 -->
      <div class="hero-slide" id="heroSlide1">
        <div class="hero-slide-bg" style="background-image: url('/assets/images/holding_family.jpg');"></div>
        <div class="hero-slide-overlay"></div>
        <div class="container">
          <div class="hero-content">
            <span class="eyebrow eyebrow-dark">PLANEJAMENTO PATRIMONIAL 4.0 (via Holding Familiar)</span>
            <h2 class="hero-title">O ECOSSISTEMA SOCIETÁRIO QUE PROTEGE E PERPETUA O SEU LEGADO</h2>
            <p class="hero-description">
              Proteja, organize e perpetue o seu legado patrimonial e empresarial com inteligência jurídica e segurança estratégica. 
              A Holding Familiar é a solução definitiva para blindagem de bens, sucessão planejada e eliminação da elevada perda financeira do inventário.
            </p>
            <div class="hero-ctas">
              <a href="#1208" class="btn btn-primary" onclick="event.preventDefault(); window.location.hash='#1208';">
                Agendar Diagnóstico de Viabilidade
              </a>
              <a href="#areas" class="btn btn-outline-white">
                Ver Todas as Áreas de Atuação
              </a>
            </div>
            <div class="hero-boxes-grid">
              <div class="hero-box">
                <div class="hero-box-label">Eliminação do Inventário</div>
                <div class="hero-box-title">ECONOMIA MÉDIA DE 55,21%</div>
                <p class="hero-box-desc">
                  Evite custos cartorários, disputas de herdeiros e vendas forçadas com deságio de até 20% do patrimônio.
                </p>
              </div>
              <div class="hero-box">
                <div class="hero-box-label">Controle dos Pais</div>
                <div class="hero-box-title">CLÁUSULAS PROTETIVAS EM VIDA</div>
                <p class="hero-box-desc">
                  Usufruto vitalício, incomunicabilidade, impenhorabilidade, golden share e governança personalizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles do Slider -->
      <div class="slider-nav">
        <button class="slider-btn" id="sliderPrevBtn" aria-label="Slide anterior">‹</button>
        <div class="slider-dots">
          <span class="slider-dot active" data-slide="0"></span>
          <span class="slider-dot" data-slide="1"></span>
        </div>
        <button class="slider-btn" id="sliderNextBtn" aria-label="Próximo slide">›</button>
      </div>
    </section>

    <!-- 2. PRESENÇA NACIONAL DIGITAL -->
    <section class="section-presenca" id="presenca">
      <div class="container">
        <div class="presenca-grid">
          <div>
            <span class="eyebrow">ATENDIMENTO JURÍDICO DE EXCELÊNCIA EM TODO O BRASIL</span>
            <h2 class="section-title">PRESENÇA NACIONAL DIGITAL</h2>
            <div class="gold-divider"></div>
            <p class="section-desc">
              Com sede em Porto Alegre, a <strong>Advocacia Estratégica Dr. Aldo Leão</strong> rompe as fronteiras geográficas para levar a Excelência Jurídica Centenária a clientes de todo o território nacional.
            </p>
            <p style="color: var(--color-text-main); font-size: 15px; margin-bottom: 20px;">
              Por meio de uma infraestrutura tecnológica de última geração e de processos 100% digitais, disponibilizamos uma advocacia estratégica moderna, segura e eficiente, proporcionando atendimento virtual com a mesma qualidade, proximidade e excelência do atendimento presencial.
            </p>
            <p style="color: var(--color-navy); font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              EXPERIMENTE A ADVOCACIA ESTRATÉGICA DO FUTURO, HOJE.
            </p>

            <div class="presenca-features">
              <div class="presenca-card">
                <div class="presenca-icon">💻</div>
                <div class="presenca-card-title">Atendimento 100% Digital</div>
                <div class="presenca-card-desc">Consultas virtuais com hora marcada, eliminando deslocamentos desnecessários e otimizando o tempo da sua família.</div>
              </div>
              <div class="presenca-card">
                <div class="presenca-icon">🔒</div>
                <div class="presenca-card-title">Segurança & Sigilo Máximo</div>
                <div class="presenca-card-desc">Processos criptografados, confidencialidade rigorosa e compliance documental irrestrito.</div>
              </div>
              <div class="presenca-card">
                <div class="presenca-icon">🇧🇷</div>
                <div class="presenca-card-title">Abrangência Nacional</div>
                <div class="presenca-card-desc">Atuação em todos os 26 estados e no Distrito Federal, com assessoria unificada de vanguarda.</div>
              </div>
              <div class="presenca-card">
                <div class="presenca-icon">⏱️</div>
                <div class="presenca-card-title">Agilidade Decisória</div>
                <div class="presenca-card-desc">Comunicação fluida via canais privativos e suporte contínuo para decisões societárias.</div>
              </div>
            </div>
          </div>

          <div class="presenca-visual">
            <div class="map-badge-card">
              <div class="map-stat-highlight">26 Estados + DF</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #FFF; margin-bottom: 14px;">Advocacia Estratégica Sem Distâncias</h3>
              <p style="color: #BDD3E8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Clientes do agronegócio no Centro-Oeste, investidores no Sudeste, famílias empresárias no Sul e empresas em expansão no Norte e Nordeste contam com a mesma assessoria jurídica centenária.
              </p>
              <div style="border-top: 1px solid rgba(212, 175, 55, 0.3); padding-top: 18px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; color: var(--color-gold); font-weight: 700;">SEDE: PORTO ALEGRE / RS</span>
                <span style="font-size: 12px; color: #A5C0D8;">Atuação Digital Unificada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. EXPERIÊNCIA PROFISSIONAL (CONTADOR DE ANOS CALCULADO) -->
    <section class="section-experiencia" id="experiencia">
      <div class="container">
        <div class="experiencia-box-wrap">
          <div class="counter-gold-card" id="counterCardTrigger">
            <div class="counter-icon-wrap">
              <!-- Balança da Justiça Branca -->
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3v18M3 7l4 8h10l4-8M7 15a4 4 0 0 1-8 0M21 15a4 4 0 0 1-8 0"></path>
                <circle cx="12" cy="3" r="1.5"></circle>
              </svg>
            </div>
            <div class="counter-digits-area">
              <div class="counter-number-val" id="expCounterNumber">0</div>
              <div class="counter-labels">
                <div class="counter-line-1">ANOS</div>
                <div class="counter-line-2">Dr. Aldo Leão</div>
                <div class="counter-subnote">Carreira jurídica de excelência iniciada em 1986</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. O LEGADO CENTENÁRIO & TIMELINE -->
    <section class="section-legado" id="legado">
      <div class="container">
        <div class="legado-header-grid">
          <div>
            <span class="eyebrow">O LEGADO CENTENÁRIO</span>
            <h2 class="section-title">UMA TRAJETÓRIA DE TRÊS GERAÇÕES DEDICADAS À EXCELÊNCIA JURÍDICA</h2>
            <div class="gold-divider"></div>
            <p class="section-desc">
              A história da <strong>Aldo Leão Advocacia Estratégica</strong> começou em 1908 e atravessa mais de um século de dedicação ao Direito, preservando valores éticos, excelência técnica e compromisso permanente com a proteção dos interesses de seus clientes.
            </p>
            <p style="color: var(--color-text-main); font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
              Desde 1986, esse legado jurídico centenário é representado pela terceira geração da família, unindo tradição jurídica, inovação e inteligência estratégica para oferecer soluções jurídicas de alta performance.
            </p>
            <div class="legado-signature-block">
              <button class="btn btn-primary btn-sm" id="btnVerHistoriaCompleta">
                Conhecer História Detalhada
              </button>
              <span class="signature-badge">Dr. Aldo Leão Ferreira Filho</span>
            </div>
          </div>
          <div>
            <div style="border-radius: 6px; overflow: hidden; box-shadow: var(--shadow-lg); border: 2px solid var(--color-gold);">
              <img src="/assets/images/timeline_library.jpg" alt="Biblioteca Jurídica Centenária Fundada em 1908" style="width: 100%; height: 380px; object-fit: cover;">
            </div>
          </div>
        </div>
      </div>

      <!-- Faixa da Linha do Tempo Parallax -->
      <div class="parallax-timeline-wrap">
        <div class="parallax-bg-fixed" style="background-image: url('/assets/images/timeline_library.jpg');"></div>
        <div class="parallax-overlay"></div>
        
        <div class="parallax-timeline-content">
          <!-- Cabeçalho da Timeline -->
          <div class="parallax-header-section">
            <div class="container text-center" style="position: relative; z-index: 3;">
              <span class="eyebrow eyebrow-dark">NOSSA HISTÓRIA</span>
              <h3 class="section-title light">MARCOS HISTÓRICOS DE UMA FAMÍLIA JURÍDICA</h3>
              <p class="section-desc light" style="margin: 0 auto;">
                Role para baixo e acompanhe nossa trajetória de solidez, expansão e excelência na advocacia estratégica.
              </p>
            </div>
          </div>

          <!-- Anos da Timeline -->
          ${appData.TIMELINE_DATA.map(item => `
            <div class="parallax-year-section" style="flex-direction: column; padding: 0;">
              <div class="timeline-line"></div>
              
              <div class="timeline-node" style="transform: scale(1.6); padding: 40px 20px; flex-shrink: 0;">
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-bullet"></div>
                <div class="timeline-gen">${item.generation}</div>
                <div class="timeline-phrase">${item.badge}</div>
              </div>
              
              <div class="timeline-line"></div>
            </div>
          `).join('')}
          
          <!-- Slide Final (Todos os anos juntos) -->
          <div class="parallax-year-section parallax-final-section" style="flex-direction: column; padding: 0;">
            <div class="timeline-line" style="flex-grow: 0; height: 15vh;"></div>
            
            <div class="container parallax-container-center" style="background: transparent; border: none; box-shadow: none; backdrop-filter: none; flex-shrink: 0; margin-top: 40px;">
              <div class="parallax-all-years">
                ${appData.TIMELINE_DATA.map(item => `<span>${item.year}</span>`).join('<span class="dot">•</span>')}
              </div>
              <h2 class="parallax-impact-phrase">"UM SÉCULO DE TRADIÇÃO. O FUTURO DA ADVOCACIA ESTRATÉGICA."</h2>
              <div class="gold-divider center" style="margin-bottom: 24px;"></div>
              <p class="parallax-desc-text" style="color: #E0E7EE; max-width: 650px; margin: 0 auto;">Mais do que registrar história, nosso compromisso é garantir a perpetuidade e o crescimento seguro do patrimônio e dos negócios de nossos clientes através de gerações.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. HEAD JURÍDICO: DR. ALDO LEÃO -->
    <section class="section-head" id="head">
      <div class="container">
        <div class="head-grid">
          <div class="head-photo-card">
            <img src="/assets/images/dr_aldo_leao.jpg" alt="Dr. Aldo Leão Ferreira Filho - Head Jurídico">
            <div class="head-photo-caption">
              <div class="head-name-highlight">DR. ALDO LEÃO</div>
              <div class="head-role-sub">Head Jurídico da ALDO LEÃO ADVOCACIA ESTRATÉGICA</div>
            </div>
          </div>

          <div>
            <span class="eyebrow">DIRETOR JURÍDICO</span>
            <h2 class="section-title">DR. ALDO LEÃO FERREIRA FILHO</h2>
            <div class="gold-divider"></div>
            <p style="font-size: 1.1rem; color: var(--color-navy); font-weight: 600; margin-bottom: 18px; line-height: 1.6;">
              Representando a terceira geração do legado jurídico familiar iniciado em 1908, o Dr. Aldo Leão exerce a advocacia estratégica desde 1986.
            </p>
            <p style="color: var(--color-text-main); font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
              Sua atuação combina tradição jurídica centenária, inteligência estratégica e visão preventiva, proporcionando aos clientes estruturas jurídicas personalizadas, capazes de proteger patrimônios, fortalecer empresas e assegurar a continuidade das futuras gerações.
            </p>

            <ul class="head-credentials-list">
              <li class="head-credential-item">
                <span class="check-gold">✓</span>
                <span><strong>Terceira geração</strong> do legado jurídico familiar iniciado em 1908.</span>
              </li>
              <li class="head-credential-item">
                <span class="check-gold">✓</span>
                <span><strong>Mais de quatro décadas</strong> de prática ininterrupta na advocacia estratégica (desde 1986).</span>
              </li>
              <li class="head-credential-item">
                <span class="check-gold">✓</span>
                <span><strong>Especialista em Holding Familiar</strong> (Planejamento Patrimonial 4.0), Proteção Patrimonial e Sucessão Empresarial.</span>
              </li>
              <li class="head-credential-item">
                <span class="check-gold">✓</span>
                <span>Ex-Procurador Municipal de 20 Municípios no RS e Ex-Procurador do Banco do Brasil S/A.</span>
              </li>
              <li class="head-credential-item">
                <span class="check-gold">✓</span>
                <span>Professor Universitário e autor de livros jurídicos e mais de uma centena de artigos publicados.</span>
              </li>
            </ul>

            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <button class="btn btn-primary" id="btnCurriculoModal">
                Ver Currículo & Obra Completa
              </button>
              <button class="btn btn-outline-gold" id="btnHeadAgendar">
                Agendar Consulta com Dr. Aldo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. ÁREAS DE ATUAÇÃO (CARDS HOVER DECISION THEME) -->
    <section class="section-areas" id="areas">
      <div class="container">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 50px auto;">
          <span class="eyebrow">SOLUÇÕES JURÍDICAS DE ALTA PERFORMANCE</span>
          <h2 class="section-title">ÁREAS DE ATUAÇÃO</h2>
          <div class="gold-divider center"></div>
          <p class="section-desc" style="margin: 0 auto;">
            Com a solidez de um legado centenário e a experiência de mais de quatro décadas, desenvolvemos soluções jurídicas sob medida para proteger patrimônios e fortalecer negócios.
          </p>
        </div>

        <div class="areas-grid">
          ${appData.AREAS_ATUACAO.map(area => `
            <div class="area-card ${area.isPrimary ? 'featured-card' : ''}" data-area-id="${area.id}">
              <div>
                <div class="area-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 3v18M3 7l4 8h10l4-8M7 15a4 4 0 0 1-8 0M21 15a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h3 class="area-card-title">${area.title}</h3>
                <p class="area-card-desc">${area.description}</p>
              </div>
              <div>
                <span class="area-card-link">
                  ${area.actionText} →
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 7. SOLUÇÕES DE EXCELÊNCIA (14 BOXES EM AZUL-MARINHO) -->
    <section class="section-solucoes" id="solucoes">
      <div class="container">
        <div class="solucoes-header">
          <span class="eyebrow eyebrow-dark">INTELIGÊNCIA JURÍDICA, ESTRATÉGIA E INOVAÇÃO</span>
          <h2 class="section-title light">SOLUÇÕES DE EXCELÊNCIA</h2>
          <div class="gold-divider center"></div>
          <p class="section-desc light" style="margin: 0 auto;">
            A ALDO LEÃO ADVOCACIA ESTRATÉGICA desenvolve soluções inovadoras que integram conhecimento técnico, inteligência estratégica e gestão preventiva para sua empresa e família.
          </p>
        </div>

        <div class="solucoes-grid">
          ${appData.SOLUCOES_EXCELENCIA.map(sol => `
            <div class="solucao-box">
              <div>
                <div class="solucao-box-header">
                  <div class="solucao-box-icon">⚖️</div>
                  <h3 class="solucao-box-title">${sol.title}</h3>
                </div>
                <p class="solucao-box-desc">${sol.desc}</p>
              </div>
              <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; font-weight: 700; color: var(--color-gold); text-transform: uppercase;">${sol.highlight}</span>
                <button class="solucao-box-btn btn-solucao-trigger" data-sol-title="${sol.title}" data-sol-direct="${sol.directToLP ? 'true' : 'false'}">
                  Quero Saber Mais →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 8. CITAÇÃO INSTITUCIONAL -->
    <section class="section-citacao">
      <div class="container">
        <div class="quote-wrap">
          <div class="quote-symbol">“</div>
          <blockquote class="quote-text">
            Patrimônios podem ser construídos em uma vida.<br>
            Legados apenas são perpetuados quando protegidos com inteligência jurídica.
          </blockquote>
          <div class="quote-author">DR. ALDO LEÃO</div>
          <div class="quote-role">Advocacia Estratégica • Tradição Jurídica Desde 1908</div>
        </div>
      </div>
    </section>

    <!-- 9. AGENDAR CONSULTA DIGITAL -->
    <section class="section-agendar" id="agendar">
      <div class="agendar-bg" style="background-image: url('/assets/images/hero_office.jpg');"></div>
      <div class="container">
        <div class="agendar-content">
          <span class="eyebrow eyebrow-dark">ATENDIMENTO VIRTUAL EM TODO O BRASIL</span>
          <h2 class="section-title">AGENDE SUA CONSULTA DIGITAL</h2>
          <div class="gold-divider center"></div>
          <p class="section-desc">
            Agende a sua Consulta Jurídica Digital com a <strong>ALDO LEÃO ADVOCACIA ESTRATÉGICA</strong> e descubra soluções jurídicas avançadas para a sua necessidade, com hora marcada e total confidencialidade.
          </p>
          <button class="btn btn-primary btn-lg" id="btnAgendarConsultaSection">
            Solicitar Horário de Consulta
          </button>
        </div>
      </div>
    </section>

    <!-- 10. PREPARAÇÃO PARA O PLANEJAMENTO 4.0 -->
    <section class="section-planejamento-inst" id="planejamento">
      <div class="container">
        <div class="planejamento-inst-grid">
          <div>
            <span class="eyebrow">HOLDING FAMILIAR & SUCESSÃO</span>
            <h2 class="section-title">PLANEJAMENTO PATRIMONIAL E EMPRESARIAL 4.0</h2>
            <div class="gold-divider"></div>
            <p class="section-desc">
              Muito além da simples constituição de uma empresa, trata-se de uma modelagem jurídica de vanguarda desenvolvida para proteger o patrimônio, otimizar tributos e assegurar a harmonia dos herdeiros sem os traumas do inventário.
            </p>
            <div class="beneficios-pills-grid">
              <div class="beneficio-pill">✔ Proteção Jurídica Patrimonial</div>
              <div class="beneficio-pill">✔ Redução da Carga Tributária</div>
              <div class="beneficio-pill">✔ Evita a Perda no Inventário</div>
              <div class="beneficio-pill">✔ Governança e Harmonia Familiar</div>
              <div class="beneficio-pill">✔ Pleno Controle dos Pais em Vida</div>
              <div class="beneficio-pill">✔ Continuidade dos Negócios</div>
            </div>
            <a href="#1208" class="btn btn-primary" onclick="event.preventDefault(); window.location.hash='#1208';">
              Acessar Apresentação Completa da Holding 4.0 →
            </a>
          </div>

          <div>
            <div style="background: var(--color-navy); padding: 40px; border-radius: 6px; border: 2px solid var(--color-gold); color: #FFF; box-shadow: var(--shadow-lg);">
              <span style="font-size: 12px; font-weight: 700; color: var(--color-gold); text-transform: uppercase; letter-spacing: 1.5px;">Comparativo Hipotético</span>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin: 10px 0 20px 0;">Economia Comprovada em Números</h3>
              <p style="font-size: 14px; color: #BDD3E8; margin-bottom: 24px; line-height: 1.6;">
                Em um patrimônio hipotético de R$ 1.500.000,00, o inventário tradicional consome aproximadamente <strong>R$ 297.000,00</strong>. Com a Holding Familiar 4.0, o custo cai para <strong>R$ 133.000,00</strong>.
              </p>
              <div style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--color-gold); padding: 18px; border-radius: 4px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 12px; color: var(--color-gold); font-weight: 800; text-transform: uppercase;">Redução de Custos</div>
                <div style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; color: #FFF;">55,21% (R$ 164.000,00)</div>
              </div>
              <a href="#1208" class="btn btn-outline-white" style="width: 100%;" onclick="event.preventDefault(); window.location.hash='#1208';">
                Ver Tabela Comparativa Detalhada
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 11. PUBLICAÇÕES (BLOG JURÍDICO & NOTÍCIAS) -->
    <section class="section-blog" id="publicacoes">
      <div class="container">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 40px auto;">
          <span class="eyebrow">CONHECIMENTO JURÍDICO ESPECIALIZADO</span>
          <h2 class="section-title">PUBLICAÇÕES</h2>
          <div class="gold-divider center"></div>
          <p class="section-desc" style="margin: 0 auto;">
            Acompanhe artigos técnicos, análises de precedentes e notícias selecionadas sobre o cenário jurídico nacional.
          </p>
        </div>

        <!-- Barra de Busca e Filtros -->
        <div class="blog-filters-bar">
          <div class="blog-search-box">
            <span class="blog-search-icon">🔍</span>
            <input type="text" id="blogSearchInput" class="blog-search-input" placeholder="Buscar publicação por palavra-chave (ex: holding, tributário)..." value="${state.blogSearchQuery}">
          </div>
          <div class="blog-select-group">
            <select id="blogCategorySelect" class="blog-select">
              <option value="all">Todas as Categorias</option>
              <option value="artigo">Artigos Jurídicos</option>
              <option value="noticia">Notícias Jurídicas</option>
            </select>
            <select id="blogAreaSelect" class="blog-select">
              <option value="all">Todas as Áreas</option>
              <option value="Planejamento 4.0">Planejamento 4.0</option>
              <option value="Direito Imobiliário">Direito Imobiliário</option>
              <option value="Direito Empresarial">Direito Empresarial</option>
              <option value="Direito Civil">Direito Civil</option>
              <option value="Relações de Consumo">Relações de Consumo</option>
            </select>
          </div>
        </div>

        <!-- Grid de Artigos -->
        <div class="blog-grid" id="blogCardsContainer">
          ${renderBlogCards()}
        </div>
      </div>
    </section>

    <!-- 12. LIVROS DIGITAIS (ACADEMIA LEÃO FERREIRA) -->
    <section class="section-livros" id="livros">
      <div class="container">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 50px auto;">
          <span class="eyebrow">PRODUÇÃO INTELECTUAL • ACADEMIA LEÃO FERREIRA</span>
          <h2 class="section-title">LIVROS DIGITAIS</h2>
          <div class="gold-divider center"></div>
          <p class="section-desc" style="margin: 0 auto;">
            Obras jurídicas autorais publicadas pelo Dr. Aldo Leão, compartilhando estratégias e boas práticas para proteção de empresas e patrimônios.
          </p>
        </div>

        <div class="livros-grid">
          ${appData.LIVROS_DIGITAIS.map(livro => `
            <div class="livro-card">
              <div class="livro-cover-art">
                <div class="livro-cover-foil">
                  <div class="livro-header-brand">Academia Leão Ferreira</div>
                  <div class="livro-cover-title">${livro.title}</div>
                  <div class="livro-cover-author">${livro.author}</div>
                </div>
              </div>
              <div class="livro-card-content">
                <div>
                  <div class="livro-category-tag">${livro.category}</div>
                  <p class="livro-desc">${livro.desc}</p>
                </div>
                <button class="btn btn-primary btn-sm btn-livro-download" data-livro-title="${livro.title}">
                  BAIXE AQUI 📥
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 13. RODAPÉ INSTITUCIONAL (6 COLUNAS) -->
    <footer class="site-footer-inst" id="contato">
      <div class="container">
        <div class="footer-inst-grid">
          <!-- Coluna 1: Marca & Legado -->
          <div>
            <div class="brand-logo" style="margin-bottom: 16px;">
              <div class="logo-lion-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div class="brand-text">
                <span class="brand-title" style="color: #FFF; font-size: 1.05rem;">ALDO LEÃO</span>
                <span class="brand-subtitle" style="font-size: 10px;">ADVOCACIA ESTRATÉGICA</span>
              </div>
            </div>
            <p class="footer-col-desc">
              Desde 1908, a tradição jurídica da família do Dr. Aldo Leão atravessa três gerações, unindo experiência, inovação e excelência na proteção patrimonial e empresarial.
            </p>
            <div class="footer-social-links">
              <a href="#" class="footer-social-btn" title="Instagram">📸</a>
              <a href="#" class="footer-social-btn" title="LinkedIn">💼</a>
              <a href="#" class="footer-social-btn" title="Facebook">📘</a>
              <a href="${createWhatsAppUrl('Olá, gostaria de falar com a Aldo Leão Advocacia Estratégica.')}" target="_blank" class="footer-social-btn" title="WhatsApp">💬</a>
            </div>
          </div>

          <!-- Coluna 2: Institucional -->
          <div>
            <h4 class="footer-col-title">Institucional</h4>
            <ul class="footer-link-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#presenca">Presença Nacional</a></li>
              <li><a href="#experiencia">Experiência</a></li>
              <li><a href="#legado">O Legado Centenário</a></li>
              <li><a href="#head">Head Jurídico</a></li>
              <li><a href="#areas">Áreas de Atuação</a></li>
              <li><a href="#solucoes">Soluções de Excelência</a></li>
            </ul>
          </div>

          <!-- Coluna 3: Soluções Jurídicas -->
          <div>
            <h4 class="footer-col-title">Soluções</h4>
            <ul class="footer-link-list">
              <li><a href="#areas">Holding Familiar 4.0</a></li>
              <li><a href="#areas">Direito Imobiliário</a></li>
              <li><a href="#areas">Direito Empresarial</a></li>
              <li><a href="#areas">Direito Civil</a></li>
              <li><a href="#areas">Relações de Consumo</a></li>
              <li><a href="#solucoes">Auditoria & Arbitragem</a></li>
            </ul>
            <div class="footer-highlight-box">
              <div class="footer-highlight-title">DESTAQUE EXCLUSIVO</div>
              <a href="#1208" class="btn btn-primary btn-sm" style="width: 100%; font-size: 11px;" onclick="event.preventDefault(); window.location.hash='#1208';">
                Diagnóstico Holding 4.0
              </a>
            </div>
          </div>

          <!-- Coluna 4: Publicações -->
          <div>
            <h4 class="footer-col-title">Publicações</h4>
            <ul class="footer-link-list">
              <li><a href="#publicacoes">Artigos Jurídicos</a></li>
              <li><a href="#publicacoes">Notícias Jurídicas</a></li>
              <li><a href="#livros">Livros Digitais</a></li>
              <li><a href="#livros">Academia Leão Ferreira</a></li>
            </ul>
          </div>

          <!-- Coluna 5: Canais de Atendimento -->
          <div>
            <h4 class="footer-col-title">Atendimento</h4>
            <div class="footer-contact-item">
              <span>📞</span>
              <div>
                <a href="tel:51998088998">(51) 998.088.998</a><br>
                <a href="tel:51998078998">(51) 998.078.998</a>
              </div>
            </div>
            <div class="footer-contact-item">
              <span>✉️</span>
              <div>
                <a href="mailto:aldoleao.adv@gmail.com">aldoleao.adv@gmail.com</a>
              </div>
            </div>
            <div class="footer-contact-item">
              <span>📍</span>
              <div>
                ${appData.SITE_INFO.address.street}<br>
                ${appData.SITE_INFO.address.neighborhood} - ${appData.SITE_INFO.address.city}/${appData.SITE_INFO.address.state}
              </div>
            </div>
            <div class="footer-contact-item">
              <span>⏰</span>
              <div>${appData.SITE_INFO.workingHours}</div>
            </div>
          </div>

          <!-- Coluna 6: Formulário Get Every Updates Adaptado -->
          <div>
            <h4 class="footer-col-title">Fale Conosco</h4>
            <form class="footer-form-card" id="footerContactForm">
              <div class="footer-input-group">
                <label>Nome Completo</label>
                <input type="text" id="footerNome" class="footer-form-control" required placeholder="Seu nome">
              </div>
              <div class="footer-input-group">
                <label>WhatsApp</label>
                <input type="tel" id="footerWhats" class="footer-form-control" required placeholder="(51) 99999-9999">
              </div>
              <div class="footer-input-group">
                <label>Assunto</label>
                <select id="footerAssunto" class="footer-form-control" required>
                  <option value="Planejamento Patrimonial 4.0">Planejamento Patrimonial 4.0</option>
                  <option value="Direito Imobiliário">Direito Imobiliário</option>
                  <option value="Direito Empresarial">Direito Empresarial</option>
                  <option value="Consulta Digital Geral">Consulta Digital Geral</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary btn-sm" style="width: 100%; margin-top: 8px;">
                Enviar Mensagem via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Barra de Copyright -->
      <div class="footer-bottom-bar">
        <div class="container footer-bottom-flex">
          <div>
            © 1908 - 2026 ALDO LEÃO ADVOCACIA ESTRATÉGICA - Todos os direitos reservados.
          </div>
          <div class="footer-bottom-links">
            <a href="#termos" id="linkTermos">Termos de Uso</a>
            <a href="#privacidade" id="linkPrivacidade">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function renderBlogCards() {
  const query = state.blogSearchQuery.toLowerCase().trim();
  const categoryFilter = state.blogCategoryFilter;
  const areaFilter = state.blogAreaFilter;

  const filtered = appData.ARTIGOS_NOTICIAS.filter(item => {
    const matchesQuery = !query || 
      item.title.toLowerCase().includes(query) || 
      item.excerpt.toLowerCase().includes(query) || 
      item.area.toLowerCase().includes(query);
    
    const matchesCategory = categoryFilter === 'all' || item.type === categoryFilter;
    const matchesArea = areaFilter === 'all' || item.area === areaFilter;

    return matchesQuery && matchesCategory && matchesArea;
  });

  if (filtered.length === 0) {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px; background: #FFF; border-radius: 4px;">
        <p style="font-size: 16px; color: var(--color-navy); font-weight: 600;">Nenhuma publicação encontrada para os critérios selecionados.</p>
        <button class="btn btn-outline-gold btn-sm" style="margin-top: 14px;" id="btnResetBlogFilters">Limpar Filtros</button>
      </div>
    `;
  }

  return filtered.slice(0, state.blogVisibleCount).map(item => `
    <article class="blog-card">
      <div class="blog-thumb-wrap">
        <img src="/assets/images/${item.type === 'artigo' ? 'hero_office.jpg' : 'timeline_library.jpg'}" alt="${item.title}">
        <span class="blog-badge-top ${item.type}">${item.categoryName}</span>
        <span class="blog-badge-area">${item.area}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-meta-date">📅 ${item.date} • Dr. Aldo Leão</div>
        <h3 class="blog-card-title">${item.title}</h3>
        <p class="blog-card-excerpt">${item.excerpt}</p>
        <button class="blog-read-more-btn btn-read-article" data-article-id="${item.id}">
          LER MAIS →
        </button>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   RENDERIZAÇÃO: LANDING PAGE OCULTA (/1208/)
   ========================================================================== */
function renderLandingPage() {
  return `
    <div class="lp-wrapper">
      <!-- Cabeçalho Exclusivo da Landing Page -->
      <header class="lp-header">
        <div class="container lp-header-flex">
          <div class="lp-header-brand-group">
            <div class="logo-lion-icon" style="background: rgba(255,255,255,0.1);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <div class="lp-brand-texts">
              <span class="lp-brand-name">ALDO LEÃO</span>
              <span class="lp-brand-tag">ADVOCACIA ESTRATÉGICA</span>
              <span class="lp-brand-since">Legado Jurídico Familiar desde 1908</span>
            </div>
            <div class="lp-seal-40">
              <span class="lp-seal-num">${state.experienceYears}</span>
              <span class="lp-seal-text">ANOS</span>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: center;">
            <button class="btn btn-outline-white btn-sm" id="btnLPVoltarSite">
              ← Voltar ao Site Institucional
            </button>
            <a href="${createWhatsAppUrl('Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.')}" target="_blank" class="btn btn-primary btn-sm">
              Agendar Diagnóstico
            </a>
          </div>
        </div>
      </header>

      <!-- SEÇÃO 1: HERO SECTION (FULL SCREEN, IMAGEM + AZUL-MARINHO 80%) -->
      <section class="lp-hero-section">
        <div class="lp-hero-bg" style="background-image: url('/assets/images/holding_family.jpg');"></div>
        <div class="lp-hero-overlay"></div>
        <div class="container">
          <div class="lp-hero-content">
            <span class="eyebrow eyebrow-dark">PLANEJAMENTO PATRIMONIAL 4.0 VIA HOLDING FAMILIAR</span>
            <h1 class="lp-hero-title">PROTEJA O SEU PATRIMÔNIO E EVITE OS ALTOS CUSTOS DO INVENTÁRIO</h1>
            <p class="lp-hero-desc">
              Estruture hoje a proteção jurídica do seu patrimônio e assegure sua transferência organizada para as futuras gerações por meio do Planejamento Patrimonial 4.0 via Holding Familiar, evitando a alta perda patrimonial e financeira dos herdeiros no inventário.
            </p>
            <a href="${createWhatsAppUrl('Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.')}" target="_blank" class="btn btn-primary btn-lg">
              AGENDAR DIAGNÓSTICO DE VIABILIDADE
            </a>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 2: O PROBLEMA (FUNDO BRANCO) -->
      <section class="lp-section-problema">
        <div class="container">
          <span class="eyebrow">A REALIDADE DO INVENTÁRIO TRADICIONAL</span>
          <h2 class="section-title">O INVENTÁRIO ACARRETA ELEVADAS PERDAS PATRIMONIAIS E FINANCEIRAS AOS HERDEIROS</h2>
          <div class="gold-divider"></div>
          <p class="section-desc">
            Muitas famílias somente descobrem a elevada perda patrimonial e o alto custo do processo de inventário quando já é tarde. Além dos tributos, honorários, despesas cartorárias e registros imobiliários, a necessidade de liquidez imediata leva os herdeiros à venda acelerada de bens, com <strong>deságio médio de 20%</strong> em relação ao respectivo valor de mercado.
          </p>

          <div class="lp-problema-boxes">
            <div class="lp-problema-box">
              <span class="lp-box-icon">⚖️</span>
              <span class="lp-problema-text">Inventário Judicial demorado e desgastante</span>
            </div>
            <div class="lp-problema-box">
              <span class="lp-box-icon">⚖️</span>
              <span class="lp-problema-text">Elevados custos tributários e cartorários para os herdeiros</span>
            </div>
            <div class="lp-problema-box">
              <span class="lp-box-icon">⚖️</span>
              <span class="lp-problema-text">Alta perda patrimonial e financeira global dos herdeiros</span>
            </div>
            <div class="lp-problema-box">
              <span class="lp-box-icon">⚖️</span>
              <span class="lp-problema-text">Venda forçada de imóveis com deságio médio de 20%</span>
            </div>
            <div class="lp-problema-box">
              <span class="lp-box-icon">⚖️</span>
              <span class="lp-problema-text">Conflitos familiares severos e disputas patrimoniais</span>
            </div>
            <div class="lp-problema-box">
              <span class="lp-box-icon">⚖️</span>
              <span class="lp-problema-text">Possível aumento da alíquota do ITCMD de 8% para até 30%</span>
            </div>
            <div class="lp-problema-box">
              <span class="lp-box-icon">⚖️</span>
              <span class="lp-problema-text">Insegurança e indisponibilidade dos bens até a partilha final</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 3: A SOLUÇÃO (FUNDO AZUL-MARINHO) -->
      <section class="lp-section-solucao">
        <div class="container">
          <span class="eyebrow eyebrow-dark">VANGUARDA E SEGURANÇA JURÍDICA</span>
          <h2 class="section-title light">O PLANEJAMENTO PATRIMONIAL 4.0 PERPETUA O SEU LEGADO</h2>
          <div class="gold-divider"></div>
          <p class="section-desc light">
            O Planejamento Patrimonial 4.0 por meio da Holding Familiar consiste em uma estrutura societária moderna e 100% legal, permitindo centralizar a gestão de bens, reduzir drasticamente a carga tributária e planejar a sucessão com harmonia em vida.
          </p>

          <div class="lp-solucao-boxes">
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Proteção Jurídica Patrimonial e Empresarial</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Planejamento Sucessório Corporativo Seguro</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Expressiva Economia Tributária nas Operações Imobiliárias</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Evita o Inventário e a Perda Financeira dos Herdeiros</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Governança Familiar e Profissionalização da Gestão</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Facilitação de Internacionalização e Mudança de País</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Pleno Controle dos Pais com Cláusulas Protetivas (Usufruto)</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Incomunicabilidade, Impenhorabilidade e Inalienabilidade</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Golden Share e Direitos Decisórios Blindados</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Acordo de Sócios e Regras Claras de Sucessão</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Harmonia e Paz Familiar Permanente</span></div>
            <div class="lp-solucao-box"><span style="color: var(--color-gold); font-size: 18px;">✔</span><span class="lp-solucao-text">Captação de Recursos sem Depender Exclusivamente de Bancos</span></div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 4: INVENTÁRIO × HOLDING (FUNDO BRANCO - O PONTO DE MAIOR IMPACTO VISUAL!) -->
      <section class="lp-section-comparativo" id="comparativo">
        <div class="container">
          <div class="comparativo-wrapper">
            <div style="text-align: center; margin-bottom: 30px;">
              <span class="eyebrow">DEMONSTRAÇÃO FINANCEIRA RACIONAL</span>
              <h2 class="section-title">INVENTÁRIO × PLANEJAMENTO PATRIMONIAL 4.0</h2>
              <div class="gold-divider center"></div>
              <p class="section-desc" style="margin: 0 auto;">
                Veja na prática a diferença matemática entre suportar o processo de inventário tradicional versus constituir preventivamente uma Holding Familiar 4.0.
              </p>
            </div>

            <div class="scenario-badge">
              <strong>Cenário Comparativo Aprovado:</strong> Patrimônio formado por um imóvel adquirido por R$ 1.000.000,00 com valor de mercado atual de R$ 1.500.000,00 (Ganho de capital imobiliário de R$ 500.000,00).
            </div>

            <!-- Tabela Comparativa de Alta Conversão -->
            <div class="compare-table-card">
              <table class="compare-table">
                <thead>
                  <tr>
                    <th>DESPESAS E TRIBUTOS</th>
                    <th style="color: #FFB3B3;">PROCESSO DE INVENTÁRIO</th>
                    <th style="color: var(--color-gold);">HOLDING FAMILIAR 4.0</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="td-label">ITCMD / ITCM</td>
                    <td class="td-inventario">R$ 75.000,00 (5%)</td>
                    <td class="td-holding">R$ 60.000,00 (4%)</td>
                  </tr>
                  <tr>
                    <td class="td-label">Honorários Advocatícios</td>
                    <td class="td-inventario">R$ 120.000,00 (8%)</td>
                    <td class="td-holding">R$ 70.000,00</td>
                  </tr>
                  <tr>
                    <td class="td-label">Custas de Cartório</td>
                    <td class="td-inventario">R$ 12.000,00</td>
                    <td class="td-holding">R$ 0,00</td>
                  </tr>
                  <tr>
                    <td class="td-label">Certidões Forenses</td>
                    <td class="td-inventario">R$ 3.000,00</td>
                    <td class="td-holding">R$ 0,00</td>
                  </tr>
                  <tr>
                    <td class="td-label">Imposto de Renda (Ganho de Capital)</td>
                    <td class="td-inventario">R$ 75.000,00</td>
                    <td class="td-holding">R$ 0,00 (Isento no modelo)</td>
                  </tr>
                  <tr>
                    <td class="td-label">Registro de Imóveis</td>
                    <td class="td-inventario">R$ 12.000,00</td>
                    <td class="td-holding">R$ 3.000,00</td>
                  </tr>
                  <tr class="total-row">
                    <td class="td-total-label">CUSTO TOTAL</td>
                    <td class="td-total-inventario">R$ 297.000,00</td>
                    <td class="td-total-holding">R$ 133.000,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Bloco de Destaque Brutal com a Economia -->
            <div class="economy-banner-card">
              <div class="economy-banner-tag">Economia Real Conquistada para a Família</div>
              <div class="economy-banner-value">R$ 164.000,00</div>
              <div class="economy-banner-percent">REDUÇÃO DE CUSTOS: 55,21%</div>
              <p style="color: #BDD3E8; max-width: 650px; margin: 0 auto 30px auto; font-size: 14.5px;">
                Recursos que permanecem integralmente sob o controle do seu patrimônio familiar, eliminando burocracias e evitando disputas judiciais desgastantes.
              </p>
              <a href="${createWhatsAppUrl('Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.')}" target="_blank" class="btn btn-primary btn-lg">
                QUERO ESSA ECONOMIA NO MEU PATRIMÔNIO
              </a>
            </div>

            <!-- Simulador Interativo Dinâmico (Valor Agregado de Conversão) -->
            <div class="savings-simulator-box">
              <div class="sim-slider-label">Simule o valor estimado do patrimônio da sua família:</div>
              <input type="range" min="1000000" max="15000000" step="500000" value="1500000" class="sim-slider" id="patrimonioRange">
              <div style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--color-navy); font-weight: 800;" id="patrimonioLabel">
                R$ 1.500.000,00
              </div>

              <div class="sim-dynamic-result">
                <div class="sim-stat-item">
                  Custo Estimado Inventário:
                  <span class="sim-stat-val" style="color: #C0392B;" id="simCustoInventario">R$ 297.000,00</span>
                </div>
                <div class="sim-stat-item">
                  Custo com Holding 4.0:
                  <span class="sim-stat-val" style="color: #27AE60;" id="simCustoHolding">R$ 133.000,00</span>
                </div>
                <div class="sim-stat-item">
                  Economia Estimada:
                  <span class="sim-stat-val" style="color: var(--color-gold);" id="simEconomiaVal">R$ 164.000,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 5: PARA QUEM É (FUNDO CINZA CLARO #F7F7F7) -->
      <section class="lp-section-para-quem">
        <div class="container">
          <span class="eyebrow">PÚBLICO-ALVO QUALIFICADO</span>
          <h2 class="section-title">PARA QUEM É O PLANEJAMENTO PATRIMONIAL 4.0?</h2>
          <div class="gold-divider"></div>
          <p class="section-desc">
            O Planejamento Patrimonial 4.0 através da Holding Familiar foi desenvolvido para quem já possui ou pretende adquirir patrimônio e deseja transferir seu legado com segurança jurídica, economia e rapidez.
          </p>

          <div class="lp-destinatarios-grid">
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Empresários e Empreendedores</span></div>
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Proprietários de Imóveis & Terrenos</span></div>
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Pais com Herdeiros (Filhos)</span></div>
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Famílias Empresárias Multigeracionais</span></div>
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Investidores Imobiliários</span></div>
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Produtores Rurais (Agronegócio)</span></div>
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Profissionais Liberais e Executivos</span></div>
            <div class="lp-destinatario-card"><span style="color: var(--color-gold); font-size: 18px;">⚖️</span><span class="lp-destinatario-title">Atividades Profissionais com Risco de Passivos</span></div>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${createWhatsAppUrl('Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.')}" target="_blank" class="btn btn-primary">
              AGENDAR DIAGNÓSTICO DE VIABILIDADE
            </a>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 6: A IMPORTÂNCIA DO PLANEJAMENTO (FUNDO AZUL-MARINHO) -->
      <section class="lp-section-importancia">
        <div class="container">
          <span class="eyebrow eyebrow-dark">ESTATÍSTICAS REAIS & LONGEVIDADE</span>
          <h2 class="section-title light">A IMPORTÂNCIA DO PLANEJAMENTO SUCESSÓRIO EMPRESARIAL 4.0</h2>
          <div class="gold-divider"></div>
          <p class="section-desc light">
            Grande parte das empresas familiares desaparece entre as gerações por falta de planejamento prévio. Os números oficiais comprovam a urgência da estruturação societária:
          </p>

          <div class="ibge-stats-grid">
            <div class="ibge-stat-card">
              <div class="ibge-stat-num">90%</div>
              <div class="ibge-stat-desc">Das empresas nacionais possuem perfil familiar e respondem por 60% do PIB brasileiro (IBGE).</div>
            </div>
            <div class="ibge-stat-card">
              <div class="ibge-stat-num">30%</div>
              <div class="ibge-stat-desc">Apenas cerca de 30% das empresas brasileiras conseguem alcançar a 2ª geração de herdeiros.</div>
            </div>
            <div class="ibge-stat-card">
              <div class="ibge-stat-num">5%</div>
              <div class="ibge-stat-desc">Apenas 5% chegam à 3ª geração, exatamente como a <strong>ALDO LEÃO ADVOCACIA ESTRATÉGICA</strong> fez em 1986.</div>
            </div>
          </div>

          <div class="importancia-pillars-grid">
            <div class="importancia-pillar-box">✔ Continuidade Empresarial e Patrimonial</div>
            <div class="importancia-pillar-box">✔ Governança Familiar Sem Litígios</div>
            <div class="importancia-pillar-box">✔ Organização e Centralização de Ativos</div>
            <div class="importancia-pillar-box">✔ Proteção Jurídica Patrimonial</div>
            <div class="importancia-pillar-box">✔ Segurança Jurídica com Antecipação</div>
            <div class="importancia-pillar-box">✔ Transição Pacífica do Poder Gerencial</div>
            <div class="importancia-pillar-box">✔ Perpetuação Real do Legado</div>
            <div class="importancia-pillar-box">✔ Eliminação Total do Inventário</div>
          </div>

          <div style="text-align: center;">
            <a href="${createWhatsAppUrl('Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.')}" target="_blank" class="btn btn-primary btn-lg">
              AGENDAR DIAGNÓSTICO DE VIABILIDADE
            </a>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 7: TRÊS GERAÇÕES DE EXCELÊNCIA JURÍDICA (FUNDO BRANCO) -->
      <section class="lp-section-geracoes">
        <div class="container">
          <div class="geracoes-grid">
            <div class="head-photo-card">
              <img src="/assets/images/dr_aldo_leao.jpg" alt="Dr. Aldo Leão Ferreira Filho">
              <div class="head-photo-caption">
                <div class="head-name-highlight">DR. ALDO LEÃO</div>
                <div class="head-role-sub">3ª Geração • Tradição Jurídica Centenária</div>
              </div>
            </div>

            <div>
              <span class="eyebrow">AUTORIDADE & CREDIBILIDADE</span>
              <h2 class="section-title">TRÊS GERAÇÕES DE EXCELÊNCIA JURÍDICA</h2>
              <div class="gold-divider"></div>
              <p class="section-desc" style="margin-bottom: 24px;">
                Desde 1908, a tradição jurídica da família do Dr. Aldo dedica-se à construção de soluções avançadas pautadas pela ética, rigor técnico e perpetuação de legados familiares.
              </p>

              <div class="geracao-step-item">
                <div class="geracao-step-year">1ª Geração (1908) • Prof. Dr. Arnaldo da Silva Ferreira</div>
                <div class="geracao-step-desc">Fundador do escritório mais antigo do Brasil, precursor da advocacia empresarial no RS e Presidente de Honra do IARGS.</div>
              </div>

              <div class="geracao-step-item">
                <div class="geracao-step-year">2ª Geração (1935 / 1951) • Dr. Mario, Dr. Ney e Dr. Aldo Leão Ferreira</div>
                <div class="geracao-step-desc">Procuradoria da Fazenda Nacional, Direção Jurídica da VARIG/RJ e Procuradoria do Estado do RS.</div>
              </div>

              <div class="geracao-step-item">
                <div class="geracao-step-year">3ª Geração (1986) • Dr. Aldo Leão Ferreira Filho</div>
                <div class="geracao-step-desc">Mais de quatro décadas de liderança em Advocacia Estratégica, Gestão Patrimonial e Planejamento 4.0 via Holding Familiar.</div>
              </div>

              <a href="${createWhatsAppUrl('Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.')}" target="_blank" class="btn btn-primary" style="margin-top: 10px;">
                AGENDAR DIAGNÓSTICO DE VIABILIDADE
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 8: CHAMADA FINAL (SEGUNDO HERO - IMAGEM + AZUL-MARINHO) -->
      <section class="lp-section-chamada-final">
        <div class="chamada-final-bg" style="background-image: url('/assets/images/holding_family.jpg');"></div>
        <div class="container">
          <div class="chamada-final-content">
            <span class="eyebrow eyebrow-dark">DECISÃO ESTRATÉGICA EM VIDA</span>
            <h2 class="section-title">O MELHOR MOMENTO PARA PROTEGER O SEU PATRIMÔNIO É AGORA</h2>
            <div class="gold-divider center"></div>
            <p class="section-desc">
              Não espere que a inércia deixe para seus filhos a dor de um inventário caro, deságios forçados e disputas desnecessárias. Descubra porque a Holding Familiar 4.0 é a única alternativa inteligente e legal para proteger e perpetuar sua história.
            </p>
            <a href="${createWhatsAppUrl('Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.')}" target="_blank" class="btn btn-primary btn-lg">
              AGENDAR DIAGNÓSTICO DE VIABILIDADE
            </a>
          </div>
        </div>
      </section>

      <!-- SEÇÃO 9: PERGUNTAS FREQUENTES (FAQ ACCORDION - FUNDO BRANCO) -->
      <section class="lp-section-faq" id="faq">
        <div class="container">
          <div style="text-align: center; max-width: 800px; margin: 0 auto;">
            <span class="eyebrow">ESCLARECIMENTOS ESSENCIAIS</span>
            <h2 class="section-title">PERGUNTAS FREQUENTES (FAQ)</h2>
            <div class="gold-divider center"></div>
            <p class="section-desc" style="margin: 0 auto;">
              Tire todas as suas dúvidas sobre a estrutura e os benefícios da Holding Familiar 4.0.
            </p>
          </div>

          <div class="faq-accordion-wrap">
            ${appData.FAQ_LANDING_PAGE.map((item, index) => `
              <div class="faq-item ${index === 0 ? 'active' : ''}">
                <button class="faq-question-btn">
                  <span>${item.question}</span>
                  <span class="faq-icon-toggle">+</span>
                </button>
                <div class="faq-answer-pane">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- RODAPÉ SIMPLIFICADO DA LANDING PAGE -->
      <footer class="lp-footer-simple">
        <div class="container lp-footer-content">
          <div>
            1908–2026 ALDO LEÃO ADVOCACIA ESTRATÉGICA • Todos os direitos reservados.
          </div>
          <div class="lp-footer-links">
            <a href="#termos" id="lpLinkTermos">Termos de Uso</a>
            <a href="#privacidade" id="lpLinkPrivacidade">Política de Privacidade</a>
            <a href="#institucional" id="lpLinkVoltarFooter">Voltar ao Site Institucional</a>
          </div>
        </div>
      </footer>
    </div>
  `;
}

/* ==========================================================================
   BOTÃO FLUTUANTE DO WHATSAPP
   ========================================================================== */
function renderFloatingWhatsApp() {
  let existing = document.getElementById('floatingWhatsAppBtn');
  if (existing) existing.remove();

  const msg = state.currentRoute === 'lp' 
    ? 'Solicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento do meu DIAGNÓSTICO DE VIABILIDADE para conhecer o Planejamento Patrimonial 4.0.'
    : 'Olá, gostaria de agendar uma consulta digital com a Aldo Leão Advocacia Estratégica.';

  const btn = document.createElement('a');
  btn.id = 'floatingWhatsAppBtn';
  btn.className = 'whatsapp-floating-btn';
  btn.href = createWhatsAppUrl(msg);
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Falar pelo WhatsApp');
  btn.innerHTML = `
    <span class="whatsapp-tooltip">Falar com o Dr. Aldo Leão</span>
    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"></path>
    </svg>
  `;
  document.body.appendChild(btn);
}

/* ==========================================================================
   EVENTOS E INTERAÇÕES DO SITE INSTITUCIONAL
   ========================================================================== */
function attachInstitucionalEvents() {
  // Menu Mobile
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // Hero Slider
  setupHeroSlider();

  // Contador de Anos de Experiência (Com IntersectionObserver)
  setupExperienceCounter();

  // Botões de Consulta no Header e Seções
  const btnHeader = document.getElementById('btnHeaderConsulta');
  const btnSlide1 = document.getElementById('btnSlide1WhatsApp');
  const btnHeadAgendar = document.getElementById('btnHeadAgendar');
  const btnAgendarSec = document.getElementById('btnAgendarConsultaSection');

  const openConsultaModal = () => {
    openModal('Agendar Consulta Jurídica Digital', `
      <form id="modalConsultaForm">
        <div class="modal-form-group">
          <label>Nome Completo</label>
          <input type="text" id="modalNome" class="modal-form-control" required placeholder="Digite seu nome completo">
        </div>
        <div class="modal-form-group">
          <label>WhatsApp</label>
          <input type="tel" id="modalWhats" class="modal-form-control" required placeholder="(51) 99808-8998">
        </div>
        <div class="modal-form-group">
          <label>E-mail</label>
          <input type="email" id="modalEmail" class="modal-form-control" required placeholder="seu@email.com">
        </div>
        <div class="modal-form-group">
          <label>Assunto</label>
          <select id="modalAssunto" class="modal-form-control" required>
            <option value="Planejamento Patrimonial 4.0">Planejamento Patrimonial 4.0 (Holding Familiar)</option>
            <option value="Direito Imobiliário">Direito Imobiliário e Gestão de Ativos</option>
            <option value="Direito Empresarial">Direito Empresarial e Societário</option>
            <option value="Direito Civil">Direito Civil e Sucessões</option>
            <option value="Relações de Consumo">Relações de Consumo</option>
            <option value="Outro Assunto Estratégico">Outro Assunto Estratégico</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
          Confirmar e Abrir no WhatsApp
        </button>
      </form>
    `);

    const form = document.getElementById('modalConsultaForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('modalNome')?.value || '';
        const whats = document.getElementById('modalWhats')?.value || '';
        const email = document.getElementById('modalEmail')?.value || '';
        const assunto = document.getElementById('modalAssunto')?.value || '';

        const msg = `*SOLICITAÇÃO DE CONSULTA DIGITAL*\n\n*Nome Completo:* ${nome}\n*WhatsApp:* ${whats}\n*E-mail:* ${email}\n*Assunto:* ${assunto}\n\nSolicito ao escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA o agendamento de uma consulta virtual.`;
        window.open(createWhatsAppUrl(msg), '_blank');
        closeModal();
      });
    }
  };

  if (btnHeader) btnHeader.addEventListener('click', openConsultaModal);
  if (btnSlide1) btnSlide1.addEventListener('click', openConsultaModal);
  if (btnHeadAgendar) btnHeadAgendar.addEventListener('click', openConsultaModal);
  if (btnAgendarSec) btnAgendarSec.addEventListener('click', openConsultaModal);

  // Modal Currículo Completo do Dr. Aldo Leão
  const btnCurriculo = document.getElementById('btnCurriculoModal');
  const btnHistoria = document.getElementById('btnVerHistoriaCompleta');

  const openCurriculoModal = () => {
    openModal('Dr. Aldo Leão Ferreira Filho • Perfil Executivo', `
      <div style="font-size: 14.5px; line-height: 1.7; color: var(--color-text-main);">
        <p style="margin-bottom: 14px;">
          Desde 1986, o <strong>Dr. Aldo Leão Ferreira Filho</strong> conduz a terceira geração do legado jurídico familiar iniciado em 1908 pelo Prof. Dr. Arnaldo da Silva Ferreira.
        </p>
        <p style="margin-bottom: 14px;">
          Graduado em Direito pela tradicional Pontifícia Universidade Católica do Rio Grande do Sul (PUC-RS), possui sólida atuação multidisciplinar e quatro décadas de vivência como Advogado Estratégico, Gestor Jurídico Corporativo e Patrimonial.
        </p>
        <h4 style="font-family: var(--font-heading); color: var(--color-navy); font-size: 1.1rem; margin: 20px 0 10px 0;">Trajetória Institucional e Pública:</h4>
        <ul style="padding-left: 20px; margin-bottom: 20px;">
          <li>Procurador Municipal de 20 Municípios no Rio Grande do Sul;</li>
          <li>Procurador do Banco do Brasil S/A;</li>
          <li>Conselheiro e Membro ativo do Instituto dos Advogados do RS (IARGS);</li>
          <li>Atuação perante comissões especializadas da Ordem dos Advogados do Brasil (OAB/RS);</li>
          <li>Professor Universitário na Unisinos e orientador de monografias jurídicas.</li>
        </ul>
        <h4 style="font-family: var(--font-heading); color: var(--color-navy); font-size: 1.1rem; margin: 20px 0 10px 0;">Literatura Jurídica:</h4>
        <p style="margin-bottom: 20px;">
          Autor de extensa produção doutrinária com mais de uma centena de artigos publicados em periódicos especializados e autor de 6 livros digitais de referência em planejamento sucessório e proteção de ativos.
        </p>
        <button class="btn btn-primary" id="btnCurriculoAgendar" style="width: 100%;">
          Falar Diretamente com Dr. Aldo Leão
        </button>
      </div>
    `, true);

    const btnCurrAgendar = document.getElementById('btnCurriculoAgendar');
    if (btnCurrAgendar) {
      btnCurrAgendar.addEventListener('click', () => {
        closeModal();
        openConsultaModal();
      });
    }
  };

  if (btnCurriculo) btnCurriculo.addEventListener('click', openCurriculoModal);
  if (btnHistoria) btnHistoria.addEventListener('click', openCurriculoModal);

  // Cards de Áreas de Atuação
  document.querySelectorAll('.area-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-area-id');
      if (id === 'holding') {
        window.location.hash = '#1208';
      } else {
        const area = appData.AREAS_ATUACAO.find(a => a.id === id);
        if (area) {
          openModal(area.title, `
            <div style="font-size: 15px; line-height: 1.7; color: var(--color-text-main);">
              <h4 style="font-family: var(--font-heading); color: var(--color-navy); font-size: 1.15rem; margin-bottom: 12px;">${area.subtitle}</h4>
              <p style="margin-bottom: 20px;">${area.description}</p>
              <div style="background: var(--color-navy-soft); padding: 16px; border-radius: 4px; margin-bottom: 24px; border-left: 3px solid var(--color-navy);">
                <strong>Atendimento Digital Especializado:</strong> O escritório conta com núcleos setoriais para análise documental, due diligence preventiva e estruturação estratégica.
              </div>
              <button class="btn btn-primary" style="width: 100%;" id="btnModalAreaWhats">
                Consultar Nossos Advogados no WhatsApp
              </button>
            </div>
          `);

          const btnAreaWhats = document.getElementById('btnModalAreaWhats');
          if (btnAreaWhats) {
            btnAreaWhats.addEventListener('click', () => {
              const msg = `Olá Dr. Aldo Leão, gostaria de agendar uma consulta referente à área de *${area.title}*.`;
              window.open(createWhatsAppUrl(msg), '_blank');
              closeModal();
            });
          }
        }
      }
    });
  });

  // Soluções de Excelência
  document.querySelectorAll('.btn-solucao-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-sol-title');
      const direct = btn.getAttribute('data-sol-direct') === 'true';

      if (direct) {
        window.location.hash = '#1208';
        return;
      }

      openModal(`Solução: ${title}`, `
        <form id="solucaoFormModal">
          <p style="font-size: 14px; color: var(--color-text-main); margin-bottom: 16px;">
            Preencha os campos abaixo para receber o atendimento especializado sobre <strong>${title}</strong>:
          </p>
          <div class="modal-form-group">
            <label>Nome Completo</label>
            <input type="text" id="solNome" class="modal-form-control" required placeholder="Seu nome">
          </div>
          <div class="modal-form-group">
            <label>WhatsApp</label>
            <input type="tel" id="solWhats" class="modal-form-control" required placeholder="(XX) XXXXXXXXX">
          </div>
          <div class="modal-form-group">
            <label>Assunto</label>
            <input type="text" id="solAssunto" class="modal-form-control" value="${title}" readonly>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            Enviar via WhatsApp
          </button>
        </form>
      `);

      const form = document.getElementById('solucaoFormModal');
      if (form) {
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          const nome = document.getElementById('solNome')?.value || '';
          const whats = document.getElementById('solWhats')?.value || '';
          const msg = `*SOLICITAÇÃO DE SOLUÇÃO ESTRATÉGICA*\n\n*Serviço:* ${title}\n*Nome Completo:* ${nome}\n*WhatsApp:* ${whats}\n\nSolicito mais detalhes e orientações do Dr. Aldo Leão sobre esta solução.`;
          window.open(createWhatsAppUrl(msg), '_blank');
          closeModal();
        });
      }
    });
  });

  // Livros Digitais (Download)
  document.querySelectorAll('.btn-livro-download').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookTitle = btn.getAttribute('data-livro-title');
      openModal(`Download da Obra: ${bookTitle}`, `
        <form id="livroDownloadForm">
          <p style="font-size: 14px; color: var(--color-text-main); margin-bottom: 16px;">
            Informe seus dados para receber o link oficial do livro digital publicado pela <strong>Academia Leão Ferreira</strong>:
          </p>
          <div class="modal-form-group">
            <label>Nome Completo</label>
            <input type="text" id="livroNome" class="modal-form-control" required placeholder="Seu nome">
          </div>
          <div class="modal-form-group">
            <label>WhatsApp</label>
            <input type="tel" id="livroWhats" class="modal-form-control" required placeholder="(XX) XXXXXXXXX">
          </div>
          <div class="modal-form-group">
            <label>E-mail</label>
            <input type="email" id="livroEmail" class="modal-form-control" required placeholder="seu@email.com">
          </div>
          <div class="modal-form-group">
            <label>Obra Solicitada</label>
            <select id="livroSelect" class="modal-form-control">
              ${appData.LIVROS_DIGITAIS.map(l => `
                <option value="${l.title}" ${l.title === bookTitle ? 'selected' : ''}>${l.title}</option>
              `).join('')}
            </select>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            Solicitar Acesso Imediato
          </button>
        </form>
      `);

      const form = document.getElementById('livroDownloadForm');
      if (form) {
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          const nome = document.getElementById('livroNome')?.value || '';
          const whats = document.getElementById('livroWhats')?.value || '';
          const email = document.getElementById('livroEmail')?.value || '';
          const obra = document.getElementById('livroSelect')?.value || bookTitle;

          const msg = `*SOLICITAÇÃO DE LIVRO DIGITAL - ACADEMIA LEÃO FERREIRA*\n\n*Obra:* ${obra}\n*Nome:* ${nome}\n*WhatsApp:* ${whats}\n*E-mail:* ${email}\n\nSolicito o exemplar digital desta obra jurídica.`;
          window.open(createWhatsAppUrl(msg), '_blank');
          closeModal();
        });
      }
    });
  });

  // Filtros de Blog
  const searchInput = document.getElementById('blogSearchInput');
  const catSelect = document.getElementById('blogCategorySelect');
  const areaSelect = document.getElementById('blogAreaSelect');

  const updateBlogView = () => {
    const container = document.getElementById('blogCardsContainer');
    if (container) {
      container.innerHTML = renderBlogCards();
      attachArticleModalListeners();
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.blogSearchQuery = e.target.value;
      updateBlogView();
    });
  }

  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      state.blogCategoryFilter = e.target.value;
      updateBlogView();
    });
  }

  if (areaSelect) {
    areaSelect.addEventListener('change', (e) => {
      state.blogAreaFilter = e.target.value;
      updateBlogView();
    });
  }

  attachArticleModalListeners();

  // Formulário do Rodapé
  const footerForm = document.getElementById('footerContactForm');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('footerNome')?.value || '';
      const whats = document.getElementById('footerWhats')?.value || '';
      const assunto = document.getElementById('footerAssunto')?.value || '';

      const msg = `*CONTATO INSTITUCIONAL VIA SITE*\n\n*Nome:* ${nome}\n*WhatsApp:* ${whats}\n*Assunto:* ${assunto}\n\nSolicito contato da equipe do Dr. Aldo Leão.`;
      window.open(createWhatsAppUrl(msg), '_blank');
      footerForm.reset();
    });
  }

  // Links de Termos e Privacidade
  setupTermsAndPrivacy();
}

function attachArticleModalListeners() {
  document.querySelectorAll('.btn-read-article').forEach(btn => {
    btn.addEventListener('click', () => {
      const artId = btn.getAttribute('data-article-id');
      const article = appData.ARTIGOS_NOTICIAS.find(a => a.id === artId);
      if (article) {
        openModal(article.title, `
          <div class="article-content-body">
            <div style="font-size: 13px; color: var(--color-gold); font-weight: 700; margin-bottom: 12px; text-transform: uppercase;">
              ${article.categoryName} • ${article.area} • Publicado em ${article.date}
            </div>
            ${article.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}
            <div style="margin-top: 30px; padding: 20px; background: var(--color-navy-soft); border-left: 3px solid var(--color-navy); border-radius: 4px;">
              <strong>Tem dúvidas sobre este tema ou deseja aplicar ao seu patrimônio?</strong>
              <div style="margin-top: 10px;">
                <button class="btn btn-primary btn-sm" id="btnArtigoConsultar">
                  Consultar Dr. Aldo Leão no WhatsApp
                </button>
              </div>
            </div>
          </div>
        `, true);

        const btnConsultar = document.getElementById('btnArtigoConsultar');
        if (btnConsultar) {
          btnConsultar.addEventListener('click', () => {
            const msg = `Olá Dr. Aldo Leão, li o artigo "${article.title}" e gostaria de entender sua aplicação prática no meu patrimônio.`;
            window.open(createWhatsAppUrl(msg), '_blank');
            closeModal();
          });
        }
      }
    });
  });
}

function setupHeroSlider() {
  const slides = [document.getElementById('heroSlide0'), document.getElementById('heroSlide1')];
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');

  if (!slides[0] || !slides[1]) return;

  const showSlide = (index) => {
    state.heroSlideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      if (slide) slide.classList.toggle('active', i === state.heroSlideIndex);
    });
    dots.forEach((dot, i) => {
      if (dot) dot.classList.toggle('active', i === state.heroSlideIndex);
    });
  };

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(state.heroSlideIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(state.heroSlideIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });

  // Auto-play suave a cada 7 segundos
  if (state.sliderTimer) clearInterval(state.sliderTimer);
  state.sliderTimer = setInterval(() => {
    showSlide(state.heroSlideIndex + 1);
  }, 7000);
}

function setupExperienceCounter() {
  const counterEl = document.getElementById('expCounterNumber');
  const triggerEl = document.getElementById('counterCardTrigger');
  if (!counterEl || !triggerEl || state.counterAnimated) return;

  const targetYears = state.experienceYears; // ex: 40 em 2026

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.counterAnimated) {
        state.counterAnimated = true;
        animateNumber(counterEl, 0, targetYears, 2200);
        observer.unobserve(triggerEl);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(triggerEl);
}

function animateNumber(element, start, end, duration) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Easing out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * (end - start) + start);
    element.textContent = currentVal;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   EVENTOS E INTERAÇÕES DA LANDING PAGE (/1208/)
   ========================================================================== */
function attachLandingPageEvents() {
  // Botão Voltar ao Site Institucional
  const btnVoltar = document.getElementById('btnLPVoltarSite');
  const btnVoltarFooter = document.getElementById('lpLinkVoltarFooter');

  const goBackToSite = (e) => {
    e.preventDefault();
    window.location.hash = '#institucional';
    navigateTo('institucional');
  };

  if (btnVoltar) btnVoltar.addEventListener('click', goBackToSite);
  if (btnVoltarFooter) btnVoltarFooter.addEventListener('click', goBackToSite);

  // Accordion do FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // Simulador Interativo Dinâmico de Economia
  const slider = document.getElementById('patrimonioRange');
  const label = document.getElementById('patrimonioLabel');
  const elInventario = document.getElementById('simCustoInventario');
  const elHolding = document.getElementById('simCustoHolding');
  const elEconomia = document.getElementById('simEconomiaVal');

  if (slider && label && elInventario && elHolding && elEconomia) {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      label.textContent = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      // Estimativa proporcional baseada nas alíquotas reais:
      // Inventário consome aprox 19,8% do patrimônio com deságio e custas
      // Holding consome aprox 8,86%
      const custoInv = Math.round(val * 0.198);
      const custoHold = Math.round(val * 0.0886);
      const economia = custoInv - custoHold;

      elInventario.textContent = custoInv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      elHolding.textContent = custoHold.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      elEconomia.textContent = economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    });
  }

  setupTermsAndPrivacy();
}



function setupTermsAndPrivacy() {
  const showLegalModal = (title, text) => {
    openModal(title, `
      <div style="font-size: 14.5px; line-height: 1.7; color: var(--color-text-main);">
        <p>${text}</p>
        <p style="margin-top: 14px;"><strong>ALDO LEÃO ADVOCACIA ESTRATÉGICA</strong><br>Av. Cel. Lucas de Oliveira, 1255/502, Bairro Bela Vista, Porto Alegre - RS.</p>
      </div>
    `);
  };

  const linkTermos = document.getElementById('linkTermos');
  const linkPriv = document.getElementById('linkPrivacidade');
  const lpLinkTermos = document.getElementById('lpLinkTermos');
  const lpLinkPriv = document.getElementById('lpLinkPrivacidade');

  const termosText = 'Os conteúdos disponibilizados neste site têm caráter meramente informativo e institucional sobre as áreas de atuação jurídica e produção intelectual do escritório ALDO LEÃO ADVOCACIA ESTRATÉGICA, em estrita observância ao Código de Ética e Disciplina da OAB. Não constituem consulta formal ou garantia de resultado.';
  const privText = 'Em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018), os dados fornecidos em nossos formulários de agendamento são utilizados exclusivamente para contato profissional direto entre a equipe do escritório e o solicitante, mantendo sigilo profissional absoluto.';

  if (linkTermos) linkTermos.addEventListener('click', (e) => { e.preventDefault(); showLegalModal('Termos de Uso', termosText); });
  if (linkPriv) linkPriv.addEventListener('click', (e) => { e.preventDefault(); showLegalModal('Política de Privacidade', privText); });
  if (lpLinkTermos) lpLinkTermos.addEventListener('click', (e) => { e.preventDefault(); showLegalModal('Termos de Uso', termosText); });
  if (lpLinkPriv) lpLinkPriv.addEventListener('click', (e) => { e.preventDefault(); showLegalModal('Política de Privacidade', privText); });
}

/* ==========================================================================
   SISTEMA DE MODAL GLOBAL
   ========================================================================== */
function openModal(title, bodyHtml, isLarge = false) {
  const container = document.getElementById('globalModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-backdrop active" id="modalBackdrop">
      <div class="modal-window ${isLarge ? 'modal-window-large' : ''}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close-btn" id="modalCloseBtn" aria-label="Fechar">✕</button>
        </div>
        <div class="modal-body">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';

  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
}

function closeModal() {
  const container = document.getElementById('globalModalContainer');
  if (container) container.innerHTML = '';
  document.body.style.overflow = 'auto';
}


/* ==========================================================================
   PAINEL DE ADMINISTRAÇÃO (VISUAL BUILDER - TELA DIVIDIDA)
   ========================================================================== */
function renderAdminPanel() {
  return `
    <style>
      body { margin: 0; overflow: hidden; }
      .admin-layout { display: flex; height: 100vh; width: 100vw; font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; }
      .admin-sidebar { width: 450px; background: #ffffff; display: flex; flex-direction: column; border-right: 1px solid #e2e8f0; z-index: 10; flex-shrink: 0; box-shadow: 5px 0 15px rgba(0,0,0,0.1); }
      .admin-header { background: #1A3F5D; color: white; padding: 25px 20px; display: flex; flex-direction: column; gap: 12px; }
      .admin-title { margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #D4AF37; }
      .admin-iframe-container { flex-grow: 1; background: #f1f5f9; position: relative; }
      #livePreview { width: 100%; height: 100%; border: none; }
      
      .admin-actions { display: flex; gap: 10px; margin-top: 5px; }
      .btn-save { background: #10b981; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 700; flex-grow: 1; transition: all 0.2s; }
      .btn-save:hover { background: #059669; }
      .btn-exit { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600; text-decoration: none; text-align: center; transition: all 0.2s; }
      .btn-exit:hover { background: rgba(255,255,255,0.2); }
      
      .page-switcher { display: flex; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 4px; margin-top: 10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
      .page-switcher button { flex: 1; background: transparent; color: #94A3B8; border: none; padding: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; border-radius: 6px; transition: 0.3s; }
      .page-switcher button.active { background: #D4AF37; color: #0F273D; box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4); }

      /* Form Customizado Estilo App */
      #customEditor { flex-grow: 1; overflow-y: auto; padding: 20px; background: #F8FAFC; }
      .editor-accordion { margin-bottom: 12px; background: white; border-radius: 8px; border: 1px solid #E2E6EA; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
      .editor-accordion > summary { padding: 14px 16px; font-weight: 700; color: #1A3F5D; cursor: pointer; background: white; list-style: none; display: flex; justify-content: space-between; align-items: center; user-select: none; }
      .editor-accordion > summary::-webkit-details-marker { display: none; }
      .editor-accordion > summary::after { content: '▼'; font-size: 10px; color: #94A3B8; }
      .editor-accordion[open] > summary { border-bottom: 1px solid #E2E6EA; background: #F1F5F9; }
      .editor-accordion[open] > summary::after { content: '▲'; }
      .accordion-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; background: white; }
      
      .editor-field { display: flex; flex-direction: column; gap: 6px; }
      .editor-field label { font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; }
      .editor-field input { padding: 10px 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: inherit; font-size: 14px; color: #1E293B; transition: border-color 0.2s; }
      .editor-field textarea { padding: 10px 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: inherit; font-size: 14px; color: #1E293B; min-height: 80px; resize: vertical; transition: border-color 0.2s; }
      .editor-field input:focus, .editor-field textarea:focus { outline: none; border-color: #D4AF37; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1); }
      
      /* Formatando chaves raiz do CMS */
      .root-section { margin-bottom: 24px; }
      .root-title { font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    </style>
    <div class="admin-layout">
      <!-- LADO ESQUERDO: EDITOR APP -->
      <div class="admin-sidebar">
        <div class="admin-header">
          <h1 class="admin-title">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
             Construtor Visual
          </h1>
          <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.4;">Edite os campos abaixo. O site atualiza ao lado em tempo real.</p>
          <div class="page-switcher">
            <button id="btnAdminSite" class="active">Site Oficial</button>
            <button id="btnAdminLP">Landing Page</button>
          </div>
          <div class="admin-actions">
            <button id="btnAdminSave" class="btn-save">Publicar Site</button>
            <a href="#institucional" class="btn-exit" onclick="window.location.reload();">Sair</a>
          </div>
        </div>
        <div id="customEditor"></div>
      </div>
      
      <!-- LADO DIREITO: SITE AO VIVO -->
      <div class="admin-iframe-container">
        <iframe id="livePreview" src="${window.location.pathname}#institucional"></iframe>
      </div>
    </div>
  `;
}

function initAdminPanel() {
  setupEditor();
}

let updateTimeout = null;

function setupEditor() {
  const container = document.getElementById("customEditor");
  const iframe = document.getElementById("livePreview");
  
  const btnSite = document.getElementById('btnAdminSite');
  const btnLP = document.getElementById('btnAdminLP');
  
  btnSite.addEventListener('click', () => {
     btnSite.classList.add('active');
     btnLP.classList.remove('active');
     iframe.src = window.location.pathname + '#institucional';
  });

  btnLP.addEventListener('click', () => {
     btnLP.classList.add('active');
     btnSite.classList.remove('active');
     iframe.src = window.location.pathname + '#1208';
  });
  
  let currentData = JSON.parse(JSON.stringify(window.appData));

  // Nomes amigáveis e ORDEM EXATA acompanhando a rolagem visual do site
  const visualOrder = [
    { key: "SITE_INFO", title: "Configurações Globais (Contatos, Textos Base e Banners)" },
    { key: "TIMELINE_DATA", title: "Seção 1: Nossa História (Linha do Tempo)" },
    { key: "AREAS_ATUACAO", title: "Seção 2: Áreas de Atuação" },
    { key: "SOLUCOES_EXCELENCIA", title: "Seção 3: Soluções de Excelência" },
    { key: "COMPARATIVO_VALORES", title: "Seção 4: Calculadora / Tabela Holding" },
    { key: "LIVROS_DIGITAIS", title: "Seção 5: Livros e Materiais" },
    { key: "ARTIGOS_NOTICIAS", title: "Seção 6: Blog e Artigos" },
    { key: "FAQ_LANDING_PAGE", title: "Seção Oculta: Perguntas Frequentes (LP)" }
  ];

  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function buildForm(obj, path = []) {
    let html = '';
    
    if (Array.isArray(obj)) {
      html += `<div style="display: flex; flex-direction: column; gap: 4px;">`;
      obj.forEach((item, index) => {
        let itemTitle = item.title || item.year || item.name || item.pergunta || item.badge || `Item ${index + 1}`;
        if (typeof itemTitle !== 'string' && typeof itemTitle !== 'number') itemTitle = `Item ${index + 1}`;
        if (String(itemTitle).length > 40) itemTitle = String(itemTitle).substring(0, 40) + '...';
        
        html += `<details class="editor-accordion">
                   <summary>${escapeHtml(String(itemTitle))}</summary>
                   <div class="accordion-content">${buildForm(item, [...path, index])}</div>
                 </details>`;
      });
      html += `</div>`;
    } 
    else if (typeof obj === 'object' && obj !== null) {
      html += `<div style="display: flex; flex-direction: column; gap: 12px;">`;
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'id' || key === 'icon' || key === 'target') continue;
        
        if (typeof value === 'object') {
           html += `<details class="editor-accordion">
                      <summary>${key.toUpperCase()}</summary>
                      <div class="accordion-content">${buildForm(value, [...path, key])}</div>
                    </details>`;
        } else {
           const stringPath = JSON.stringify(path.concat([key]));
           const safeVal = escapeHtml(String(value));
           
           if (typeof value === 'string' && value.length > 60) {
             html += `<div class="editor-field"><label>${key}</label><textarea oninput='window.updateData(${stringPath}, this.value)'>${safeVal}</textarea></div>`;
           } else {
             html += `<div class="editor-field"><label>${key}</label><input type="text" oninput='window.updateData(${stringPath}, this.value)' value="${safeVal}"></div>`;
           }
        }
      }
      html += `</div>`;
    }
    return html;
  }
  
  // Constrói o HTML raiz baseado na ordem visual definida
  let rootHtml = '';
  visualOrder.forEach(section => {
     if (currentData[section.key]) {
       rootHtml += `
         <div class="root-section">
           <div class="root-title">${section.title}</div>
           ${buildForm(currentData[section.key], [section.key])}
         </div>
       `;
     }
  });
  
  // Adiciona chaves extras que possam não estar na lista oficial
  for (const [key, value] of Object.entries(currentData)) {
     if (!visualOrder.find(s => s.key === key)) {
       rootHtml += `
         <div class="root-section">
           <div class="root-title">${key} (Outros)</div>
           ${buildForm(value, [key])}
         </div>
       `;
     }
  }
  
  container.innerHTML = rootHtml;
  
  window.updateData = function(pathArr, val) {
     let ref = currentData;
     for (let i = 0; i < pathArr.length - 1; i++) {
        ref = ref[pathArr[i]];
     }
     ref[pathArr[pathArr.length - 1]] = val;
     
     clearTimeout(updateTimeout);
     updateTimeout = setTimeout(() => {
        localStorage.setItem('aldoleao_admin_data', JSON.stringify(currentData));
        iframe.contentWindow.location.reload();
     }, 600);
  };
  
  document.getElementById('btnAdminSave').addEventListener('click', () => {
    localStorage.setItem('aldoleao_admin_data', JSON.stringify(currentData));
    alert('✅ Site atualizado e publicado com sucesso!');
  });
}
