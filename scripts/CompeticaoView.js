import { CompeticaoController } from './CompeticaoController.js';

const controller = new CompeticaoController();

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

let gerenciarCompeticao;

function criarCardsCompeticao(aoGerenciar = gerenciarCompeticao) {
    gerenciarCompeticao = aoGerenciar;
    const listaCompeticoes = controller.filtrarCompeticoesPorNome("");
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
        card.querySelector(".card-primeira-info").textContent = `Data: ${dados.data}`;
        card.querySelector(".card-segunda-info").textContent = `Local: ${dados.local}`;

        botao.textContent = "Gerenciar inscritos";
        botao.setAttribute("aria-label", `Gerenciar inscritos em ${dados.nome}`);
        botao.disabled = !aoGerenciar;
        if (aoGerenciar) {
            botao.addEventListener("click", () => aoGerenciar(dados.nome));
        }

        fragmento.appendChild(card);
    }

    cards.replaceChildren(fragmento, cardAdicionar);
    semResultados.textContent = "Nenhuma competição cadastrada.";
    semResultados.hidden = listaCompeticoes.length > 0;
}

function criarCardsAtletas() {
    const atletas = controller.listarAtletas();
    const fragmento = document.createDocumentFragment();

    for (const atleta of atletas) {
        const card = modeloCard.content.firstElementChild.cloneNode(true);
        const nomes = atleta.nome.trim().split(/\s+/);
        const iniciais = card.querySelector(".card-iniciais");
        const modalidades = atleta.modalidade.flat().filter(Boolean);
        const idade = Number.isFinite(atleta.idade) && atleta.idade >= 0
            ? `${atleta.idade} ${atleta.idade === 1 ? "ano" : "anos"}`
            : "não informada";

        card.classList.add("card-atleta");
        iniciais.textContent = (nomes[0].charAt(0) +
            (nomes.length > 1 ? nomes.at(-1).charAt(0) : "")).toUpperCase();
        iniciais.hidden = false;

        card.querySelector("h2").textContent = atleta.nome;
        card.querySelector(".card-etiqueta").textContent = modalidades.join(", ") || "Sem modalidade";
        card.querySelector(".card-primeira-info").textContent = `Idade: ${idade}`;
        card.querySelector(".card-segunda-info").textContent = `Nacionalidade: ${atleta.nacionalidade}`;
        card.querySelector(".card-resumo").hidden = true;
        card.querySelector(".card-rodape").hidden = true;
        fragmento.appendChild(card);
    }

    cards.replaceChildren(fragmento, cardAdicionar);
    semResultados.textContent = "Nenhum atleta para exibir.";
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

    const mostrarRelatorio = aba === "relatorio";
    lista.hidden = mostrarRelatorio;
    relatorio.hidden = !mostrarRelatorio;
    sucessoCadastro.hidden = true;

    if (mostrarRelatorio) {
        criarRelatorio();
        return;
    }

    const mostrarAtletas = aba === "atletas";
    const rotuloAdicionar = mostrarAtletas ? "Adicionar Atleta" : "Adicionar Competição";
    const busca = mostrarAtletas ? "Buscar atleta" : "Buscar competição";

    lista.setAttribute("aria-label", mostrarAtletas ? "Atletas" : "Competições");
    inPesquisa.value = "";
    inPesquisa.placeholder = busca + "...";
    inPesquisa.setAttribute("aria-label", busca);
    slModalidades.options.length = 1;
    slModalidades.value = "";
    btnAdicionar.textContent = "+ " + rotuloAdicionar;
    textoCardAdicionar.textContent = rotuloAdicionar;

    if (mostrarAtletas) {
        criarCardsAtletas();
    } else {
        criarCardsCompeticao();
    }
}

for (const botao of abas) {
    botao.addEventListener("click", () => mostrarAba(botao.dataset.aba));
}

mostrarAba("competicoes");
