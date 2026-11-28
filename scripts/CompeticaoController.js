
import { Atleta } from "./Atleta.js";
import { Maratona } from "./Maratona.js";
import { TrailRunning } from "./TrailRunning.js";

export class CompeticaoController {
    #vetCompeticoes;
    #vetAtletas;

    constructor() {
        this.#vetCompeticoes = [];
        this.#vetAtletas = [];

        this.carregarDados();
    }

    // ---------- Métodos para Atletas ----------
    consultarAtleta(docIdentidade) {
        return this.#vetAtletas.find(atleta => atleta.docIdentidade === docIdentidade);
    }

    cadastrarAtleta(nome, dataNascimento, nacionalidade, modalidade, docIdentidade) {
        let atleta = this.consultarAtleta(docIdentidade);
        if (atleta === undefined) {
            this.#vetAtletas.push(new Atleta(nome, dataNascimento, nacionalidade, modalidade, docIdentidade));
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    atualizarAtleta(docIdentidade, nome, dataNascimento, nacionalidade, modalidade) {
        let atleta = this.consultarAtleta(docIdentidade);
        if (atleta !== undefined) {
            if (nome !== "" || nome !== atleta.nome) {
                atleta.nome = nome;
            }
            if (dataNascimento !== "" || dataNascimento !== atleta.dataNascimento) {
                atleta.dataNascimento = dataNascimento;
            }
            if (nacionalidade !== "" || nacionalidade !== atleta.nacionalidade) {
                atleta.nacionalidade = nacionalidade;
            }
            if (modalidade !== "") {
                atleta.adicionarModalidade(modalidade);
            }
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    excluirAtleta(docIdentidade) {
        //IMPORTANTE: a função de exlcuir um atleta não o remove do sistema, apenas muda seu status para desabilitado
        // Isso é feito para manter o histórico de participações do atleta em competições
        // Atletas desabilitados não serão mostrados nas listagens e não poderão ser inscritos em novas competições
        let atleta = this.consultarAtleta(docIdentidade);
        if (atleta !== undefined) {
            atleta.habilitado = false;
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    calcularIdade(dataNascimento) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
            return null;
        }

        const [ano, mes, dia] = dataNascimento.split("-").map(Number);
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const aniversarioPendente = mesAtual < mes ||
            (mesAtual === mes && hoje.getDate() < dia);
        return hoje.getFullYear() - ano - Number(aniversarioPendente);
    }

    listarAtletas() {
        var vetObjLiteraisAtletals = [];
        this.#vetAtletas.forEach(atleta => {
            if (atleta.habilitado) {
                vetObjLiteraisAtletals.push({
                    nome: atleta.nome,
                    // A View precisa da chave para abrir a ficha certa, inclusive entre homônimos.
                    docIdentidade: atleta.docIdentidade,
                    idade: this.calcularIdade(atleta.dataNascimento),
                    nacionalidade: atleta.nacionalidade,
                    modalidade: atleta.modalidade
                });
            }
        });
        return vetObjLiteraisAtletals;
    }

    filtrarAtletasPorModalidade(modalidade) {
        var vetObjLiteraisAtletals = [];
        this.#vetAtletas.forEach(atleta => {
            if (atleta.habilitado && atleta.modalidade.includes(modalidade)) {
                vetObjLiteraisAtletals.push({
                    nome: atleta.nome,
                    idade: this.calcularIdade(atleta.dataNascimento),
                    nacionalidade: atleta.nacionalidade,
                    modalidade: atleta.modalidade
                });
            }
        });
        return vetObjLiteraisAtletals;
    }

    filtrarAtletasPorNome(nome) {
        var vetObjLiteraisAtletals = [];
        this.#vetAtletas.forEach(atleta => {
            if (atleta.habilitado && atleta.nome.includes(nome)) {
                vetObjLiteraisAtletals.push({
                    nome: atleta.nome,
                    idade: this.calcularIdade(atleta.dataNascimento),
                    nacionalidade: atleta.nacionalidade,
                    modalidade: atleta.modalidade
                });
            }
        });
        return vetObjLiteraisAtletals;
    }

    mostrarCompeticoesParticipadasPorAtleta(docIdentidade) {
        let atleta = this.consultarAtleta(docIdentidade);
        if (atleta !== undefined) {
            var vetObjLiteraisCompeticoes = [];
            this.#vetCompeticoes.forEach(competicao => {
                if (competicao.participantes.includes(atleta)) {
                    vetObjLiteraisCompeticoes.push({
                        nome: competicao.nome,
                        data: competicao.data,
                        local: competicao.local,
                        modalidade: competicao instanceof Maratona ? "Maratona" : "Trail Running"
                    });
                }
            });
            return vetObjLiteraisCompeticoes;
        }
        return [];
    }

    // ---------- Métodos para Competições ----------
    consultarCompeticao(nome) {
        return this.#vetCompeticoes.find(competicao => competicao.nome === nome);
    }

    cadastrarMaratona(nome, local, data, distancia, capacidade, altimetria, percursoUrbano) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao === undefined) {
            this.#vetCompeticoes.push(new Maratona(nome, local, data, distancia, capacidade, altimetria, percursoUrbano));
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    // Usa o nome anterior para localizar a prova durante uma renomeação e evitar nomes duplicados.
    editarMaratona(nome, local, data, distancia, capacidade, altimetria, percursoUrbano, nomeAnterior = nome) {
        let competicao = this.consultarCompeticao(nomeAnterior);
        if (nome !== nomeAnterior && this.consultarCompeticao(nome) !== undefined) {
            return false;
        }
        if (competicao !== undefined && competicao instanceof Maratona) {
            if (nome !== "" || nome !== competicao.nome) {
                competicao.nome = nome;
            }
            if (local !== "" || local !== competicao.local) {
                competicao.local = local;
            }
            if (data !== "" || data !== competicao.data) {
                competicao.data = data;
            }
            if (distancia !== "" || distancia !== competicao.distancia) {
                competicao.distancia = distancia;
            }
            if (capacidade !== "" || capacidade !== competicao.capacidade) {
                competicao.capacidade = capacidade;
            }
            if (altimetria !== "" || altimetria !== competicao.altimetria) {
                competicao.altimetria = altimetria;
            }
            if (percursoUrbano !== "" || percursoUrbano !== competicao.percursoUrbano) {
                competicao.percursoUrbano = percursoUrbano;
            }
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    cadastrarTrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao === undefined) {
            this.#vetCompeticoes.push(new TrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa));
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    // Usa o nome anterior para localizar a prova durante uma renomeação e evitar nomes duplicados.
    editarTrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa, nomeAnterior = nome) {
        let competicao = this.consultarCompeticao(nomeAnterior);
        if (nome !== nomeAnterior && this.consultarCompeticao(nome) !== undefined) {
            return false;
        }
        if (competicao !== undefined && competicao instanceof TrailRunning) {
            if (nome !== "" || nome !== competicao.nome) {
                competicao.nome = nome;
            }
            if (local !== "" || local !== competicao.local) {
                competicao.local = local;
            }
            if (data !== "" || data !== competicao.data) {
                competicao.data = data;
            }
            if (distancia !== "" || distancia !== competicao.distancia) {
                competicao.distancia = distancia;
            }
            if (capacidade !== "" || capacidade !== competicao.capacidade) {
                competicao.capacidade = capacidade;
            }
            if (tipoTerreno !== "" || tipoTerreno !== competicao.tipoTerreno) {
                competicao.tipoTerreno = tipoTerreno;
            }
            if (nivelDificuldade !== "" || nivelDificuldade !== competicao.nivelDificuldade) {
                competicao.nivelDificuldade = nivelDificuldade;
            }
            if (checkpoints !== "" || checkpoints !== competicao.checkpoints) {
                competicao.checkpoints = checkpoints;
            }
            if (tipoDisputa !== "" || tipoDisputa !== competicao.tipoDisputa) {
                competicao.tipoDisputa = tipoDisputa;
            }
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    deletarCompeticao(nome) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao !== undefined) {
            const index = this.#vetCompeticoes.indexOf(competicao);
            this.#vetCompeticoes.splice(index, 1);
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    cadastrarAtletaEmCompeticao(nomeCompeticao, docIdentidade) {
        let competicao = this.consultarCompeticao(nomeCompeticao);
        let atleta = this.consultarAtleta(docIdentidade);
        if (competicao !== undefined && competicao.adicionarParticipante(atleta)) {
            // A gravação fica direto no if para simplificar o fluxo e só ocorre após a inclusão.
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    // A ação Remover da tabela precisa atualizar o modelo e persistir a remoção.
    removerAtletaDaCompeticao(nomeCompeticao, docIdentidade) {
        let competicao = this.consultarCompeticao(nomeCompeticao);
        let atleta = this.consultarAtleta(docIdentidade);
        if (competicao !== undefined && competicao.removerParticipante(atleta)) {
            this.salvarLocalStorage();
            return true;
        }
        return false;
    }

    filtrarCompeticoesPorModalidade(modalidade) {
        let vetObjLiteraisCompeticoes = [];
        this.#vetCompeticoes.forEach(competicao => {
            if (competicao instanceof Maratona && modalidade === "Maratona") {
                vetObjLiteraisCompeticoes.push({
                    nome: competicao.nome,
                    local: competicao.local,
                    data: competicao.data,
                    distancia: competicao.distancia,
                    capacidade: competicao.capacidade,
                    modalidade: competicao instanceof Maratona ? "Maratona" : "Trail Running"
                });
            } else if (competicao instanceof TrailRunning && modalidade === "Trail Running") {
                vetObjLiteraisCompeticoes.push({
                    nome: competicao.nome,
                    local: competicao.local,
                    data: competicao.data,
                    distancia: competicao.distancia,
                    capacidade: competicao.capacidade,
                    modalidade: competicao instanceof Maratona ? "Maratona" : "Trail Running"
                });
            }
        });
        return vetObjLiteraisCompeticoes;
    }

    filtrarCompeticoesPorNome(nome) {
        let vetObjLiteraisCompeticoes = [];
        this.#vetCompeticoes.forEach(competicao => {
            if (competicao.nome.includes(nome)) {
                vetObjLiteraisCompeticoes.push({
                    nome: competicao.nome,
                    local: competicao.local,
                    data: competicao.data,
                    distancia: competicao.distancia,
                    capacidade: competicao.capacidade,
                    modalidade: competicao instanceof Maratona ? "Maratona" : "Trail Running"
                });
            }
        });
        return vetObjLiteraisCompeticoes;
    }

    salvarLocalStorage() {
        let strJSONVetAtletas = "[";
        for (let i = 0; i < this.#vetAtletas.length; i++) {
            if (i > 0) {
                strJSONVetAtletas += ",";
            }
            strJSONVetAtletas += this.#vetAtletas[i].stringify();
        }
        strJSONVetAtletas += "]";
        localStorage.setItem("atletasSalvos", strJSONVetAtletas);

        let strJSONVetCompeticoes = "[";
        for (let i = 0; i < this.#vetCompeticoes.length; i++) {
            if (i > 0) {
                strJSONVetCompeticoes += ",";
            }
            strJSONVetCompeticoes += this.#vetCompeticoes[i].stringify();
        }
        strJSONVetCompeticoes += "]";
        localStorage.setItem("competicoesSalvas", strJSONVetCompeticoes);
    }

    // Reconstrói os modelos com os campos salvos e resolve os vínculos pelos documentos.
    // Os dados de exemplo substituíam os registros do usuário a cada recarregamento.
    carregarDados() {
        const atletasSalvos = JSON.parse(localStorage.getItem("atletasSalvos") ?? "[]");
        const competicoesSalvas = JSON.parse(localStorage.getItem("competicoesSalvas") ?? "[]");

        this.#vetAtletas = atletasSalvos.map(dados => {
            const [primeira, ...outras] = [dados.modalidade].flat(Infinity).filter(Boolean);
            const atleta = new Atleta(dados.nome, dados.dataNascimento, dados.nacionalidade,
                primeira, dados.docIdentidade);
            for (const modalidade of outras) {
                atleta.adicionarModalidade(modalidade);
            }
            atleta.habilitado = dados.habilitado ?? true;
            return atleta;
        });

        this.#vetCompeticoes = competicoesSalvas.map(dados => {
            const participantes = (dados.participantes ?? []).map(registro => {
                const salvo = typeof registro === "string" ? JSON.parse(registro) : registro;
                return this.consultarAtleta(salvo.docIdentidade);
            }).filter(Boolean);
            const comuns = [dados.nome, dados.local, dados.data, dados.distancia, dados.capacidade];
            const trailRunning = dados.modalidade === "Trail Running" ||
                (dados.modalidade == null && ("tipoTerreno" in dados || "nivelDificuldade" in dados ||
                    "checkpoints" in dados || "tipoDisputa" in dados));
            if (trailRunning) {
                return new TrailRunning(...comuns, dados.tipoTerreno, dados.nivelDificuldade,
                    dados.checkpoints, dados.tipoDisputa, [...new Set(participantes)]);
            }
            return new Maratona(...comuns, dados.altimetria, dados.percursoUrbano, [...new Set(participantes)]);
        });
    }
}

/* -------------- Testes do localStorage --------------
const controller = new CompeticaoController();
controller.cadastrarAtleta("Atleta 3", "1995-03-20", "Chile", ["Maratona", "Trail Running"], "111222333");
controller.cadastrarMaratona("Competição 3", "Local 3", "2023-12-20", 10, 200, 100, false); 
controller.salvarLocalStorage();
*/
