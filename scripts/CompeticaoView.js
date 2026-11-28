import { CompeticaoController } from './CompeticaoController.js';

const controller = new CompeticaoController();
const modalidades = ["Maratona", "Trail Running"];
const campo = id => document.getElementById(id);

// ---------- Elementos da tela ----------
const abas = document.querySelectorAll(".abas button");
const navegacao = document.getElementById("navegacao");
const lista = document.getElementById("lista");
const relatorio = document.getElementById("relatorio");
const linhasRelatorio = document.getElementById("linhasRelatorio");
const totalVagas = document.getElementById("totalVagas");
const totalDisponiveis = document.getElementById("totalDisponiveis");
const totalOcupadas = document.getElementById("totalOcupadas");
const inPesquisa = document.getElementById("inPesquisa");
const slModalidades = document.getElementById("slModalidades");
const cards = document.getElementById("cards");
const modeloCard = document.getElementById("modeloCard");
const btnAdicionar = document.getElementById("btnAdicionar");
const cardAdicionar = document.getElementById("cardAdicionar");
const textoCardAdicionar = document.getElementById("textoCardAdicionar");
const semResultados = document.getElementById("semResultados");
const sucessoCadastro = document.getElementById("sucessoCadastro");

const perfilCompeticao = document.getElementById("perfilCompeticao");
const tituloPerfil = document.getElementById("tituloPerfil");
const mensagemPerfil = document.getElementById("mensagemPerfil");
const btnEditarCompeticao = document.getElementById("editarCompeticao");
const btnInscrever = document.getElementById("btnInscrever");
const avisoInscricao = document.getElementById("avisoInscricao");
const formInscricao = document.getElementById("formInscricao");
const modalInscricao = document.getElementById("modalInscricao");
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

const cadastroAtleta = document.getElementById("cadastroAtleta");
const formAtleta = document.getElementById("formAtleta");
const nomeAtleta = document.getElementById("nomeAtleta");
const nascimentoAtleta = document.getElementById("nascimentoAtleta");
const paisAtleta = document.getElementById("paisAtleta");
const modalidadeAtleta = document.getElementById("modalidadeAtleta");
const erroCadastroAtleta = document.getElementById("erroCadastroAtleta");

let abaAtual;
let competicaoAberta;
let tipoCompeticaoAberta;
let atletaAberto;
let atletaSelecionado;

// ---------- Listagens e relatório ----------
function criarCardsCompeticao() {
    const modalidade = slModalidades.value;
    const competicoes = modalidade
        ? controller.filtrarCompeticoesPorModalidade(modalidade)
        : controller.filtrarCompeticoesPorNome("");
    const busca = normalizar(inPesquisa.value);
    const listaCompeticoes = competicoes.filter(dados =>
        normalizar(dados.nome).includes(busca) || normalizar(dados.local).includes(busca));
    const fragmento = document.createDocumentFragment();

    for (const dados of listaCompeticoes) {
        const competicao = controller.consultarCompeticao(dados.nome);
        const card = modeloCard.content.firstElementChild.cloneNode(true);
        const inscritos = competicao.participantes.length;
        const capacidade = dados.capacidade ?? 0;
        const vagas = Math.max(0, capacidade - inscritos);
        const unidade = vagas === 1 ? "vaga" : "vagas";
        const botao = card.querySelector("button");

        card.querySelector("h2").textContent = dados.nome;
        card.querySelector(".card-etiqueta").textContent = dados.modalidade;
        card.querySelector(".card-resumo").textContent =
            `${inscritos}/${capacidade} inscritos (${vagas} ${unidade})`;
        card.querySelector(".card-primeira-info").textContent = `Data: ${formatarData(dados.data)}`;
        card.querySelector(".card-segunda-info").textContent = `Local: ${dados.local}`;

        botao.textContent = "Gerenciar inscritos";
        botao.setAttribute("aria-label", `Gerenciar inscritos em ${dados.nome}`);
        botao.addEventListener("click", () => abrirPerfilCompeticao(dados.nome, dados.modalidade));

        fragmento.appendChild(card);
    }

    cards.replaceChildren(fragmento, cardAdicionar);
    semResultados.textContent = busca || modalidade
        ? "Nenhuma competição encontrada." : "Nenhuma competição cadastrada.";
    semResultados.hidden = listaCompeticoes.length > 0;
}

function criarCardsAtletas() {
    const busca = normalizar(inPesquisa.value);
    const modalidade = slModalidades.value;
    const atletas = controller.listarAtletas().filter(atleta =>
        (!modalidade || modalidadesDoAtleta(atleta).includes(modalidade)) &&
        (normalizar(atleta.nome).includes(busca) || normalizar(atleta.nacionalidade).includes(busca)));
    const fragmento = document.createDocumentFragment();

    for (const atleta of atletas) {
        const card = modeloCard.content.firstElementChild.cloneNode(true);
        const iniciais = card.querySelector(".card-iniciais");
        const botao = card.querySelector("button");

        card.classList.add("card-atleta");
        iniciais.textContent = iniciaisDoNome(atleta.nome);
        iniciais.hidden = false;

        card.querySelector("h2").textContent = atleta.nome;
        card.querySelector(".card-etiqueta").textContent = textoModalidades(atleta);
        card.querySelector(".card-primeira-info").textContent = `Idade: ${textoIdade(atleta.idade)}`;
        card.querySelector(".card-segunda-info").textContent = `Nacionalidade: ${atleta.nacionalidade}`;
        card.querySelector(".card-resumo").hidden = true;
        botao.textContent = "Ver ficha";
        botao.setAttribute("aria-label", `Ver ficha de ${atleta.nome}`);
        botao.addEventListener("click", () => abrirPerfilAtleta(atleta.docIdentidade));
        fragmento.appendChild(card);
    }

    cards.replaceChildren(fragmento, cardAdicionar);
    semResultados.textContent = busca || modalidade
        ? "Nenhum atleta encontrado." : "Nenhum atleta para exibir.";
    semResultados.hidden = atletas.length > 0;
}

function criarRelatorio() {
    const linhas = document.createDocumentFragment();
    let somaVagas = 0;
    let somaDisponiveis = 0;
    let somaOcupadas = 0;

    for (const dados of controller.filtrarCompeticoesPorNome("")) {
        const competicao = controller.consultarCompeticao(dados.nome);
        const vagas = Number(dados.capacidade ?? 0);
        const ocupadas = competicao.participantes.length;
        const disponiveis = Math.max(0, vagas - ocupadas);

        const linha = document.createElement("tr");
        const nome = document.createElement("th");
        nome.scope = "row";
        nome.textContent = dados.nome;
        linha.appendChild(nome);
        for (const valor of [vagas, disponiveis, ocupadas]) {
            linha.insertCell().textContent = String(valor);
        }
        linhas.appendChild(linha);

        somaVagas += vagas;
        somaDisponiveis += disponiveis;
        somaOcupadas += ocupadas;
    }

    linhasRelatorio.replaceChildren(linhas);
    totalVagas.textContent = String(somaVagas);
    totalDisponiveis.textContent = String(somaDisponiveis);
    totalOcupadas.textContent = String(somaOcupadas);
}

function mostrarAba(aba) {
    const botoes = Array.from(abas);
    if (!botoes.some(botao => botao.dataset.aba === aba)) {
        return;
    }

    for (const botao of botoes) {
        botao.setAttribute("aria-pressed", String(botao.dataset.aba === aba));
    }

    if (abaAtual !== aba) {
        inPesquisa.value = "";
        slModalidades.value = "";
    }
    abaAtual = aba;
    competicaoAberta = undefined;
    atletaAberto = undefined;
    sucessoCadastro.hidden = true;

    if (aba === "relatorio") {
        criarRelatorio();
        mostrarTela(relatorio);
        return;
    }

    const mostrarAtletas = aba === "atletas";
    const rotuloAdicionar = mostrarAtletas ? "Adicionar Atleta" : "Adicionar Competição";
    const busca = mostrarAtletas ? "Buscar atleta ou nacionalidade" : "Buscar competição ou local";

    lista.setAttribute("aria-label", mostrarAtletas ? "Atletas" : "Competições");
    inPesquisa.placeholder = busca + "...";
    inPesquisa.setAttribute("aria-label", busca);
    btnAdicionar.textContent = "+ " + rotuloAdicionar;
    textoCardAdicionar.textContent = rotuloAdicionar;

    preencherOpcoes(slModalidades, modalidades, "Todas as modalidades", slModalidades.value);
    atualizarCards();
    mostrarTela(lista);
}

function atualizarCards() {
    sucessoCadastro.hidden = true;
    if (abaAtual === "atletas") {
        criarCardsAtletas();
    } else if (abaAtual === "competicoes") {
        criarCardsCompeticao();
    }
}

// ---------- Funções auxiliares ----------
function normalizar(texto) {
    return (texto ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function modalidadesDoAtleta(atleta) {
    return atleta.modalidade.flat(Infinity).filter(Boolean);
}

function textoModalidades(atleta) {
    return modalidadesDoAtleta(atleta).join(", ") || "Sem modalidade";
}

function preencherOpcoes(select, opcoes, rotuloVazio, selecionada) {
    const elementos = opcoes.map(opcao => new Option(opcao, opcao));
    if (rotuloVazio) {
        elementos.unshift(new Option(rotuloVazio, ""));
    }
    select.replaceChildren(...elementos);
    if (selecionada != null && elementos.some(opcao => opcao.value === selecionada)) {
        select.value = selecionada;
    }
}

function iniciaisDoNome(nome) {
    const partes = nome.trim().split(/\s+/);
    const ultima = partes.length > 1 ? partes.at(-1).charAt(0) : "";
    return (partes[0].charAt(0) + ultima).toUpperCase();
}

function textoIdade(idade) {
    if (!Number.isFinite(idade) || idade < 0) {
        return "não informada";
    }
    return idade + (idade === 1 ? " ano" : " anos");
}

function dataISO(data = "") {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(data) ? data.split("/").reverse().join("-") : data;
}

function formatarData(data) {
    const iso = dataISO(data);
    return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join("/") : data || "Não informada";
}

function hojeISO() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${hoje.getFullYear()}-${mes}-${dia}`;
}

function diasAte(data) {
    return (Date.parse(dataISO(data)) - Date.parse(hojeISO())) / 86400000;
}

function mostrarTela(tela, foco) {
    for (const secao of [lista, relatorio, perfilCompeticao, perfilAtleta, cadastroCompeticao, cadastroAtleta]) {
        secao.hidden = secao !== tela;
    }
    navegacao.hidden = tela !== lista && tela !== relatorio;
    foco?.focus();
}

function exibirMensagem(elemento, texto) {
    elemento.textContent = texto;
    elemento.hidden = !texto;
}

function atualizarContadores() {
    const competicoes = controller.filtrarCompeticoesPorNome("").length;
    const atletas = controller.listarAtletas().length;
    campo("totalCompeticoes").textContent = competicoes + (competicoes === 1 ? " competição" : " competições");
    campo("totalAtletas").textContent = atletas + (atletas === 1 ? " atleta" : " atletas");
}

function voltarParaLista(aviso = "") {
    mostrarAba(abaAtual);
    exibirMensagem(sucessoCadastro, aviso);
    btnAdicionar.focus();
}

function executarOperacao(operacao, saida, erro) {
    if (operacao()) {
        atualizarContadores();
        return true;
    }

    exibirMensagem(saida, erro);
    return false;
}

// ---------- Perfis ----------
function abrirPerfilCompeticao(nome, modalidade) {
    competicaoAberta = nome;
    tipoCompeticaoAberta = modalidade;
    pesquisaInscritos.value = "";
    atualizarPerfilCompeticao();
}

function atualizarPerfilCompeticao(aviso = "") {
    const competicao = controller.consultarCompeticao(competicaoAberta);
    const inscritos = competicao.participantes.length;
    const capacidade = competicao.capacidade ?? 0;
    const detalhes = [formatarData(competicao.data), competicao.local, tipoCompeticaoAberta];
    if (competicao.distancia != null) {
        detalhes.push(`${competicao.distancia} km`);
    }
    if (tipoCompeticaoAberta === "Maratona") {
        if (competicao.altimetria != null) detalhes.push(`Altimetria: ${competicao.altimetria} m`);
        if (typeof competicao.percursoUrbano === "boolean") {
            detalhes.push(competicao.percursoUrbano ? "Percurso urbano" : "Percurso não urbano");
        }
    } else {
        if (competicao.tipoTerreno) detalhes.push(`Terreno: ${competicao.tipoTerreno}`);
        if (competicao.nivelDificuldade) detalhes.push(`Dificuldade: ${competicao.nivelDificuldade}`);
        if (competicao.checkpoints != null) detalhes.push(`Checkpoints: ${competicao.checkpoints}`);
        if (competicao.tipoDisputa) detalhes.push(`Disputa: ${competicao.tipoDisputa}`);
    }

    tituloPerfil.textContent = competicao.nome;
    campo("informacoesPerfil").textContent = detalhes.join(" · ");
    campo("vagasPerfil").textContent = `${inscritos}/${capacidade}`;
    campo("textoVagasPerfil").textContent = "Vagas ocupadas";
    const dias = diasAte(competicao.data);
    campo("diasPerfil").textContent = Number.isFinite(dias) ? Math.max(0, dias) : "—";
    btnInscrever.disabled = inscritos >= capacidade;
    exibirMensagem(avisoInscricao, btnInscrever.disabled ? "Todas as vagas estão ocupadas." : "");
    exibirMensagem(mensagemPerfil, aviso);
    mostrarInscritos();
    mostrarTela(perfilCompeticao, tituloPerfil);
}

function mostrarInscritos() {
    const pesquisa = normalizar(pesquisaInscritos.value);
    const inscritos = controller.consultarCompeticao(competicaoAberta).participantes
        .filter(atleta => normalizar(atleta.nome).includes(pesquisa));
    const linhas = inscritos.map(atleta => {
        const linha = modeloInscrito.content.firstElementChild.cloneNode(true);
        const [idade, nacionalidade, modalidade] = linha.querySelectorAll("td");
        linha.querySelector("th").textContent = atleta.nome;
        idade.textContent = textoIdade(controller.calcularIdade(atleta.dataNascimento));
        nacionalidade.textContent = atleta.nacionalidade;
        modalidade.textContent = textoModalidades(atleta);
        linha.querySelector(".ficha-inscrito").addEventListener("click", () => abrirPerfilAtleta(atleta.docIdentidade));
        linha.querySelector(".remover-inscrito").addEventListener("click", () => removerInscricao(atleta));
        return linha;
    });
    if (linhas.length === 0) {
        const linha = document.createElement("tr");
        const celula = linha.insertCell();
        celula.colSpan = 5;
        celula.textContent = pesquisa ? "Nenhum inscrito encontrado." : "Nenhum atleta inscrito.";
        linhas.push(linha);
    }
    linhasInscritos.replaceChildren(...linhas);
}

function abrirPerfilAtleta(documento, aviso = "") {
    atletaAberto = documento;
    const atleta = controller.consultarAtleta(documento);
    campo("nomePerfilAtleta").textContent = atleta.nome;
    campo("documentoPerfilAtleta").textContent = atleta.docIdentidade;
    campo("nascimentoPerfilAtleta").textContent = formatarData(atleta.dataNascimento);
    campo("paisPerfilAtleta").textContent = atleta.nacionalidade;
    campo("modalidadePerfilAtleta").textContent = textoModalidades(atleta);
    campo("iniciaisPerfilAtleta").textContent = iniciaisDoNome(atleta.nome);
    btnVoltarDoPerfilAtleta.textContent = competicaoAberta ? "← Voltar para Competição" : "← Voltar para Atletas";
    btnEditarAtleta.hidden = !atleta.habilitado;
    campo("excluirAtleta").hidden = !atleta.habilitado;

    const competicoes = controller.mostrarCompeticoesParticipadasPorAtleta(documento);
    const itens = competicoes.map(competicao => {
        const item = modeloCompeticaoDoAtleta.content.firstElementChild.cloneNode(true);
        item.querySelector("strong").textContent = competicao.nome;
        item.querySelector("p").textContent =
            [formatarData(competicao.data), competicao.local, competicao.modalidade].join(" · ");
        item.querySelector(".status-competicao-atleta").textContent = diasAte(competicao.data) < 0
            ? "Participou" : "Inscrito";
        return item;
    });
    competicoesDoAtleta.replaceChildren(...itens);
    campo("semCompeticoesAtleta").hidden = itens.length > 0;
    exibirMensagem(mensagemPerfilAtleta, atleta.habilitado ? aviso : "Atleta inativo.");
    mostrarTela(perfilAtleta, tituloPerfilAtleta);
}

function voltarDoPerfilAtleta(aviso = "") {
    atletaAberto = undefined;
    if (competicaoAberta) {
        atualizarPerfilCompeticao(aviso);
    } else {
        voltarParaLista(aviso);
    }
}

function excluirCompeticao() {
    if (window.confirm(`Excluir ${competicaoAberta} e suas inscrições?`) &&
        executarOperacao(() => controller.deletarCompeticao(competicaoAberta),
            mensagemPerfil, "Não foi possível excluir esta competição.")) {
        voltarParaLista("Competição excluída.");
    }
}

function excluirAtleta() {
    const atleta = controller.consultarAtleta(atletaAberto);
    if (window.confirm(`Excluir ${atleta.nome} da lista de atletas ativos? As inscrições existentes serão mantidas.`) &&
        executarOperacao(() => controller.excluirAtleta(atletaAberto),
            mensagemPerfilAtleta, "Não foi possível excluir este atleta.")) {
        voltarDoPerfilAtleta("Atleta excluído.");
    }
}

// ---------- Cadastro e edição ----------
function alternarCamposCompeticao() {
    const maratona = modalidadeCompeticao.value === "Maratona";
    const grupos = [[campo("camposMaratona"), maratona], [campo("camposTrailRunning"), !maratona]];
    for (const [grupo, ativo] of grupos) {
        grupo.hidden = !ativo;
        for (const elemento of grupo.querySelectorAll("input, select")) {
            elemento.disabled = !ativo;
        }
    }
}

function abrirCadastroCompeticao() {
    formCompeticao.reset();
    const anterior = controller.consultarCompeticao(competicaoAberta);
    preencherOpcoes(modalidadeCompeticao, modalidades, "", anterior ? tipoCompeticaoAberta : "Maratona");
    modalidadeCompeticao.disabled = Boolean(anterior);
    campo("tituloCadastro").textContent = anterior ? "Editar Competição" : "Competição";
    campo("voltarCompeticoes").textContent = anterior ? "← Voltar para o Perfil" : "← Voltar para Competições";
    vagasCompeticao.min = Math.max(1, anterior?.participantes.length ?? 0);
    campo("distanciaCompeticao").required = anterior?.distancia != null;
    campo("checkpointsCompeticao").required = anterior?.checkpoints != null;
    exibirMensagem(erroCadastro, "");

    if (anterior) {
        nomeCompeticao.value = anterior.nome;
        localCompeticao.value = anterior.local;
        dataCompeticao.value = dataISO(anterior.data);
        vagasCompeticao.value = anterior.capacidade ?? "";
        campo("distanciaCompeticao").value = anterior.distancia ?? "";
        campo("altimetriaCompeticao").value = anterior.altimetria ?? "";
        campo("percursoUrbano").value = typeof anterior.percursoUrbano === "boolean"
            ? (anterior.percursoUrbano ? "sim" : "nao") : "";
        campo("tipoTerreno").value = anterior.tipoTerreno ?? "";
        campo("nivelDificuldade").value = anterior.nivelDificuldade ?? "";
        campo("checkpointsCompeticao").value = anterior.checkpoints ?? "";
        campo("tipoDisputa").value = anterior.tipoDisputa ?? "";
    }
    alternarCamposCompeticao();
    mostrarTela(cadastroCompeticao, nomeCompeticao);
}

function lerNumero(id) {
    const valor = campo(id).value;
    return valor === "" ? undefined : Number(valor);
}

function salvarCompeticao(evento) {
    evento.preventDefault();
    const nome = nomeCompeticao.value.trim();
    const local = localCompeticao.value.trim();
    const capacidade = Number(vagasCompeticao.value);
    const anterior = controller.consultarCompeticao(competicaoAberta);
    if (!nome || !local || !dataCompeticao.value ||
        !Number.isSafeInteger(capacidade) || capacidade < Math.max(1, anterior?.participantes.length ?? 0)) {
        exibirMensagem(erroCadastro, "Preencha o nome, o local, a data e um total de vagas válido.");
        return;
    }

    const comuns = [nome, local, dataCompeticao.value, lerNumero("distanciaCompeticao"), capacidade];
    let operacao;
    switch (modalidadeCompeticao.value) {
        case "Maratona": {
            const percurso = campo("percursoUrbano").value;
            const dados = [...comuns, lerNumero("altimetriaCompeticao"), percurso ? percurso === "sim" : undefined];
            operacao = anterior ? () => controller.editarMaratona(...dados, competicaoAberta)
                : () => controller.cadastrarMaratona(...dados);
            break;
        }
        case "Trail Running": {
            const dados = [...comuns, campo("tipoTerreno").value.trim(), campo("nivelDificuldade").value.trim(),
                lerNumero("checkpointsCompeticao"), campo("tipoDisputa").value.trim()];
            operacao = anterior ? () => controller.editarTrailRunning(...dados, competicaoAberta)
                : () => controller.cadastrarTrailRunning(...dados);
            break;
        }
        default:
            exibirMensagem(erroCadastro, "Selecione a modalidade da competição.");
            return;
    }

    if (executarOperacao(operacao, erroCadastro, "Já existe uma competição com esse nome.")) {
        if (anterior) {
            competicaoAberta = nome;
            atualizarPerfilCompeticao("Competição atualizada.");
        } else {
            inPesquisa.value = slModalidades.value = "";
            voltarParaLista("Competição cadastrada.");
        }
    }
}

function abrirCadastroAtleta() {
    formAtleta.reset();
    const anterior = controller.consultarAtleta(atletaAberto);
    const documento = campo("documentoAtleta");
    documento.readOnly = Boolean(anterior);
    nascimentoAtleta.max = hojeISO();
    nascimentoAtleta.required = !anterior || Boolean(anterior.dataNascimento);
    modalidadeAtleta.required = !anterior;
    campo("tituloCadastroAtleta").textContent = anterior ? "Editar Atleta" : "Atleta";
    campo("voltarAtletas").textContent = anterior ? "← Voltar para a Ficha" : "← Voltar para Atletas";
    campo("rotuloModalidadeAtleta").textContent = anterior ? "Adicionar modalidade" : "Modalidade";
    const existentes = anterior ? modalidadesDoAtleta(anterior) : [];
    preencherOpcoes(modalidadeAtleta, modalidades.filter(opcao => !existentes.includes(opcao)),
        anterior ? "Manter modalidades atuais" : "Selecione uma modalidade");
    exibirMensagem(erroCadastroAtleta, "");

    if (anterior) {
        documento.value = anterior.docIdentidade;
        nomeAtleta.value = anterior.nome;
        nascimentoAtleta.value = dataISO(anterior.dataNascimento);
        paisAtleta.value = anterior.nacionalidade;
    }
    mostrarTela(cadastroAtleta, nomeAtleta);
}

function salvarAtleta(evento) {
    evento.preventDefault();
    const documento = campo("documentoAtleta").value.trim();
    const nome = nomeAtleta.value.trim();
    const pais = paisAtleta.value.trim();
    const data = nascimentoAtleta.value;
    const modalidade = modalidadeAtleta.value;
    const editando = atletaAberto !== undefined;
    if (!documento || !nome || !pais || (!editando && (!data || !modalidade))) {
        exibirMensagem(erroCadastroAtleta, "Preencha os campos obrigatórios do atleta.");
        return;
    }

    const operacao = editando
        ? () => controller.atualizarAtleta(atletaAberto, nome, data, pais, modalidade)
        : () => controller.cadastrarAtleta(nome, data, pais, modalidade, documento);
    if (executarOperacao(operacao, erroCadastroAtleta, "Já existe um atleta com esse documento.")) {
        if (editando) {
            abrirPerfilAtleta(atletaAberto, "Atleta atualizado.");
        } else {
            inPesquisa.value = slModalidades.value = "";
            voltarParaLista("Atleta cadastrado.");
        }
    }
}

function abrirCadastro() {
    if (abaAtual === "atletas") {
        abrirCadastroAtleta();
    } else {
        abrirCadastroCompeticao();
    }
}

// ---------- Inscrições ----------
function buscarAtletasParaInscricao() {
    const busca = normalizar(campo("buscaAtletaInscricao").value);
    const competicao = controller.consultarCompeticao(competicaoAberta);
    const inscritos = new Set(competicao.participantes.map(atleta => atleta.docIdentidade));
    const atletas = controller.listarAtletas().filter(atleta =>
        !inscritos.has(atleta.docIdentidade) && normalizar(atleta.nome).includes(busca));
    const listaAtletas = campo("resultadosAtletaInscricao");
    const confirmar = campo("confirmarInscricao");
    const mensagemBusca = campo("mensagemBuscaAtleta");
    atletaSelecionado = undefined;
    confirmar.disabled = true;
    exibirMensagem(campo("erroInscricao"), "");

    const itens = atletas.map(atleta => {
        const item = document.createElement("li");
        const botao = document.createElement("button");
        const nome = document.createElement("strong");
        const detalhes = document.createElement("span");
        item.className = "resultado-atleta-inscricao";
        botao.type = "button";
        botao.setAttribute("aria-pressed", "false");
        nome.textContent = atleta.nome;
        detalhes.textContent = `${atleta.docIdentidade} · ${textoModalidades(atleta)}`;
        botao.append(nome, detalhes);
        botao.addEventListener("click", () => {
            atletaSelecionado = atleta.docIdentidade;
            confirmar.disabled = false;
            for (const opcao of listaAtletas.querySelectorAll("button")) {
                opcao.setAttribute("aria-pressed", String(opcao === botao));
            }
            exibirMensagem(mensagemBusca, `Selecionado: ${atleta.nome}`);
        });
        item.appendChild(botao);
        return item;
    });
    listaAtletas.replaceChildren(...itens);
    listaAtletas.hidden = itens.length === 0;
    exibirMensagem(mensagemBusca, itens.length ? "" : "Nenhum atleta disponível para inscrição.");
}

function mostrarOpcaoInscricao(novoAtleta) {
    formInscricao.hidden = novoAtleta;
    campo("formNovoInscrito").hidden = !novoAtleta;
    campo("opcaoAtletaCadastrado").setAttribute("aria-pressed", String(!novoAtleta));
    campo("opcaoNovoAtleta").setAttribute("aria-pressed", String(novoAtleta));
    exibirMensagem(campo("erroInscricao"), "");
    if (!novoAtleta) {
        buscarAtletasParaInscricao();
    }
    campo(novoAtleta ? "documentoNovoInscrito" : "buscaAtletaInscricao").focus();
}

function abrirInscricao() {
    formInscricao.reset();
    campo("formNovoInscrito").reset();
    campo("nascimentoNovoInscrito").max = hojeISO();
    preencherOpcoes(campo("modalidadeNovoInscrito"), modalidades, "", tipoCompeticaoAberta);
    modalInscricao.showModal();
    mostrarOpcaoInscricao(false);
}

function confirmarInscricao(documento, mensagemErro) {
    if (executarOperacao(() => controller.cadastrarAtletaEmCompeticao(competicaoAberta, documento),
        campo("erroInscricao"), mensagemErro)) {
        modalInscricao.close();
        pesquisaInscritos.value = "";
        atualizarPerfilCompeticao("Atleta inscrito.");
    }
}

function salvarNovoInscrito(evento) {
    evento.preventDefault();
    const documento = campo("documentoNovoInscrito").value.trim();
    const nome = campo("nomeNovoInscrito").value.trim();
    const pais = campo("paisNovoInscrito").value.trim();
    const data = campo("nascimentoNovoInscrito").value;
    const modalidade = campo("modalidadeNovoInscrito").value;
    const erro = campo("erroInscricao");
    const prova = controller.consultarCompeticao(competicaoAberta);
    if (!documento || !nome || !pais || !data || !modalidade) {
        exibirMensagem(erro, "Preencha os dados do novo atleta.");
        return;
    }
    if (prova.participantes.length >= (prova.capacidade ?? 0)) {
        exibirMensagem(erro, "A competição está sem vagas.");
        return;
    }
    if (executarOperacao(() => controller.cadastrarAtleta(nome, data, pais, modalidade, documento),
        erro, "Já existe um atleta com esse documento. Use a opção Atleta Cadastrado.")) {
        confirmarInscricao(documento, "O atleta foi cadastrado. Use Atleta Cadastrado para inscrevê-lo.");
    }
}

function removerInscricao(atleta) {
    if (window.confirm(`Remover a inscrição de ${atleta.nome}?`) &&
        executarOperacao(() => controller.removerAtletaDaCompeticao(competicaoAberta, atleta.docIdentidade),
            mensagemPerfil, "Não foi possível remover esta inscrição.")) {
        atualizarPerfilCompeticao("Inscrição removida.");
    }
}

// ---------- Eventos ----------
for (const botao of abas) {
    botao.addEventListener("click", () => mostrarAba(botao.dataset.aba));
}
inPesquisa.addEventListener("input", atualizarCards);
slModalidades.addEventListener("change", atualizarCards);
btnAdicionar.addEventListener("click", abrirCadastro);
cardAdicionar.addEventListener("click", abrirCadastro);
campo("voltarDoPerfil").addEventListener("click", () => voltarParaLista());
btnVoltarDoPerfilAtleta.addEventListener("click", () => voltarDoPerfilAtleta());
btnEditarCompeticao.addEventListener("click", abrirCadastroCompeticao);
btnEditarAtleta.addEventListener("click", abrirCadastroAtleta);
campo("excluirCompeticao").addEventListener("click", excluirCompeticao);
campo("excluirAtleta").addEventListener("click", excluirAtleta);

campo("voltarCompeticoes").addEventListener("click", () => {
    if (competicaoAberta) atualizarPerfilCompeticao();
    else voltarParaLista();
});
campo("voltarAtletas").addEventListener("click", () => {
    if (atletaAberto !== undefined) abrirPerfilAtleta(atletaAberto);
    else voltarParaLista();
});
modalidadeCompeticao.addEventListener("change", alternarCamposCompeticao);
formCompeticao.addEventListener("submit", salvarCompeticao);
formAtleta.addEventListener("submit", salvarAtleta);

pesquisaInscritos.addEventListener("input", mostrarInscritos);
campo("filtroInscritos").addEventListener("submit", evento => {
    evento.preventDefault();
    mostrarInscritos();
});
btnInscrever.addEventListener("click", abrirInscricao);
campo("cancelarInscricao").addEventListener("click", () => modalInscricao.close());
campo("cancelarNovoInscrito").addEventListener("click", () => modalInscricao.close());
campo("opcaoAtletaCadastrado").addEventListener("click", () => mostrarOpcaoInscricao(false));
campo("opcaoNovoAtleta").addEventListener("click", () => mostrarOpcaoInscricao(true));
campo("buscaAtletaInscricao").addEventListener("input", buscarAtletasParaInscricao);
formInscricao.addEventListener("submit", evento => {
    evento.preventDefault();
    if (atletaSelecionado !== undefined) {
        confirmarInscricao(atletaSelecionado, "O atleta está indisponível ou a competição está sem vagas.");
    }
});
campo("formNovoInscrito").addEventListener("submit", salvarNovoInscrito);

atualizarContadores();
mostrarAba("competicoes");
