// ================================================================
// ARQUIVO: faq.js
// FUNÇÃO:  Toda a lógica interativa da página faq.html.
//          Controla: criação dos losangos, clique, filtros,
//          painel de resposta, botões de feedback e envio de e-mail.
//
// DEPENDÊNCIA: faq-data.js deve ser carregado ANTES deste arquivo
//              (ordem dos <script> no faq.html está correta)
// ================================================================


// ── VARIÁVEIS GLOBAIS ──────────────────────────────────────────
let currentFilter = 'all';   // filtro ativo ('all' ou nome de tópico)
let currentSearch = '';      // filtro por texto de pesquisa
let selectedDiamond = null;  // referência ao wrapper do losango selecionado
let allWrappers = [];        // lista de todos os .diamond-wrapper criados


// ── INICIALIZAÇÃO ──────────────────────────────────────────────
// Espera o HTML carregar completamente antes de executar
document.addEventListener('DOMContentLoaded', () => {
  checkUrlParams();      // verifica se veio de um tópico específico na index.html
  renderDiamonds(FAQ_DATA); // cria os losangos na tela
  setupFilters();        // ativa os botões de filtro
  setupSearch();         // ativa a barra de pesquisa
});

// ── CONFIGURA A PESQUISA ───────────────────────────────────────
function setupSearch() {
  const searchInput = document.getElementById('faq-search-input');
  
  if (searchInput) {
    // Cria o balão de resultados dinâmico
    let balloon = document.getElementById('search-balloon');
    if (!balloon) {
      balloon = document.createElement('div');
      balloon.id = 'search-balloon';
      balloon.className = 'search-balloon';
      searchInput.parentElement.appendChild(balloon);
    }

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      currentSearch = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      
      // Atualiza os losangos lá embaixo
      renderDiamonds(FAQ_DATA);

      // Lógica do Balão (Autocomplete)
      if (currentSearch.length > 1) {
        // Encontra os itens relacionados (ignorando acentos)
        const related = FAQ_DATA.filter(item => {
          const q = item.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          const a = item.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          const t = item.topicLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          return q.includes(currentSearch) || a.includes(currentSearch) || t.includes(currentSearch);
        });

        balloon.innerHTML = ''; // Limpa o balão

        if (related.length > 0) {
          // Mostra até 6 resultados para não poluir
          related.slice(0, 6).forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-balloon-item';
            div.innerHTML = `
              <div class="balloon-item-title">${item.question}</div>
              <div class="balloon-item-topic">${item.topicLabel}</div>
            `;
            
            // Ao clicar num resultado do balão
            div.onclick = () => {
              // Limpa a busca e esconde balão
              searchInput.value = '';
              currentSearch = '';
              balloon.classList.remove('active');
              
              // Garante que o tópico está visível (ex: tirando o filtro se tiver num diferente)
              currentFilter = 'all';
              document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
              document.getElementById('filter-all').classList.add('active');
              renderDiamonds(FAQ_DATA);
              
              // Pequeno atraso para dar tempo de renderizar os losangos
              setTimeout(() => {
                const targetWrapper = allWrappers.find(w => parseInt(w.dataset.id) === item.id);
                if (targetWrapper) selectDiamond(targetWrapper, item);
                
                // Rola para a seção do FAQ para o usuário ver a resposta
                document.getElementById('answer-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            };
            
            balloon.appendChild(div);
          });
          balloon.classList.add('active');
        } else {
          balloon.innerHTML = `<div class="search-balloon-item" style="color:#71717a; text-align:center;">Nenhum resultado encontrado.</div>`;
          balloon.classList.add('active');
        }
      } else {
        balloon.classList.remove('active');
      }
    });

    // Evento para tecla Enter na barra de pesquisa
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeSearch();
      }
    });

    // Evento para o botão de pesquisa (lupa)
    const searchBtn = document.getElementById('faq-search-btn');
    if (searchBtn) {
      searchBtn.onclick = () => executeSearch();
    }

    // Função centralizada para executar a busca "definitiva"
    function executeSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      if (!searchTerm) return;

      balloon.classList.remove('active');
      
      // Filtra e renderiza
      currentSearch = searchTerm;
      renderDiamonds(FAQ_DATA);
      
      // Rola para os resultados
      document.getElementById('faq').scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Se houver resultados, tenta destacar o primeiro após a renderização
      setTimeout(() => {
        if (allWrappers.length > 0) {
          const firstId = parseInt(allWrappers[0].dataset.id);
          const item = FAQ_DATA.find(i => i.id === firstId);
          if (item) selectDiamond(allWrappers[0], item);
        }
      }, 300);
    }

    // Fecha o balão se clicar fora da barra de pesquisa
    document.addEventListener('click', (e) => {
      if (!searchInput.parentElement.contains(e.target)) {
        balloon.classList.remove('active');
      }
    });
  }
}


// ── VERIFICA PARÂMETROS DA URL ─────────────────────────────────
// Quando o usuário clica em um card de tópico na index.html,
// ele é redirecionado para faq.html?topic=NOME.
// Esta função lê esse parâmetro e ativa o filtro correto.
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic'); // pega o valor após "?topic="

  if (topic && topic !== 'all') {
    currentFilter = topic;

    // Marca visualmente o botão de filtro correto como ativo
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.topic === topic) btn.classList.add('active');
    });
  }
}


// ── RENDERIZA OS LOSANGOS ──────────────────────────────────────
// Limpa a trilha e recria os losangos de acordo com o filtro atual.
// Chamada na inicialização e toda vez que o filtro muda.
function renderDiamonds(data) {
  const track = document.getElementById('diamonds-track');
  track.innerHTML = ''; // limpa o container
  allWrappers = [];     // reseta a lista de referências

  // Filtra os dados: por tópico e pela pesquisa em texto simultaneamente
  const filtered = data.filter(item => {
    const matchTopic = currentFilter === 'all' || item.topic === currentFilter;
    
    // Ignora acentos na pesquisa
    const qTemp = item.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const aTemp = item.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    
    const matchSearch = currentSearch === '' || 
                        qTemp.includes(currentSearch) || 
                        aTemp.includes(currentSearch);
    return matchTopic && matchSearch;
  });

  // Se não houver perguntas no tópico/pesquisa, exibe mensagem
  if (filtered.length === 0) {
    track.innerHTML = `
      <div style="text-align:center; color: var(--clr-text-muted); padding: 40px;">
        <p style="font-size:2rem; margin-bottom:12px;">🔍</p>
        <p>Nenhuma pergunta encontrada neste tópico.</p>
      </div>`;
    return;
  }

  // Cria cada losango com animação de entrada escalonada
  filtered.forEach((item, index) => {
    const wrapper = createDiamond(item, index);
    track.appendChild(wrapper);
    allWrappers.push(wrapper);

    // Animação de entrada: começa invisível e pequeno, depois cresce
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'scale(0.7) translateY(30px)';
    setTimeout(() => {
      wrapper.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'scale(1) translateY(0)';
    }, index * 80); // atraso escalonado: cada losango aparece 80ms depois do anterior
  });

  // Esconde o painel de resposta ao refiltrar
  hidePanel();
}


// ── CRIA UM ELEMENTO LOSANGO ───────────────────────────────────
// Monta o HTML de um losango e retorna o elemento já com evento de clique.
// Cada losango tem velocidade de rotação diferente (spinDuration).
function createDiamond(item, index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'diamond-wrapper';
  wrapper.dataset.id = item.id;       // guarda o id da pergunta no elemento
  wrapper.dataset.topic = item.topic; // guarda o tópico no elemento

  // Velocidade de rotação varia de 4 a 7 segundos por volta
  const spinDuration = 4 + (index % 4);

  // HTML interno do losango:
  //   .diamond-number → número no topo do losango
  //   .diamond        → o quadrado rotacionado em 45° (losango)
  //     cat-{topic}   → define a cor via CSS (.diamond.cat-conta, etc.)
  //   .diamond-label  → texto da pergunta dentro do losango (contra-rotaciona)
  //   .diamond-cat    → nome da categoria abaixo do losango
  wrapper.innerHTML = `
    <div class="diamond-number">${item.id}</div>
    <div class="diamond cat-${item.topic}" style="animation-duration: ${spinDuration}s; animation-delay: -${index * 0.6}s">
      <div class="diamond-label">${item.question}</div>
    </div>
    <div class="diamond-cat">${item.topicLabel}</div>
  `;

  // Ao clicar no losango, chama selectDiamond()
  wrapper.addEventListener('click', () => {
    selectDiamond(wrapper, item);
  });

  return wrapper;
}


// ── SELECIONA UM LOSANGO ───────────────────────────────────────
// Para a animação do losango clicado, destaca ele e exibe a resposta.
function selectDiamond(wrapper, item) {
  // Remove destaque de todos os losangos
  allWrappers.forEach(w => w.classList.remove('selected'));

  // Para a animação de todos os outros losangos
  allWrappers.forEach(w => {
    const d = w.querySelector('.diamond');
    if (d) d.style.animationPlayState = 'paused';
  });

  // Marca este losango como selecionado (CSS aplica brilho e escala)
  wrapper.classList.add('selected');
  selectedDiamond = wrapper;

  // Pequeno delay para o CSS de seleção aplicar antes de rolar a tela
  setTimeout(() => {
    showPanel(item); // preenche e exibe o painel de resposta
    document.getElementById('answer-panel').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
}


// ── EXIBE O PAINEL DE RESPOSTA ─────────────────────────────────
// Preenche os campos do painel com os dados do losango clicado
// e torna o painel visível (adiciona classe "visible").
function showPanel(item) {
  const panel    = document.getElementById('answer-panel');
  const badge    = document.getElementById('answer-badge');
  const question = document.getElementById('answer-question');
  const text     = document.getElementById('answer-text');

  badge.textContent    = item.topicLabel; // ex: "👤 Conta e Acesso"
  question.textContent = item.question;   // pergunta
  text.textContent     = item.answer;     // resposta completa

  // Torna o painel visível (CSS: opacity:1, translateY:0)
  panel.classList.add('visible');

  // --- LÓGICA DE MÍDIA ---
  const mediaContainer = document.getElementById('answer-media');
  if (mediaContainer) {
    mediaContainer.innerHTML = ''; // Limpa mídias anteriores

    // Adiciona Imagem se houver
    // Adiciona Imagem se houver uma URL válida
    if (item.image && item.image.trim().length > 0) {
      const img = document.createElement('img');
      img.src = item.image;
      img.className = 'answer-image';
      img.alt = 'Imagem ilustrativa';
      mediaContainer.appendChild(img);
    }

    // Adiciona Vídeo se houver
    if (item.video) {
      const videoWrapper = document.createElement('div');
      videoWrapper.className = 'answer-video-wrapper';
      
      // Verifica se é um ID do YouTube (geralmente sem extensão) ou um arquivo local
      const isYouTube = !item.video.includes('.');
      
      if (isYouTube) {
        videoWrapper.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${item.video}" 
            title="Vídeo de suporte" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      } else {
        // Se tiver extensão (ex: .mp4, .webm), usa tag <video>
        videoWrapper.innerHTML = `
          <video controls class="answer-local-video" style="width:100%; border-radius:inherit;">
            <source src="${item.video}" type="video/mp4">
            Seu navegador não suporta a exibição deste vídeo.
          </video>
        `;
        // Remove o aspecto 16:9 fixo do wrapper para vídeos locais (opcional, mas evita faixas pretas se o vídeo tiver outro formato)
        videoWrapper.style.paddingBottom = '0';
        videoWrapper.style.height = 'auto';
      }
      
      mediaContainer.appendChild(videoWrapper);
    }
  }

  // Reseta o botão "Isso ajudou" para o estado original
  const btnHelpful = document.getElementById('btn-helpful');
  if (btnHelpful) {
    btnHelpful.textContent = '👍 Isso ajudou';
    btnHelpful.classList.remove('clicked');
  }
}


// ── ESCONDE O PAINEL DE RESPOSTA ──────────────────────────────
// Remove a classe "visible" do painel (CSS torna invisível com animação).
function hidePanel() {
  const panel = document.getElementById('answer-panel');
  if (panel) panel.classList.remove('visible');
  selectedDiamond = null;
}


// ── BOTÃO: "▶ Continuar girando" ──────────────────────────────
// Retoma a rotação de TODOS os losangos e esconde o painel.
function resumeAll() {
  allWrappers.forEach(w => {
    w.classList.remove('selected'); // remove destaque

    // Retoma a animação CSS
    const d = w.querySelector('.diamond');
    if (d) d.style.animationPlayState = 'running';
  })

  hidePanel(); // esconde o painel de resposta

  // Rola para o topo da página
  const topo = document.getElementById('topo') || document.body;
  topo.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ── BOTÃO: "👍 Isso ajudou" ────────────────────────────────────
// Muda o texto do botão para confirmação e fecha o formulário de feedback negativo.
// Só funciona uma vez por pergunta (verifica a classe "clicked").
function markHelpful() {
  const btn    = document.getElementById('btn-helpful');
  const btnNot = document.getElementById('btn-not-helpful');

  if (btn && !btn.classList.contains('clicked')) {
    btn.classList.add('clicked');
    btn.textContent = '✅ Ótimo! Fico feliz em ajudar!';

    // Fecha o formulário de "não ajudou" se estiver aberto
    if (btnNot) btnNot.classList.remove('active');
    const form = document.getElementById('not-helpful-form');
    if (form) form.classList.remove('open');
  }
}


// ── BOTÃO: "👎 Isso não ajudou" ───────────────────────────────
// Abre ou fecha o formulário de feedback negativo com animação.
// O formulário é um <div> que expande via CSS (max-height transition).
function toggleNotHelpful() {
  const form    = document.getElementById('not-helpful-form');
  const btn     = document.getElementById('btn-not-helpful');
  const helpful = document.getElementById('btn-helpful');

  if (!form || !btn) return;

  const isOpen = form.classList.contains('open');

  if (isOpen) {
    // Fecha o formulário
    form.classList.remove('open');
    btn.classList.remove('active');
  } else {
    // Abre o formulário
    form.classList.add('open');
    btn.classList.add('active');

    // Se o usuário tinha clicado em "ajudou", reseta esse botão
    if (helpful) {
      helpful.classList.remove('clicked');
      helpful.textContent = '👍 Isso ajudou';
    }

    // Foca no campo de texto após a animação de abertura (300ms)
    setTimeout(() => {
      const textarea = document.getElementById('not-helpful-text');
      if (textarea) textarea.focus();
    }, 300);
  }
}


// ── CONTADOR DE CARACTERES DO TEXTAREA ────────────────────────
// Atualiza em tempo real o contador "X / 500" enquanto o usuário digita.
// Fica vermelho quando passa de 450 caracteres.
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('not-helpful-text');
  const counter  = document.getElementById('char-counter');

  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 500`;
      // Alerta visual: fica vermelho ao aproximar do limite
      counter.style.color = len > 450 ? '#f87171' : 'var(--clr-text-dim)';
    });
  }
});


// ── BOTÃO: "📧 Enviar para o Suporte" ─────────────────────────
// Monta um link mailto: com assunto e corpo pré-preenchidos e abre
// o cliente de e-mail padrão do usuário (Outlook, Gmail, etc.).
//
// ⚠️ ALTERE O E-MAIL ABAIXO para o e-mail real do seu suporte:
//    window.location.href = `mailto:SEU_EMAIL@dominio.com?...`
function sendToSupport() {
  const textarea = document.getElementById('not-helpful-text');
  const btn      = document.getElementById('btn-send-support');
  const question = document.getElementById('answer-question'); // pergunta atual do painel

  if (!textarea || !btn) return;

  const descricao = textarea.value.trim();

  // Valida: não permite enviar sem descrição
  if (!descricao) {
    textarea.style.borderColor = 'rgba(239,68,68,0.7)'; // borda vermelha de alerta
    textarea.placeholder = '⚠️ Por favor, descreva sua dificuldade antes de enviar.';
    textarea.focus();
    return;
  }

  // Pega a pergunta que estava sendo exibida no painel
  const pergunta = question ? question.textContent : 'Não identificada';

  // Monta assunto e corpo do e-mail (encodeURIComponent escapa caracteres especiais)
  const assunto = encodeURIComponent(`[FAQ] Resposta não ajudou: ${pergunta}`);
  const corpo   = encodeURIComponent(
    `Olá, equipe de suporte!\n\nAcessei o FAQ e a resposta para a pergunta abaixo não resolveu meu problema.\n\n` +
    `📌 Pergunta consultada:\n${pergunta}\n\n` +
    `📝 Minha dificuldade:\n${descricao}\n\n` +
    `Aguardo o retorno. Obrigado!`
  );

  // ⚠️ TROQUE O E-MAIL AQUI:
  window.location.href = `mailto:suporte@empresa.com?subject=${assunto}&body=${corpo}`;

  // Feedback visual: botão vira verde e desabilita por 4 segundos
  btn.textContent = '✅ Abrindo seu e-mail...';
  btn.classList.add('sent');
  btn.disabled = true;

  // Reseta após 4 segundos
  setTimeout(() => {
    btn.textContent = '📧 Enviar para o Suporte';
    btn.classList.remove('sent');
    btn.disabled = false;
    textarea.value = '';
    document.getElementById('char-counter').textContent = '0 / 500';
  }, 4000);
}


// ── FILTROS DE CATEGORIA ───────────────────────────────────────
// Ativa os botões do #filter-bar. Ao clicar, atualiza o filtro
// e re-renderiza os losangos com a lista filtrada.
function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualiza visual: remove "active" de todos e adiciona no clicado
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Atualiza o filtro global e re-renderiza
      currentFilter = btn.dataset.topic; // pega o valor de data-topic="..."
      renderDiamonds(FAQ_DATA);           // recria os losangos filtrados
    });
  });
}

/* ============================================================
   MODO CONTRIBUIDOR (ADMIN SECRETO)
   Gatilho: 3 cliques rápidos no logo da Navbar
   ============================================================ */
let logoClicks = 0;
let logoTimer;

document.addEventListener('DOMContentLoaded', () => {
  const navLogo = document.getElementById('nav-logo-link');
  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      logoClicks++;
      clearTimeout(logoTimer);

      if (logoClicks === 3) {
        e.preventDefault();
        openAdminPanel();
        logoClicks = 0;
      } else {
        logoTimer = setTimeout(() => { logoClicks = 0; }, 500);
      }
    });
  }

  // Binds para os botões do painel admin
  const adminClose = document.getElementById('admin-close-btn');
  if (adminClose) adminClose.onclick = () => document.getElementById('faq-admin-panel').classList.remove('active');

  const adminSave = document.getElementById('admin-save-btn');
  if (adminSave) adminSave.onclick = saveAdminItem;

  const adminExport = document.getElementById('admin-export-btn');
  if (adminExport) adminExport.onclick = exportFaqData;
});

function openAdminPanel() {
  document.getElementById('faq-admin-panel').classList.add('active');
  renderAdminList();
}

function renderAdminList() {
  const adminList = document.getElementById('admin-items-list');
  if (!adminList) return;
  
  adminList.innerHTML = '';
  FAQ_DATA.forEach(item => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.padding = '10px';
    div.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    
    div.innerHTML = `
      <div style="font-size: 0.9rem; color: #eee;">
        <strong>#${item.id}</strong> - ${item.question.substring(0, 35)}...
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="loadItemToEdit(${item.id})" style="background: #3f3f46; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Editar</button>
        <button onclick="deleteAdminItem(${item.id})" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">X</button>
      </div>
    `;
    adminList.appendChild(div);
  });
}

window.loadItemToEdit = function(id) {
  const item = FAQ_DATA.find(i => i.id === id);
  if (!item) return;

  document.getElementById('edit-id').value = item.id;
  document.getElementById('edit-question').value = item.question;
  document.getElementById('edit-answer').value = item.answer;
  document.getElementById('edit-topic').value = item.topic;
  document.getElementById('edit-image').value = item.image || "";
  document.getElementById('edit-video').value = item.video || "";
  
  document.getElementById('admin-save-btn').innerHTML = "Atualizar Pergunta #" + id;
};

window.deleteAdminItem = function(id) {
  if (confirm("Excluir esta pergunta permanentemente?")) {
    const idx = FAQ_DATA.findIndex(i => i.id === id);
    if (idx > -1) {
      FAQ_DATA.splice(idx, 1);
      renderAdminList();
      renderDiamonds(FAQ_DATA);
    }
  }
};

function saveAdminItem() {
  const idVal = document.getElementById('edit-id').value;
  const question = document.getElementById('edit-question').value;
  const answer = document.getElementById('edit-answer').value;
  const image = document.getElementById('edit-image').value.trim();
  const video = document.getElementById('edit-video').value.trim();
  const topicSelect = document.getElementById('edit-topic');
  const topic = topicSelect.value;
  const topicLabel = topicSelect.options[topicSelect.selectedIndex].text;

  if (!question || !answer) {
    alert("Preencha todos os campos!");
    return;
  }

  if (idVal) {
    const item = FAQ_DATA.find(i => i.id == idVal);
    if (item) {
      item.question = question;
      item.answer = answer;
      item.topic = topic;
      item.topicLabel = topicLabel;
      item.image = image;
      item.video = video;
    }
  } else {
    const newId = FAQ_DATA.length > 0 ? Math.max(...FAQ_DATA.map(i => i.id)) + 1 : 1;
    FAQ_DATA.push({ id: newId, topic, topicLabel, question, answer, image, video });
  }

  // Reset
  document.getElementById('edit-id').value = "";
  document.getElementById('edit-question').value = "";
  document.getElementById('edit-answer').value = "";
  document.getElementById('edit-image').value = "";
  document.getElementById('edit-video').value = "";
  document.getElementById('admin-save-btn').innerHTML = "Salvar Nova Pergunta";

  renderAdminList();
  renderDiamonds(FAQ_DATA);
  alert("Salvo com sucesso! Não esqueça de clicar em 'Baixar arquivo' para tornar as mudanças permanentes.");
}

function exportFaqData() {
  const content = `// ARQUIVO DE DADOS FAQ
const FAQ_DATA = ${JSON.stringify(FAQ_DATA, null, 2)};
`;

  const blob = new Blob([content], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'faq-data.js';
  a.click();
  URL.revokeObjectURL(url);
}

// Função para atualizar o campo de texto com o conteúdo do arquivo (Base64)
window.updateFileName = function(fileId, targetId) {
  const fileInput = document.getElementById(fileId);
  const targetInput = document.getElementById(targetId);
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      // O resultado será uma string Base64 (data:image/...)
      targetInput.value = e.target.result;
      
      // Feedback visual opcional: mudar a cor da borda para indicar sucesso
      targetInput.style.borderColor = "#34d399";
    };

    reader.readAsDataURL(file);
  }
};
