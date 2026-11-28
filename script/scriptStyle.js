// Dados de exemplo das duas listas.
const competicoes = [
    {
        id: "circuito",
        nome: "Circuito Velocidade 2026",
        modalidade: "Atletismo",
        data: "21/06/2026",
        local: "São Paulo, SP",
        capacidade: 40,
        idsInscritos: ["marina", "aisha", "lucas"]
    },
    {
        id: "desafio",
        nome: "Desafio das Capitais",
        modalidade: "Corrida de rua",
        data: "12/07/2026",
        local: "Rio de Janeiro, RJ",
        capacidade: 80,
        idsInscritos: ["marina", "henrique"]
    },
    {
        id: "open-sul",
        nome: "Open Sul de Pista",
        modalidade: "100m rasos",
        data: "17/05/2026",
        local: "Curitiba, PR",
        capacidade: 24,
        idsInscritos: ["marina", "camila", "aisha"]
    },
    {
        id: "trofeu",
        nome: "Troféu Nacional 2025",
        modalidade: "Atletismo",
        data: "09/11/2025",
        local: "Belo Horizonte, MG",
        capacidade: 32,
        idsInscritos: ["marina", "lucas", "camila"]
    }
];

const atletas = [
    { id: "marina", nome: "Marina Costa", modalidade: "100m rasos", idade: 28, nacionalidade: "Brasil" },
    { id: "lucas", nome: "Lucas Mendes", modalidade: "Maratona", dataNascimento: "1995-09-02", nacionalidade: "Portugal" },
    { id: "aisha", nome: "Aisha Diallo", modalidade: "Salto em distância", idade: 26, nacionalidade: "Senegal" },
    { id: "henrique", nome: "Henrique Alves", modalidade: "Corrida de rua", idade: 24, nacionalidade: "Brasil" },
    { id: "camila", nome: "Camila Rojas", modalidade: "Atletismo", idade: 28, nacionalidade: "Chile" }
];

const abas = document.querySelectorAll(".abas button");
const navegacao = document.getElementById("navegacao");
const lista = document.getElementById("lista");
const relatorio = document.getElementById("relatorio");
const inPesquisa = document.getElementById("inPesquisa");
const slModalidades = document.getElementById("slModalidades");
const cards = document.getElementById("cards");
const modeloCard = document.getElementById("modeloCard");
const btnAdicionar = document.getElementById("btnAdicionar");
const cardAdicionar = document.getElementById("cardAdicionar");
const semResultados = document.getElementById("semResultados");
const sucessoCadastro = document.getElementById("sucessoCadastro");

const perfilCompeticao = document.getElementById("perfilCompeticao");
const tituloPerfil = document.getElementById("tituloPerfil");
const mensagemPerfil = document.getElementById("mensagemPerfil");
const btnEditarCompeticao = document.getElementById("editarCompeticao");
const btnInscrever = document.getElementById("btnInscrever");
const avisoInscricao = document.getElementById("avisoInscricao");
const formInscricao = document.getElementById("formInscricao");
const atletaInscricao = document.getElementById("atletaInscricao");
const pesquisaInscritos = document.getElementById("pesquisaInscritos");
const linhasInscritos = document.getElementById("linhasInscritos");
const modeloInscrito = document.getElementById("modeloInscrito");

const perfilAtleta = document.getElementById("perfilAtleta");
const tituloPerfilAtleta = document.getElementById("tituloPerfilAtleta");
const btnVoltarDoPerfilAtleta = document.getElementById("voltarDoPerfilAtleta");
const btnEditarAtleta = document.getElementById("editarAtleta");
const competicoesDoAtleta = document.getElementById("competicoesDoAtleta");
const modeloCompeticaoDoAtleta = document.getElementById("modeloCompeticaoDoAtleta");
const mensagemPerfilAtleta = document.getElementById("mensagemPerfilAtleta");

const cadastroCompeticao = document.getElementById("cadastroCompeticao");
const formCompeticao = document.getElementById("formCompeticao");
const nomeCompeticao = document.getElementById("nomeCompeticao");
const dataCompeticao = document.getElementById("dataCompeticao");
const localCompeticao = document.getElementById("localCompeticao");
const modalidadeCompeticao = document.getElementById("modalidadeCompeticao");
const vagasCompeticao = document.getElementById("vagasCompeticao");
const erroCadastro = document.getElementById("erroCadastro");
const prefixoCompeticoes = "gestaoCompeticoes.cadastro.";

const cadastroAtleta = document.getElementById("cadastroAtleta");
const formAtleta = document.getElementById("formAtleta");
const nomeAtleta = document.getElementById("nomeAtleta");
const nascimentoAtleta = document.getElementById("nascimentoAtleta");
const paisAtleta = document.getElementById("paisAtleta");
const modalidadeAtleta = document.getElementById("modalidadeAtleta");
const erroCadastroAtleta = document.getElementById("erroCadastroAtleta");
const prefixoAtletas = "gestaoCompeticoes.atleta.";
const cadastrosLidos = {};

let abaAtual;
let botaoQueAbriuCadastro;
let competicaoAberta = null;
let atletaAberto = null;

function normalizar(texto) {
    // Separa os acentos das letras para que a busca possa ignorá-los.
    const textoSeparado = texto.toLowerCase().normalize("NFD");
    return textoSeparado.replace(/[\u0300-\u036f]/g, "");
}

function preencherModalidades(itens, seletor) {
    const modalidades = [];

    for (let i = 0; i < itens.length; i++) {
        const modalidade = itens[i].modalidade;

        // Adiciona cada modalidade apenas uma vez ao seletor.
        if (!modalidades.includes(modalidade)) {
            modalidades.push(modalidade);
            const opcao = document.createElement("option");
            opcao.value = modalidade;
            opcao.textContent = modalidade;
            seletor.appendChild(opcao);
        }
    }
}

function atualizarFiltroModalidades(itens) {
    slModalidades.options.length = 1;
    slModalidades.value = "";
    preencherModalidades(itens, slModalidades);
}

function manterFiltroModalidades(itens) {
    const modalidade = slModalidades.value;
    atualizarFiltroModalidades(itens);
    slModalidades.value = modalidade;
    if (slModalidades.selectedIndex === -1) {
        slModalidades.value = "";
    }
}

function formatarData(data) {
    const partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function calcularIdade(dataNascimento) {
    const partes = dataNascimento.split("-");
    const anoNascimento = Number(partes[0]);
    const mesNascimento = Number(partes[1]);
    const diaNascimento = Number(partes[2]);
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    let idade = hoje.getFullYear() - anoNascimento;

    // Desconta um ano se o aniversário deste ano ainda não chegou.
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < diaNascimento)) {
        idade--;
    }

    return idade;
}

function idadeDoAtleta(atleta) {
    if (atleta.dataNascimento) {
        return calcularIdade(atleta.dataNascimento);
    }
    return atleta.idade;
}

function textoIdade(atleta) {
    const idade = idadeDoAtleta(atleta);
    if (idade === 1) {
        return "1 ano";
    }
    return idade + " anos";
}

function iniciaisDoNome(nome) {
    // Usa a primeira letra do primeiro nome e do último sobrenome.
    const nomes = nome.trim().split(/\s+/);
    let letras = nomes[0].charAt(0);
    if (nomes.length > 1) {
        const ultimoNome = nomes[nomes.length - 1];
        letras = letras + ultimoNome.charAt(0);
    }
    return letras.toUpperCase();
}

function contarProvas(atleta) {
    let provas = 0;
    for (let i = 0; i < competicoes.length; i++) {
        if (competicoes[i].idsInscritos.includes(atleta.id)) {
            provas++;
        }
    }
    return provas;
}

function criarCard(item) {
    // Copia o modelo do index.html e preenche os textos do card.
    const card = modeloCard.content.firstElementChild.cloneNode(true);
    const resumo = card.querySelector(".card-resumo");
    const primeiraInfo = card.querySelector(".card-primeira-info");
    const segundaInfo = card.querySelector(".card-segunda-info");
    const acao = card.querySelector("button");

    card.querySelector("h2").textContent = item.nome;
    card.querySelector(".card-etiqueta").textContent = item.modalidade;

    if (abaAtual === "atletas") {
        card.classList.add("card-atleta");

        const iniciais = card.querySelector(".card-iniciais");
        iniciais.textContent = iniciaisDoNome(item.nome);
        iniciais.hidden = false;

        const provas = contarProvas(item);
        if (provas === 1) {
            resumo.textContent = "1 prova";
        } else {
            resumo.textContent = provas + " provas";
        }
        primeiraInfo.textContent = "Idade: " + textoIdade(item);
        segundaInfo.textContent = "Nacionalidade: " + item.nacionalidade;
        acao.textContent = "Ver ficha";
        acao.id = "ver-ficha-" + item.id;
        acao.setAttribute("aria-label", "Ver ficha de " + item.nome);
        acao.addEventListener("click", function () {
            abrirPerfilAtleta(item);
        });
    } else {
        const inscritos = item.idsInscritos.length;
        const vagas = item.capacidade - inscritos;
        let unidade = "vagas";
        if (vagas === 1) {
            unidade = "vaga";
        }
        resumo.textContent = inscritos + "/" + item.capacidade + " inscritos (" + vagas + " " + unidade + ")";
        primeiraInfo.textContent = "Data: " + item.data;
        segundaInfo.textContent = "Local: " + item.local;
        acao.textContent = "Gerenciar inscritos";
        acao.id = "gerenciar-" + item.id;
        acao.setAttribute("aria-label", "Gerenciar inscritos em " + item.nome);
        acao.addEventListener("click", function () {
            abrirPerfil(item);
        });
    }

    return card;
}

function mostrarCards() {
    let itens = competicoes;
    if (abaAtual === "atletas") {
        itens = atletas;
    }

    const pesquisa = normalizar(inPesquisa.value.trim());
    const modalidade = slModalidades.value;
    let encontrados = 0;

    sucessoCadastro.hidden = true;
    cards.textContent = "";

    for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        let lugar = item.local;
        if (abaAtual === "atletas") {
            lugar = item.nacionalidade;
        }

        const achouNome = normalizar(item.nome).includes(pesquisa);
        const achouLugar = normalizar(lugar).includes(pesquisa);
        const achouModalidade = modalidade === "" || modalidade === item.modalidade;

        // O card precisa passar pela busca e pelo filtro de modalidade.
        if ((achouNome || achouLugar) && achouModalidade) {
            cards.appendChild(criarCard(item));
            encontrados++;
        }
    }

    semResultados.hidden = encontrados > 0;
    cards.appendChild(cardAdicionar);
}

function mostrarRelatorio() {
    const linhas = document.getElementById("linhasRelatorio");
    let totalVagas = 0;
    let totalDisponiveis = 0;
    let totalOcupadas = 0;

    linhas.textContent = "";

    for (let i = 0; i < competicoes.length; i++) {
        const competicao = competicoes[i];
        const inscritos = competicao.idsInscritos.length;
        const disponiveis = competicao.capacidade - inscritos;
        const linha = linhas.insertRow();
        const nome = document.createElement("th");
        nome.scope = "row";
        nome.textContent = competicao.nome;
        linha.appendChild(nome);
        linha.insertCell().textContent = competicao.capacidade;
        linha.insertCell().textContent = disponiveis;
        linha.insertCell().textContent = inscritos;

        totalVagas += competicao.capacidade;
        totalDisponiveis += disponiveis;
        totalOcupadas += inscritos;
    }

    document.getElementById("totalVagas").textContent = totalVagas;
    document.getElementById("totalDisponiveis").textContent = totalDisponiveis;
    document.getElementById("totalOcupadas").textContent = totalOcupadas;
}

function mostrarAba(aba) {
    if (aba === abaAtual) {
        return;
    }

    abaAtual = aba;
    for (let i = 0; i < abas.length; i++) {
        const botao = abas[i];
        if (botao.getAttribute("data-aba") === aba) {
            botao.setAttribute("aria-pressed", "true");
        } else {
            botao.setAttribute("aria-pressed", "false");
        }
    }

    if (aba === "relatorio") {
        lista.hidden = true;
        relatorio.hidden = false;
        mostrarRelatorio();
        return;
    }

    lista.hidden = false;
    relatorio.hidden = true;

    let itens = competicoes;
    let titulo = "Competições";
    let textoBusca = "Buscar competição ou local";
    let textoAdicionar = "Adicionar Competição";
    let mensagem = "Nenhuma competição encontrada.";

    if (aba === "atletas") {
        itens = atletas;
        titulo = "Atletas";
        textoBusca = "Buscar atleta ou país";
        textoAdicionar = "Adicionar Atleta";
        mensagem = "Nenhum atleta encontrado.";
    }

    lista.setAttribute("aria-label", titulo);
    inPesquisa.value = "";
    inPesquisa.placeholder = textoBusca + "...";
    inPesquisa.setAttribute("aria-label", textoBusca);
    btnAdicionar.textContent = "+ " + textoAdicionar;
    document.getElementById("textoCardAdicionar").textContent = textoAdicionar;
    semResultados.textContent = mensagem;

    atualizarFiltroModalidades(itens);
    mostrarCards();
}

function clicarNaAba(evento) {
    const botao = evento.currentTarget;
    const aba = botao.getAttribute("data-aba");
    mostrarAba(aba);
}

function indicePorId(itens, id) {
    for (let i = 0; i < itens.length; i++) {
        if (itens[i].id === id) {
            return i;
        }
    }
    return -1;
}

// Perfil da competição e controle de inscrições.
function diasAteCompeticao(data) {
    const partes = data.split("/");
    const hoje = new Date();
    const diaAtual = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const diaCompeticao = Date.UTC(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    // Conta dias de calendário, independentemente da hora atual.
    return (diaCompeticao - diaAtual) / 86400000;
}

function detalhesDaCompeticao(competicao) {
    return competicao.data + " · " + competicao.local + " · " + competicao.modalidade;
}

function mostrarMensagemPerfil(mensagem, ehErro, elemento = mensagemPerfil) {
    elemento.textContent = mensagem;
    elemento.classList.toggle("erro-perfil", ehErro);
    elemento.hidden = mensagem === "";
}

function mostrarInscritos() {
    const busca = normalizar(pesquisaInscritos.value.trim());
    const idsInscritos = competicaoAberta.idsInscritos;
    linhasInscritos.textContent = "";

    for (let i = 0; i < idsInscritos.length; i++) {
        const indice = indicePorId(atletas, idsInscritos[i]);
        if (indice === -1) {
            continue;
        }
        const atleta = atletas[indice];
        if (!normalizar(atleta.nome).includes(busca)) {
            continue;
        }

        const linha = modeloInscrito.content.firstElementChild.cloneNode(true);
        linha.cells[0].textContent = atleta.nome;
        linha.cells[1].textContent = idadeDoAtleta(atleta);
        linha.cells[2].textContent = atleta.nacionalidade;
        linha.cells[3].textContent = atleta.modalidade;

        const ficha = linha.querySelector(".ficha-inscrito");
        ficha.id = "ficha-inscrito-" + atleta.id;
        ficha.setAttribute("aria-label", "Ver ficha de " + atleta.nome);
        ficha.addEventListener("click", function () {
            abrirPerfilAtleta(atleta);
        });

        const remover = linha.querySelector(".remover-inscrito");
        remover.setAttribute("aria-label", "Remover inscrição de " + atleta.nome);
        remover.addEventListener("click", function () {
            removerInscrito(atleta);
        });
        linhasInscritos.appendChild(linha);
    }

    if (linhasInscritos.rows.length === 0) {
        const celula = linhasInscritos.insertRow().insertCell();
        celula.colSpan = 5;
        if (idsInscritos.length === 0) {
            celula.textContent = "Nenhum atleta inscrito.";
        } else {
            celula.textContent = "Nenhum inscrito encontrado.";
        }
    }
}

function fecharInscricao() {
    formInscricao.hidden = true;
    btnInscrever.setAttribute("aria-expanded", "false");
    atletaInscricao.value = "";
}

function atualizarOpcoesInscricao(vagas) {
    atletaInscricao.options.length = 1;
    atletaInscricao.value = "";

    for (let i = 0; i < atletas.length; i++) {
        const atleta = atletas[i];
        if (!competicaoAberta.idsInscritos.includes(atleta.id)) {
            const opcao = document.createElement("option");
            opcao.value = atleta.id;
            opcao.textContent = atleta.nome + " · " + atleta.modalidade;
            atletaInscricao.appendChild(opcao);
        }
    }

    avisoInscricao.textContent = "";
    if (vagas === 0) {
        avisoInscricao.textContent = "Todas as vagas estão ocupadas.";
    } else if (atletas.length === 0) {
        avisoInscricao.textContent = "Cadastre um atleta para fazer uma inscrição.";
    } else if (atletaInscricao.options.length === 1) {
        avisoInscricao.textContent = "Todos os atletas cadastrados já estão inscritos.";
    }
    btnInscrever.disabled = avisoInscricao.textContent !== "";
    avisoInscricao.hidden = !btnInscrever.disabled;
    if (btnInscrever.disabled) {
        fecharInscricao();
    }
}

function atualizarPerfil() {
    const vagas = competicaoAberta.capacidade - competicaoAberta.idsInscritos.length;
    tituloPerfil.textContent = competicaoAberta.nome;
    document.getElementById("informacoesPerfil").textContent = detalhesDaCompeticao(competicaoAberta);
    document.getElementById("vagasPerfil").textContent = vagas;
    document.getElementById("textoVagasPerfil").textContent = "Vagas Disponíveis (de " + competicaoAberta.capacidade + ")";
    document.getElementById("diasPerfil").textContent = Math.max(0, diasAteCompeticao(competicaoAberta.data));
    atualizarOpcoesInscricao(vagas);
    mostrarInscritos();
}

function abrirPerfil(competicao) {
    competicaoAberta = competicao;
    pesquisaInscritos.value = "";
    fecharInscricao();
    mostrarMensagemPerfil("", false);
    atualizarPerfil();

    navegacao.hidden = true;
    lista.hidden = true;
    perfilCompeticao.hidden = false;
    window.scrollTo(0, 0);
    tituloPerfil.focus();
}

function voltarDoPerfil() {
    const id = competicaoAberta.id;
    competicaoAberta = null;
    perfilCompeticao.hidden = true;
    navegacao.hidden = false;
    lista.hidden = false;

    manterFiltroModalidades(competicoes);
    mostrarCards();

    const botaoDoCard = document.getElementById("gerenciar-" + id);
    if (botaoDoCard) {
        botaoDoCard.focus();
    } else {
        btnAdicionar.focus();
    }
}

function alternarInscricao() {
    if (formInscricao.hidden) {
        formInscricao.hidden = false;
        btnInscrever.setAttribute("aria-expanded", "true");
        atletaInscricao.focus();
    } else {
        fecharInscricao();
        btnInscrever.focus();
    }
}

function salvarInscritos(novosInscritos) {
    const inscritosAnteriores = competicaoAberta.idsInscritos;
    competicaoAberta.idsInscritos = novosInscritos;
    const erro = guardarCadastro(prefixoCompeticoes, competicaoAberta.id, competicaoAberta);
    if (erro) {
        competicaoAberta.idsInscritos = inscritosAnteriores;
        mostrarMensagemPerfil(erro, true);
        return false;
    }
    return true;
}

function inscreverAtleta(evento) {
    evento.preventDefault();
    const id = atletaInscricao.value;
    const inscritos = competicaoAberta.idsInscritos;
    if (inscritos.length >= competicaoAberta.capacidade || inscritos.includes(id) || indicePorId(atletas, id) === -1) {
        mostrarMensagemPerfil("Selecione um atleta disponível para uma vaga livre.", true);
        return;
    }

    const novosInscritos = inscritos.slice();
    novosInscritos.push(id);
    if (salvarInscritos(novosInscritos)) {
        fecharInscricao();
        pesquisaInscritos.value = "";
        atualizarPerfil();
        mostrarMensagemPerfil("Atleta inscrito.", false);
        if (btnInscrever.disabled) {
            tituloPerfil.focus();
        } else {
            btnInscrever.focus();
        }
    }
}

function removerInscrito(atleta) {
    if (!window.confirm("Remover a inscrição de " + atleta.nome + " nesta competição?")) {
        return;
    }

    const novosInscritos = competicaoAberta.idsInscritos.slice();
    const indice = novosInscritos.indexOf(atleta.id);
    if (indice !== -1) {
        novosInscritos.splice(indice, 1);
        if (salvarInscritos(novosInscritos)) {
            atualizarPerfil();
            mostrarMensagemPerfil("Inscrição removida.", false);
            tituloPerfil.focus();
        }
    }
}

function excluirCompeticao() {
    if (!window.confirm("Excluir “" + competicaoAberta.nome + "” e todas as suas inscrições?")) {
        return;
    }

    const erro = guardarCadastro(prefixoCompeticoes, competicaoAberta.id, null);
    if (erro) {
        mostrarMensagemPerfil(erro, true);
        return;
    }

    competicoes.splice(indicePorId(competicoes, competicaoAberta.id), 1);
    atualizarContadores();
    voltarDoPerfil();
    sucessoCadastro.textContent = "Competição excluída.";
    sucessoCadastro.hidden = false;
}

// Perfil do atleta e competições em que ele está inscrito.
function atualizarPerfilAtleta() {
    const atleta = atletaAberto;
    let nascimento = "Não informada";
    if (atleta.dataNascimento) {
        nascimento = formatarData(atleta.dataNascimento);
    }
    document.getElementById("nomePerfilAtleta").textContent = atleta.nome;
    document.getElementById("nascimentoPerfilAtleta").textContent = nascimento + " (" + textoIdade(atleta) + ")";
    document.getElementById("paisPerfilAtleta").textContent = atleta.nacionalidade;
    document.getElementById("modalidadePerfilAtleta").textContent = atleta.modalidade;
    document.getElementById("iniciaisPerfilAtleta").textContent = iniciaisDoNome(atleta.nome);
    competicoesDoAtleta.textContent = "";

    for (let i = 0; i < competicoes.length; i++) {
        const competicao = competicoes[i];
        if (competicao.idsInscritos.includes(atleta.id)) {
            const item = modeloCompeticaoDoAtleta.content.firstElementChild.cloneNode(true);
            item.querySelector("strong").textContent = competicao.nome;
            item.querySelector("p").textContent = detalhesDaCompeticao(competicao);

            const status = item.querySelector(".status-competicao-atleta");
            status.textContent = "Inscrito";
            if (diasAteCompeticao(competicao.data) < 0) {
                status.textContent = "Participou";
            }
            competicoesDoAtleta.appendChild(item);
        }
    }

    document.getElementById("semCompeticoesAtleta").hidden = competicoesDoAtleta.children.length > 0;
}

function abrirPerfilAtleta(atleta) {
    atletaAberto = atleta;
    mostrarMensagemPerfil("", false, mensagemPerfilAtleta);
    atualizarPerfilAtleta();

    navegacao.hidden = true;
    lista.hidden = true;
    perfilCompeticao.hidden = true;
    perfilAtleta.hidden = false;
    btnVoltarDoPerfilAtleta.textContent = "← Voltar para Atletas";
    if (competicaoAberta) {
        btnVoltarDoPerfilAtleta.textContent = "← Voltar para Competição";
    }
    window.scrollTo(0, 0);
    tituloPerfilAtleta.focus();
}

function voltarDoPerfilAtleta() {
    const id = atletaAberto.id;
    atletaAberto = null;
    perfilAtleta.hidden = true;

    if (competicaoAberta) {
        atualizarPerfil();
        perfilCompeticao.hidden = false;
        const ficha = document.getElementById("ficha-inscrito-" + id);
        if (ficha) {
            ficha.focus();
        } else {
            tituloPerfil.focus();
        }
    } else {
        navegacao.hidden = false;
        lista.hidden = false;
        manterFiltroModalidades(atletas);
        mostrarCards();
        const ficha = document.getElementById("ver-ficha-" + id);
        if (ficha) {
            ficha.focus();
        } else {
            btnAdicionar.focus();
        }
    }
}

function limparInscricoesSemAtleta() {
    // A exclusão fica salva no cadastro do atleta e vale para todas as competições.
    for (let i = 0; i < competicoes.length; i++) {
        const inscritos = competicoes[i].idsInscritos;
        for (let j = inscritos.length - 1; j >= 0; j--) {
            if (indicePorId(atletas, inscritos[j]) === -1) {
                inscritos.splice(j, 1);
            }
        }
    }
}

function excluirAtleta() {
    if (!window.confirm("Excluir “" + atletaAberto.nome + "” e cancelar suas inscrições?")) {
        return;
    }

    const erro = guardarCadastro(prefixoAtletas, atletaAberto.id, null);
    if (erro) {
        mostrarMensagemPerfil(erro, true, mensagemPerfilAtleta);
        return;
    }

    atletas.splice(indicePorId(atletas, atletaAberto.id), 1);
    limparInscricoesSemAtleta();
    atualizarContadores();
    voltarDoPerfilAtleta();

    if (competicaoAberta) {
        mostrarMensagemPerfil("Atleta excluído.", false);
    } else {
        sucessoCadastro.textContent = "Atleta excluído.";
        sucessoCadastro.hidden = false;
    }
}

// Carrega e atualiza os registros salvos no navegador.
function carregarCadastros(itens, prefixo) {
    try {
        const chaves = Object.keys(localStorage).sort();

        // Cada cadastro fica guardado em sua própria chave.
        for (let i = 0; i < chaves.length; i++) {
            const chave = chaves[i];
            if (chave.startsWith(prefixo)) {
                const id = chave.slice(prefixo.length);
                const dados = localStorage.getItem(chave);
                const item = JSON.parse(dados);
                cadastrosLidos[chave] = dados;
                const indice = indicePorId(itens, id);

                // Um registro nulo mantém um cadastro excluído após recarregar.
                if (item === null) {
                    if (indice !== -1) {
                        itens.splice(indice, 1);
                    }
                    continue;
                }

                item.id = id;
                if (prefixo === prefixoCompeticoes && !Array.isArray(item.idsInscritos)) {
                    item.idsInscritos = [];
                }
                if (indice === -1) {
                    itens.push(item);
                } else {
                    itens[indice] = item;
                }
            }
        }
    } catch {
        // A lista ainda pode abrir se o armazenamento estiver indisponível.
    }
}

function criarId() {
    return Date.now() + "-" + Math.random();
}

function guardarCadastro(prefixo, id, item) {
    const chave = prefixo + id;
    try {
        // Preserva alterações feitas em outra aba desde a última leitura.
        const dadosLidos = cadastrosLidos[chave] || null;
        if (localStorage.getItem(chave) !== dadosLidos) {
            return "O cadastro mudou em outra aba. Recarregue a página para ver a versão atual.";
        }

        const dados = JSON.stringify(item);
        localStorage.setItem(chave, dados);
        cadastrosLidos[chave] = dados;
        return "";
    } catch {
        return "Não foi possível salvar a alteração neste navegador.";
    }
}

function atualizarContadores() {
    let rotuloCompeticoes = " competições";
    if (competicoes.length === 1) {
        rotuloCompeticoes = " competição";
    }

    let rotuloAtletas = " atletas";
    if (atletas.length === 1) {
        rotuloAtletas = " atleta";
    }

    document.getElementById("totalCompeticoes").textContent = competicoes.length + rotuloCompeticoes;
    document.getElementById("totalAtletas").textContent = atletas.length + rotuloAtletas;
}

// Os formulários servem tanto para cadastro quanto para edição no perfil.
function abrirCadastro(evento) {
    botaoQueAbriuCadastro = evento.currentTarget;
    sucessoCadastro.hidden = true;

    navegacao.hidden = true;
    lista.hidden = true;
    window.scrollTo(0, 0);

    if (abaAtual === "atletas") {
        mostrarFormularioAtleta();
    } else {
        mostrarFormularioCompeticao();
    }
}

function mostrarFormularioCompeticao() {
    formCompeticao.reset();
    erroCadastro.textContent = "";
    vagasCompeticao.min = 1;
    const titulo = document.getElementById("tituloCadastro");
    const voltar = document.getElementById("voltarCompeticoes");

    if (competicaoAberta) {
        titulo.textContent = "Editar Competição";
        voltar.textContent = "← Voltar para o Perfil";
        nomeCompeticao.value = competicaoAberta.nome;
        dataCompeticao.value = competicaoAberta.data.split("/").reverse().join("-");
        localCompeticao.value = competicaoAberta.local;
        modalidadeCompeticao.value = competicaoAberta.modalidade;
        vagasCompeticao.value = competicaoAberta.capacidade;
        vagasCompeticao.min = Math.max(1, competicaoAberta.idsInscritos.length);
    } else {
        titulo.textContent = "Competição";
        voltar.textContent = "← Voltar para Competições";
    }

    cadastroCompeticao.hidden = false;
    nomeCompeticao.focus();
}

function mostrarFormularioAtleta() {
    formAtleta.reset();
    erroCadastroAtleta.textContent = "";
    nascimentoAtleta.required = true;

    // O campo de nascimento aceita datas até hoje.
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    nascimentoAtleta.max = hoje.getFullYear() + "-" + mes + "-" + dia;

    const titulo = document.getElementById("tituloCadastroAtleta");
    const voltar = document.getElementById("voltarAtletas");
    if (atletaAberto) {
        titulo.textContent = "Editar Atleta";
        voltar.textContent = "← Voltar para o Perfil";
        nomeAtleta.value = atletaAberto.nome;
        paisAtleta.value = atletaAberto.nacionalidade;
        modalidadeAtleta.value = atletaAberto.modalidade;

        if (atletaAberto.dataNascimento) {
            nascimentoAtleta.value = atletaAberto.dataNascimento;
        } else {
            // Os atletas de exemplo têm idade, mas não data de nascimento.
            nascimentoAtleta.required = false;
        }
    } else {
        titulo.textContent = "Atleta";
        voltar.textContent = "← Voltar para Atletas";
    }

    cadastroAtleta.hidden = false;
    nomeAtleta.focus();
}

function editarCompeticao() {
    botaoQueAbriuCadastro = btnEditarCompeticao;
    perfilCompeticao.hidden = true;
    window.scrollTo(0, 0);
    mostrarFormularioCompeticao();
}

function editarAtleta() {
    botaoQueAbriuCadastro = btnEditarAtleta;
    perfilAtleta.hidden = true;
    window.scrollTo(0, 0);
    mostrarFormularioAtleta();
}

function fecharCadastro() {
    cadastroCompeticao.hidden = true;
    cadastroAtleta.hidden = true;
    if (atletaAberto) {
        perfilAtleta.hidden = false;
    } else if (competicaoAberta) {
        perfilCompeticao.hidden = false;
    } else {
        navegacao.hidden = false;
        lista.hidden = false;
    }
    botaoQueAbriuCadastro.focus();
}

function mostrarCadastroSalvo(itens, mensagem) {
    atualizarContadores();
    inPesquisa.value = "";
    atualizarFiltroModalidades(itens);
    mostrarCards();
    fecharCadastro();
    sucessoCadastro.textContent = mensagem;
    sucessoCadastro.hidden = false;
}

function mostrarEdicaoSalva(mensagem) {
    fecharCadastro();
    atualizarPerfil();
    mostrarMensagemPerfil(mensagem, false);
    tituloPerfil.focus();
}

function salvarCompeticao(evento) {
    evento.preventDefault();

    const nome = nomeCompeticao.value.trim();
    const local = localCompeticao.value.trim();
    if (nome === "" || local === "") {
        erroCadastro.textContent = "Preencha o nome e o local do evento.";
        if (nome === "") {
            nomeCompeticao.focus();
        } else {
            localCompeticao.focus();
        }
        return;
    }

    const novaCompeticao = {
        id: criarId(),
        nome: nome,
        modalidade: modalidadeCompeticao.value,
        data: formatarData(dataCompeticao.value),
        local: local,
        capacidade: Number(vagasCompeticao.value),
        idsInscritos: []
    };

    if (competicaoAberta) {
        novaCompeticao.id = competicaoAberta.id;
        novaCompeticao.idsInscritos = competicaoAberta.idsInscritos;
    }

    const erro = guardarCadastro(prefixoCompeticoes, novaCompeticao.id, novaCompeticao);
    if (erro) {
        erroCadastro.textContent = erro;
        return;
    }

    if (competicaoAberta) {
        const indice = indicePorId(competicoes, novaCompeticao.id);
        competicoes[indice] = novaCompeticao;
        competicaoAberta = novaCompeticao;
        mostrarEdicaoSalva("Competição atualizada.");
    } else {
        competicoes.push(novaCompeticao);
        mostrarCadastroSalvo(competicoes, "Competição cadastrada.");
    }
}

function salvarAtleta(evento) {
    evento.preventDefault();

    const nome = nomeAtleta.value.trim();
    const pais = paisAtleta.value.trim();
    if (nome === "" || pais === "") {
        erroCadastroAtleta.textContent = "Preencha o nome e o país de origem.";
        if (nome === "") {
            nomeAtleta.focus();
        } else {
            paisAtleta.focus();
        }
        return;
    }

    const novoAtleta = {
        id: criarId(),
        nome: nome,
        dataNascimento: nascimentoAtleta.value,
        nacionalidade: pais,
        modalidade: modalidadeAtleta.value
    };

    if (atletaAberto) {
        novoAtleta.id = atletaAberto.id;
        if (!novoAtleta.dataNascimento) {
            novoAtleta.idade = atletaAberto.idade;
        }
    }

    const erro = guardarCadastro(prefixoAtletas, novoAtleta.id, novoAtleta);
    if (erro) {
        erroCadastroAtleta.textContent = erro;
        return;
    }

    if (atletaAberto) {
        const indice = indicePorId(atletas, novoAtleta.id);
        atletas[indice] = novoAtleta;
        atletaAberto = novoAtleta;
        fecharCadastro();
        atualizarPerfilAtleta();
        mostrarMensagemPerfil("Dados do atleta atualizados.", false, mensagemPerfilAtleta);
        tituloPerfilAtleta.focus();
    } else {
        atletas.push(novoAtleta);
        mostrarCadastroSalvo(atletas, "Atleta cadastrado.");
    }
}

// Liga os botões e os filtros às funções acima.
for (let i = 0; i < abas.length; i++) {
    abas[i].addEventListener("click", clicarNaAba);
}

inPesquisa.addEventListener("input", mostrarCards);
slModalidades.addEventListener("change", mostrarCards);
btnAdicionar.addEventListener("click", abrirCadastro);
cardAdicionar.addEventListener("click", abrirCadastro);
document.getElementById("voltarCompeticoes").addEventListener("click", fecharCadastro);
document.getElementById("voltarAtletas").addEventListener("click", fecharCadastro);
formCompeticao.addEventListener("submit", salvarCompeticao);
formAtleta.addEventListener("submit", salvarAtleta);
document.getElementById("voltarDoPerfil").addEventListener("click", voltarDoPerfil);
btnVoltarDoPerfilAtleta.addEventListener("click", voltarDoPerfilAtleta);
btnEditarAtleta.addEventListener("click", editarAtleta);
document.getElementById("excluirAtleta").addEventListener("click", excluirAtleta);
btnEditarCompeticao.addEventListener("click", editarCompeticao);
document.getElementById("excluirCompeticao").addEventListener("click", excluirCompeticao);
btnInscrever.addEventListener("click", alternarInscricao);
document.getElementById("cancelarInscricao").addEventListener("click", alternarInscricao);
formInscricao.addEventListener("submit", inscreverAtleta);
pesquisaInscritos.addEventListener("input", mostrarInscritos);
document.getElementById("filtroInscritos").addEventListener("submit", function (evento) {
    evento.preventDefault();
    mostrarInscritos();
});

// Mantém as modalidades disponíveis mesmo se as listas ficarem vazias.
const exemplosComModalidades = competicoes.concat(atletas);
carregarCadastros(competicoes, prefixoCompeticoes);
carregarCadastros(atletas, prefixoAtletas);
limparInscricoesSemAtleta();
const itensComModalidades = exemplosComModalidades.concat(competicoes, atletas);
preencherModalidades(itensComModalidades, modalidadeCompeticao);
preencherModalidades(itensComModalidades, modalidadeAtleta);
atualizarContadores();
mostrarAba("competicoes");

