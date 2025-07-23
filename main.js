// IA Estudos - Sistema de Inteligência Artificial Educacional
// Arquivo principal JavaScript

class AIStudyPlatform {
    constructor() {
        this.currentTab = 'questoes';
        this.conversations = {
            questoes: [],
            dialogos: [],
            imagens: []
        };
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.loadStoredData();
        this.setupEventListeners();
        this.setupCharCounters();
        this.displayStoredHistory();
    }

    // Configuração de Event Listeners
    setupEventListeners() {
        // Navegação entre abas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Chat para Questões
        const questoesInput = document.getElementById('questoes-input');
        const questoesSend = document.getElementById('questoes-send');
        const questoesClear = document.getElementById('questoes-clear');

        questoesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage('questoes');
            }
        });

        questoesSend.addEventListener('click', () => this.sendMessage('questoes'));
        questoesClear.addEventListener('click', () => this.clearHistory('questoes'));

        // Chat para Diálogos
        const dialogosInput = document.getElementById('dialogos-input');
        const dialogosSend = document.getElementById('dialogos-send');
        const dialogosClear = document.getElementById('dialogos-clear');

        dialogosInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage('dialogos');
            }
        });

        dialogosSend.addEventListener('click', () => this.sendMessage('dialogos'));
        dialogosClear.addEventListener('click', () => this.clearHistory('dialogos'));

        // Geração de Imagens
        const imagensInput = document.getElementById('imagens-input');
        const imagensGenerate = document.getElementById('imagens-generate');
        const imagensClear = document.getElementById('imagens-clear');

        imagensInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.generateImage();
            }
        });

        imagensGenerate.addEventListener('click', () => this.generateImage());
        imagensClear.addEventListener('click', () => this.clearHistory('imagens'));

        // Menu mobile
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleMobileMenu);
        }
    }

    // Configuração de contadores de caracteres
    setupCharCounters() {
        const inputs = [
            { input: 'questoes-input', max: 500 },
            { input: 'dialogos-input', max: 500 },
            { input: 'imagens-input', max: 300 }
        ];

        inputs.forEach(({ input, max }) => {
            const inputElement = document.getElementById(input);
            if (inputElement) {
                inputElement.addEventListener('input', (e) => {
                    this.updateCharCounter(e.target, max);
                });
            }
        });
    }

    // Atualizar contador de caracteres
    updateCharCounter(input, maxLength) {
        const currentLength = input.value.length;
        const counter = input.closest('.tab-panel').querySelector('.char-count');
        
        if (counter) {
            counter.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else if (currentLength > maxLength * 0.7) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#64748b';
            }
        }
    }

    // Navegação entre abas
    switchTab(tabId) {
        // Atualizar botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Atualizar painéis
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.currentTab = tabId;
    }

    // Enviar mensagem nos chats
    async sendMessage(type) {
        const input = document.getElementById(`${type}-input`);
        const message = input.value.trim();

        if (!message || this.isProcessing) return;

        this.isProcessing = true;
        this.showLoading();

        // Adicionar mensagem do usuário
        this.addMessage(type, message, 'user');
        input.value = '';
        this.updateCharCounter(input, type === 'imagens' ? 300 : 500);

        // Simular processamento da IA
        await this.simulateAIProcessing();

        // Gerar resposta da IA
        const aiResponse = this.generateAIResponse(type, message);
        this.addMessage(type, aiResponse, 'bot');

        // Salvar conversa
        this.saveConversation(type, message, aiResponse);

        this.hideLoading();
        this.isProcessing = false;
    }

    // Adicionar mensagem ao chat
    addMessage(type, content, sender) {
        const messagesContainer = document.getElementById(`${type}-messages`);
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Gerar resposta da IA baseada no tipo e mensagem
    generateAIResponse(type, message) {
        const lowerCaseMessage = message.toLowerCase();
        let response = "";

        if (type === 'questoes') {
            if (lowerCaseMessage.includes('inteligência artificial') || lowerCaseMessage.includes('ia')) {
                response = 'A Inteligência Artificial (IA) é um campo da ciência da computação que se dedica a criar sistemas capazes de simular a inteligência humana. Isso inclui aprender, raciocinar, resolver problemas, perceber e até mesmo compreender a linguagem. Ela se manifesta em diversas áreas, como aprendizado de máquina, processamento de linguagem natural e visão computacional. Por exemplo, quando seu celular reconhece seu rosto ou quando um assistente virtual responde às suas perguntas, a IA está em ação. Qual aspecto específico da IA você gostaria de aprofundar?';
            } else if (lowerCaseMessage.includes('aprender') || lowerCaseMessage.includes('estudar')) {
                response = 'Para otimizar seu aprendizado, sugiro algumas estratégias: 1. **Divida o conteúdo:** Quebre tópicos complexos em partes menores e mais gerenciáveis. 2. **Pratique ativamente:** Em vez de apenas ler, tente resolver problemas, fazer resumos ou explicar o conteúdo para outra pessoa. 3. **Revise regularmente:** A repetição espaçada ajuda a fixar o conhecimento. 4. **Use recursos variados:** Livros, vídeos, artigos e, claro, IAs como esta para tirar dúvidas. Posso te ajudar a encontrar recursos ou explicar conceitos específicos que você esteja estudando.';
            } else if (lowerCaseMessage.includes('dúvida') || lowerCaseMessage.includes('pergunta')) {
                response = 'Claro! Pode me dizer qual é a sua dúvida? Estou aqui para ajudar a esclarecer qualquer conceito ou questão que você tenha. Por favor, seja o mais específico possível para que eu possa fornecer a melhor explicação.';
            } else if (lowerCaseMessage.includes('história da ia')) {
                response = 'A história da IA é fascinante! Começou com conceitos teóricos na década de 1940 e 50, com figuras como Alan Turing. O termo "Inteligência Artificial" foi cunhado em 1956. Houve períodos de "inverno da IA" devido a expectativas não atendidas, mas avanços em poder computacional e dados ressuscitaram o campo, levando ao boom atual do aprendizado de máquina e redes neurais. Quer saber mais sobre alguma fase específica?';
            } else if (lowerCaseMessage.includes('algoritmo')) {
                response = 'Um algoritmo é uma sequência finita de instruções bem definidas e não ambíguas, que são executadas para resolver um problema ou realizar uma tarefa. Pense nele como uma receita: cada passo deve ser claro e levar a um resultado previsível. Em IA, algoritmos são a base para o aprendizado de máquina, permitindo que os sistemas processem dados e tomem decisões. Existem muitos tipos, como algoritmos de classificação, regressão e agrupamento. Gostaria de um exemplo de algum tipo específico?';
            } else {
                const genericResponses = [
                    `Excelente pergunta! Para responder sobre "${message.substring(0, 50)}...", é importante primeiro entender o contexto. Deixe-me explicar de forma clara e objetiva.`,
                    `Ótima questão! Sua pergunta sobre "${message.substring(0, 50)}..." toca em um ponto muito importante. Vou dar uma resposta direta e prática.`,
                    `Interessante! Essa é uma dúvida comum. Vou explicar de forma simples e com exemplos práticos.`,
                    `Perfeito! Essa é uma dúvida comum sobre "${message.substring(0, 50)}...". Vou explicar de forma simples e com exemplos práticos.`
                ];
                response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }
        } else if (type === 'dialogos') {
            if (lowerCaseMessage.includes('machine learning') || lowerCaseMessage.includes('aprendizado de máquina')) {
                response = 'Machine Learning (Aprendizado de Máquina) é um subcampo da Inteligência Artificial que se concentra no desenvolvimento de algoritmos que permitem aos computadores aprender com dados, sem serem explicitamente programados para cada tarefa. Em vez de seguir instruções fixas, eles identificam padrões e fazem previsões ou decisões. Existem três tipos principais: **Aprendizado Supervisionado** (com dados rotulados), **Não Supervisionado** (com dados não rotulados) e **Aprendizado por Reforço** (aprende por tentativa e erro). Qual desses tipos você gostaria de explorar mais a fundo?';
            } else if (lowerCaseMessage.includes('redes neurais') || lowerCaseMessage.includes('deep learning')) {
                response = 'Redes Neurais Artificiais são modelos computacionais inspirados na estrutura e funcionamento do cérebro humano. Elas são compostas por camadas de "neurônios" interconectados que processam informações. O Deep Learning (Aprendizado Profundo) é um tipo de Machine Learning que utiliza redes neurais com muitas camadas (daí o "profundo"), permitindo que aprendam representações complexas de dados, como imagens, sons e textos. Elas são a base para avanços em reconhecimento de fala, visão computacional e processamento de linguagem natural. Quer um exemplo de como elas funcionam?';
            } else if (lowerCaseMessage.includes('processamento de linguagem natural') || lowerCaseMessage.includes('nlp')) {
                response = 'Processamento de Linguagem Natural (PLN ou NLP) é a área da Inteligência Artificial que se dedica a permitir que computadores compreendam, interpretem e gerem a linguagem humana de forma significativa. É o que possibilita assistentes virtuais, tradutores automáticos e análise de sentimentos em textos. O PLN envolve técnicas como tokenização, análise sintática e semântica. Qual aplicação do PLN mais te interessa?';
            } else if (lowerCaseMessage.includes('ética na ia') || lowerCaseMessage.includes('viés')) {
                response = 'A ética na IA é um tópico crucial e complexo. Envolve questões sobre como garantir que os sistemas de IA sejam justos, transparentes e responsáveis. O viés (bias) é um grande desafio, pois os modelos de IA podem aprender e amplificar preconceitos presentes nos dados de treinamento, levando a decisões discriminatórias. Discutir e implementar diretrizes éticas é fundamental para o desenvolvimento de IAs benéficas para a sociedade. Que tipo de dilema ético na IA você gostaria de discutir?';
            } else if (lowerCaseMessage.includes('futuro da ia')) {
                response = 'O futuro da IA é um tema de muita especulação e inovação! Espera-se que a IA continue a transformar indústrias, desde a medicina e transporte até a educação e entretenimento. Veremos avanços em IA generativa, robótica mais autônoma e sistemas de IA mais integrados ao nosso dia a dia. No entanto, também há debates sobre os impactos sociais, econômicos e éticos. O que você imagina para o futuro da IA?';
            } else {
                const genericResponses = [
                    `Que tópico fascinante! Vamos explorar "${message.substring(0, 50)}..." de forma mais aprofundada. Este assunto tem várias camadas interessantes que podemos discutir. O que você gostaria de saber especificamente?`,
                    `Adorei sua abordagem sobre "${message.substring(0, 50)}..."! Este é um tema que permite uma discussão rica e detalhada. Podemos começar pelos fundamentos e depois expandir para aplicações práticas.`,
                    `Excelente escolha de tópico! "${message.substring(0, 50)}..." é um assunto que oferece muitas oportunidades de aprendizado. Vamos construir um entendimento sólido juntos.`,
                    `Muito interessante! O tema "${message.substring(0, 50)}..." é realmente envolvente e tem muitas facetas para explorarmos. Posso oferecer diferentes perspectivas e exemplos práticos. Vamos fazer desta uma conversa educativa e produtiva!`
                ];
                response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }
        }
        return response;
    }

    // Gerar imagem (simulação)
    async generateImage() {
        const input = document.getElementById('imagens-input');
        const prompt = input.value.trim();

        if (!prompt || this.isProcessing) return;

        this.isProcessing = true;
        this.showLoading();

        // Simular processamento
        await this.simulateAIProcessing(3000);

        // Criar imagem simulada
        const imageResult = document.getElementById('image-result');
        imageResult.innerHTML = `
            <div class="generated-image-container">
                <div class="generated-image-placeholder">
                    <i class="fas fa-image" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <h4>Imagem Gerada com Sucesso!</h4>
                    <p><strong>Prompt:</strong> ${prompt}</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 1rem;">
                        Esta é uma simulação. Em um ambiente real, aqui apareceria a imagem gerada pela IA baseada na sua descrição.
                    </p>
                    <button class="download-btn" onclick="aiPlatform.downloadImage('${prompt}')">
                        <i class="fas fa-download"></i> Baixar Imagem
                    </button>
                </div>
            </div>
        `;

        // Salvar no histórico
        this.saveImageGeneration(prompt);

        input.value = '';
        this.updateCharCounter(input, 300);

        this.hideLoading();
        this.isProcessing = false;
    }

    // Simular processamento da IA
    simulateAIProcessing(duration = 2000) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // Salvar conversa
    saveConversation(type, userMessage, aiResponse) {
        const conversation = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userMessage,
            aiResponse
        };

        this.conversations[type].push(conversation);
        this.saveToLocalStorage();
        this.updateHistoryDisplay(type);
    }

    // Salvar geração de imagem
    saveImageGeneration(prompt) {
        const generation = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            prompt,
            type: 'image'
        };

        this.conversations.imagens.push(generation);
        this.saveToLocalStorage();
        this.updateHistoryDisplay('imagens');
    }

    // Atualizar exibição do histórico
    updateHistoryDisplay(type) {
        const historyContainer = document.getElementById(`${type}-history`);
        const conversations = this.conversations[type];

        if (conversations.length === 0) {
            historyContainer.innerHTML = '<p class="no-history">Nenhuma conversa ainda</p>';
            return;
        }

        historyContainer.innerHTML = conversations
            .slice(-10) // Mostrar apenas os últimos 10
            .reverse()
            .map(conv => {
                if (type === 'imagens') {
                    return `
                        <div class="history-item" onclick="aiPlatform.loadImageGeneration('${conv.prompt}')">
                            <div class="history-item-title">Imagem Gerada</div>
                            <div class="history-item-preview">${conv.prompt.substring(0, 50)}...</div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="history-item" onclick="aiPlatform.loadConversation('${type}', ${conv.id})">
                            <div class="history-item-title">${conv.userMessage.substring(0, 30)}...</div>
                            <div class="history-item-preview">${conv.aiResponse.substring(0, 50)}...</div>
                        </div>
                    `;
                }
            })
            .join('');
    }

    // Carregar conversa do histórico
    loadConversation(type, conversationId) {
        const conversation = this.conversations[type].find(conv => conv.id === conversationId);
        if (!conversation) return;

        // Limpar chat atual
        const messagesContainer = document.getElementById(`${type}-messages`);
        messagesContainer.innerHTML = '';

        // Adicionar mensagem inicial da IA
        this.addMessage(type, this.getInitialMessage(type), 'bot');

        // Adicionar conversa carregada
        this.addMessage(type, conversation.userMessage, 'user');
        this.addMessage(type, conversation.aiResponse, 'bot');
    }

    // Carregar geração de imagem do histórico
    loadImageGeneration(prompt) {
        document.getElementById('imagens-input').value = prompt;
        this.updateCharCounter(document.getElementById('imagens-input'), 300);
    }

    // Obter mensagem inicial da IA
    getInitialMessage(type) {
        const messages = {
            questoes: 'Olá! Sou sua IA especializada em responder questões. Faça uma pergunta sobre qualquer assunto que você está estudando!',
            dialogos: 'Olá! Sou sua IA especializada em diálogos educacionais. Posso explicar conceitos complexos, dar exemplos práticos e manter uma conversa detalhada sobre seus estudos!'
        };
        return messages[type];
    }

    // Limpar histórico
    clearHistory(type) {
        if (confirm(`Tem certeza que deseja limpar todo o histórico de ${type}?`)) {
            this.conversations[type] = [];
            this.saveToLocalStorage();
            this.updateHistoryDisplay(type);

            // Limpar chat atual
            const messagesContainer = document.getElementById(`${type}-messages`);
            messagesContainer.innerHTML = '';

            // Adicionar mensagem inicial
            if (type !== 'imagens') {
                this.addMessage(type, this.getInitialMessage(type), 'bot');
            }

            // Limpar resultado de imagem se for o tipo imagens
            if (type === 'imagens') {
                document.getElementById('image-result').innerHTML = `
                    <div class="placeholder-image">
                        <i class="fas fa-image"></i>
                        <p>Suas imagens geradas aparecerão aqui</p>
                    </div>
                `;
            }
        }
    }

    // Baixar imagem (simulação)
    downloadImage(prompt) {
        // Simular download
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Imagem gerada com prompt: ${prompt}`);
        link.download = `ia-imagem-${Date.now()}.txt`;
        link.click();

        // Mostrar notificação
        this.showNotification('Download iniciado! (Esta é uma simulação)', 'success');
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Mostrar loading
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    // Esconder loading
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    // Toggle menu mobile
    toggleMobileMenu() {
        // Implementar se necessário
        console.log('Menu mobile toggled');
    }

    // Salvar dados no localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('aiStudyPlatform', JSON.stringify(this.conversations));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    // Carregar dados do localStorage
    loadStoredData() {
        try {
            const stored = localStorage.getItem('aiStudyPlatform');
            if (stored) {
                this.conversations = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.conversations = { questoes: [], dialogos: [], imagens: [] };
        }
    }

    // Exibir histórico armazenado
    displayStoredHistory() {
        Object.keys(this.conversations).forEach(type => {
            this.updateHistoryDisplay(type);
        });

        // Adicionar mensagens iniciais se não houver histórico
        ['questoes', 'dialogos'].forEach(type => {
            const messagesContainer = document.getElementById(`${type}-messages`);
            if (messagesContainer && messagesContainer.children.length === 0) {
                this.addMessage(type, this.getInitialMessage(type), 'bot');
            }
        });
    }
}

// Adicionar estilos para notificações
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--surface-color);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    }

    .notification-success {
        border-left: 4px solid var(--secondary-color);
        color: var(--secondary-color);
    }

    .notification-info {
        border-left: 4px solid var(--primary-color);
        color: var(--primary-color);
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .generated-image-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .generated-image-placeholder {
        text-align: center;
        max-width: 400px;
    }

    .download-btn {
        background: var(--secondary-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .download-btn:hover {
        background: #059669;
        transform: translateY(-1px);
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Inicializar a plataforma quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.aiPlatform = new AIStudyPlatform();
});

// Exportar para uso global
window.AIStudyPlatform = AIStudyPlatform;

