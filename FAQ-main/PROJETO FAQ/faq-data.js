// ================================================================
// ARQUIVO: faq-data.js
// FUNÇÃO:  Banco de dados das perguntas e respostas do FAQ.
//          Este é o ÚNICO arquivo que você precisa editar para
//          adicionar, remover ou alterar perguntas e respostas.
//
// COMO ADICIONAR UMA NOVA PERGUNTA:
//   1. Copie um bloco { id, topic, topicLabel, question, answer }
//   2. Cole dentro do array FAQ_DATA (não esqueça a vírgula!)
//   3. Altere o id (deve ser único e sequencial)
//   4. Escolha o topic correto (veja lista de tópicos abaixo)
//   5. Escreva a question (pergunta) e o answer (resposta)
//
// TÓPICOS DISPONÍVEIS (campo "topic"):
//   "conta"       → Conta e Acesso
//   "sistema"     → Sistema e Instalação
//   "financeiro"  → Financeiro
//   "impressao"   → Impressão
//   "outros"      → Outros Assuntos
//
// PARA CRIAR UM NOVO TÓPICO:
//   1. Aqui: use um novo valor em topic e topicLabel
//   2. Em faq.html: adicione um botão no #filter-bar com data-topic="NOME"
//   3. Em style.css: adicione a cor do losango .diamond.cat-NOME { background: ... }
//   4. Em index.html: adicione o card de tópico na .topics-grid
//
// CAMPO "answer": suporta quebras de linha com \n (use template literal com crase)
// ================================================================

const FAQ_DATA = [

  // ──────────────────────────────────────────────────────────────
  // TÓPICO: CONTA E ACESSO
  // ──────────────────────────────────────────────────────────────
  {
    id: 1,
    topic: "conta",
    topicLabel: "👤 Conta e Acesso",
    question: "Como redefinir minha senha?",
    answer: `Para redefinir sua senha, siga os passos abaixo:

1. Acesse a tela de login do sistema.
2. Clique em "Esqueci minha senha".
3. Informe o e-mail cadastrado.
4. Verifique sua caixa de entrada e clique no link recebido.
5. Defina uma nova senha com pelo menos 8 caracteres.

⚠️ O link expira em 30 minutos. Caso não receba o e-mail, verifique a caixa de spam.`
  },
  {
    id: 2,
    topic: "conta",
    topicLabel: "👤 Conta e Acesso",
    question: "Não consigo fazer login. O que fazer?",
    answer: `Se você não consegue fazer login, tente:

1. Verificar se o CAPS LOCK está ativo.
2. Confirmar se está usando o e-mail correto.
3. Limpar o cache e cookies do navegador (Ctrl+Shift+Del).
4. Tentar outro navegador (Chrome, Edge, Firefox).
5. Se o problema persistir, solicite o desbloqueio da conta ao administrador.

💡 Após 5 tentativas incorretas, sua conta pode ser bloqueada por segurança.`
  },
  {
    id: 3,
    topic: "conta",
    topicLabel: "👤 Conta e Acesso",
    question: "Como alterar meu e-mail cadastrado?",
    answer: `Para alterar seu e-mail de cadastro:

1. Acesse "Configurações" > "Meu Perfil".
2. Clique em "Editar informações".
3. Insira o novo e-mail e confirme.
4. Um link de verificação será enviado ao novo e-mail.
5. Clique no link para confirmar a alteração.

⚠️ O e-mail antigo continuará válido até a confirmação no novo endereço.`
  },

  // ──────────────────────────────────────────────────────────────
  // TÓPICO: SISTEMA E INSTALAÇÃO
  // ──────────────────────────────────────────────────────────────
  {
    id: 4,
    topic: "sistema",
    topicLabel: "🖥️ Sistema e Instalação",
    question: "Quais são os requisitos mínimos do sistema?",
    answer: `Requisitos mínimos para instalação:

• Sistema Operacional: Windows 10 (64-bit) ou superior
• Processador: Intel Core i3 ou equivalente
• RAM: 4 GB (recomendado 8 GB)
• Armazenamento: 2 GB livres
• Navegador: Chrome 90+, Edge 90+ ou Firefox 88+
• Internet: Conexão estável (5 Mbps ou mais)

✅ Para melhor desempenho, recomendamos Windows 11 com 16 GB de RAM.`
  },
  {
    id: 5,
    topic: "sistema",
    topicLabel: "🖥️ Sistema e Instalação",
    question: "O sistema não carrega. Como proceder?",
    answer: `Se o sistema não carrega, tente estas soluções:

1. Verifique sua conexão com a internet.
2. Pressione F5 para recarregar a página.
3. Limpe o cache do navegador (Ctrl+Shift+Del → Todo o período).
4. Desative extensões do navegador temporariamente.
5. Tente acessar em aba anônima (Ctrl+Shift+N).
6. Verifique se há manutenção programada no status do sistema.

Se o erro persistir, registre o número do erro exibido e entre em contato com o suporte.`
  },
  {
    id: 6,
    topic: "sistema",
    topicLabel: "🖥️ Sistema e Instalação",
    question: "Como atualizar o sistema para a versão mais recente?",
    answer: `As atualizações são automáticas quando disponíveis. Para verificar manualmente:

1. Acesse "Configurações" > "Sobre o sistema".
2. Clique em "Verificar atualizações".
3. Se houver atualização disponível, clique em "Instalar agora".
4. O sistema reiniciará em horário de menor demanda.

⚠️ Recomendamos realizar atualizações fora do horário comercial para evitar interrupções.`
  },

  // ──────────────────────────────────────────────────────────────
  // TÓPICO: FINANCEIRO
  // ──────────────────────────────────────────────────────────────
  {
    id: 7,
    topic: "financeiro",
    topicLabel: "💳 Financeiro",
    question: "Como emitir segunda via de boleto?",
    answer: `Para emitir segunda via de boleto:

1. Acesse "Financeiro" > "Cobranças".
2. Localize a cobrança desejada usando filtros de data ou número.
3. Clique em "Ações" > "Segunda Via".
4. O novo boleto com vencimento atualizado será exibido.
5. Clique em "Imprimir" ou "Baixar PDF".

💡 Boletos vencidos há mais de 3 dias podem ter acréscimo de juros e multa conforme contrato.`
  },
  {
    id: 8,
    topic: "financeiro",
    topicLabel: "💳 Financeiro",
    question: "Como alterar o plano de assinatura?",
    answer: `Para alterar seu plano:

1. Acesse "Configurações" > "Assinatura e Planos".
2. Veja os planos disponíveis e compare recursos.
3. Clique em "Mudar Plano" no plano desejado.
4. Revise os valores e a data de início.
5. Confirme a alteração com sua senha.

⚠️ Upgrades têm efeito imediato. Downgrades entram em vigor no próximo ciclo de cobrança.`
  },

  // ──────────────────────────────────────────────────────────────
  // TÓPICO: IMPRESSÃO
  // ──────────────────────────────────────────────────────────────
  {
    id: 9,
    topic: "impressao",
    topicLabel: "🖨️ Impressão",
    question: "A impressão está cortando o conteúdo. Como corrigir?",
    answer: `Para corrigir problemas de corte na impressão:

1. Acesse as configurações de impressão (Ctrl+P).
2. Em "Mais configurações", defina a escala para 80% ou "Ajustar ao papel".
3. Margens: selecione "Mínimas" ou "Personalizado" com margens menores.
4. Verifique se o tamanho do papel está correto (A4 para o Brasil).
5. Tente imprimir em orientação Paisagem se o conteúdo for largo.

💡 Para documentos do sistema (PDF), sempre use "Imprimir como PDF" e depois imprima o arquivo gerado.`
  },
  {
    id: 10,
    topic: "impressao",
    topicLabel: "🖨️ Impressão",
    question: "Como configurar impressão de etiquetas?",
    answer: `Para configurar impressão de etiquetas:

1. Acesse "Configurações" > "Impressão" > "Etiquetas".
2. Selecione o modelo de etiqueta compatível com seu tipo de papel.
3. Configure as margens e o espaçamento entre etiquetas.
4. Faça um teste imprimindo em papel comum primeiro.
5. Ajuste as margens conforme necessário.
6. Salve o perfil de impressão para uso futuro.

⚠️ Para etiquetas térmicas (zebra, argox), selecione o driver correto da impressora nas configurações do Windows.`
  },

  // ──────────────────────────────────────────────────────────────
  // TÓPICO: OUTROS ASSUNTOS
  // ──────────────────────────────────────────────────────────────
  {
    id: 11,
    topic: "outros",
    topicLabel: "💬 Outros Assuntos",
    question: "Como entrar em contato com o suporte técnico?",
    answer: `Você pode contatar nosso suporte pelos canais:

📧 E-mail: suporte@empresa.com (resposta em até 24h)
💬 Chat ao vivo: disponível no canto inferior direito do sistema (Seg-Sex, 8h-18h)
📞 Telefone: (11) 4000-0000 (Seg-Sex, 8h-17h)
🎫 Abrir chamado: "Ajuda" > "Abrir Ticket de Suporte"

Para atendimento mais rápido, tenha em mãos:
• Seu nome e CPF/CNPJ
• Descrição detalhada do problema
• Prints de tela ou mensagens de erro`
  },
  {
    id: 12,
    topic: "outros",
    topicLabel: "💬 Outros Assuntos",
    question: "Como enviar sugestões ou feedback?",
    answer: `Sua opinião é muito importante para nós! Envie sugestões por:

1. Acesse "Ajuda" > "Enviar Sugestão" dentro do sistema.
2. Descreva sua ideia ou problema de forma clara.
3. Se quiser, anexe um print de tela para ilustrar.
4. Clique em "Enviar".

Nosso time de produto analisa todas as sugestões recebidas.
As mais votadas entram no roadmap de desenvolvimento!

💡 Você também pode votar em sugestões de outros usuários em nosso portal de ideias: ideias.empresa.com`
  }

]; // fim do array FAQ_DATA
