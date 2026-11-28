
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
            return true;
        }
        return false;
    }

    listarAtletas() {
        var vetObjLiteraisAtletals = [];
        this.#vetAtletas.forEach(atleta => {
            if (atleta.habilitado) {
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
            return true;
        }
        return false;
    }

    editarMaratona(nome, local, data, distancia, capacidade, altimetria, percursoUrbano) {
        let competicao = this.consultarCompeticao(nome);
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
            return true;
        }
        return false;
    }

    cadastrarTrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao === undefined) {
            this.#vetCompeticoes.push(new TrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa));
            return true;
        }
        return false;
    }

    editarTrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa) {
        let competicao = this.consultarCompeticao(nome);
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
            return true;
        }
        return false;
    }

    deletarCompeticao(nome) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao !== undefined) {
            const index = this.#vetCompeticoes.indexOf(competicao);
            this.#vetCompeticoes.splice(index, 1);
            return true;
        }
        return false;
    }

    cadastrarAtletaEmCompeticao(nomeCompeticao, docIdentidade) {
        let competicao = this.consultarCompeticao(nomeCompeticao);
        let atleta = this.consultarAtleta(docIdentidade);
        if (competicao !== undefined && atleta !== undefined) {
            return competicao.adicionarParticipante(atleta);
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

    carregarDados() {
        
        if (localStorage.hasOwnProperty("atletasSalvos")) {
            let strJSONVetAtletas = localStorage.getItem("atletasSalvos");

            let vetAtletasSalvos = JSON.parse(strJSONVetAtletas);

            vetAtletasSalvos.forEach(objLitAtleta => {
                let atleta = new Atleta(
                    objLitAtleta.nome,
                    objLitAtleta.dataNascimento,
                    objLitAtleta.nacionalidade,
                    objLitAtleta.modalidade[0],
                    objLitAtleta.docIdentidade
                );

                for (let i = 1; i < objLitAtleta.modalidade.length; i++) {
                    atleta.adicionarModalidade(objLitAtleta.modalidade[i]);
                }

                atleta.habilitado = objLitAtleta.habilitado;

                this.#vetAtletas.push(atleta);
            });
        
            this.#vetAtletas = [
                new Atleta("Atleta 1", "1990-01-01", "Brasil", ["Maratona"], "123456789"),
                new Atleta("Atleta 2", "1985-05-15", "Argentina", ["Trail Running"], "987654321")
            ];
        }
        
        if (localStorage.hasOwnProperty("competicoesSalvas")) {
            let strJSONVetCompeticoes = localStorage.getItem("competicoesSalvas");

            let vetCompeticoesSalvas = JSON.parse(strJSONVetCompeticoes);

            vetCompeticoesSalvas.forEach(objLitCompeticao => {
                let competicao;
                if (objLitCompeticao.hasOwnProperty("altimetria")) {
                    competicao = new TrailRunning(
                        objLitCompeticao.nome,
                        objLitCompeticao.data,
                        objLitCompeticao.local,
                        objLitCompeticao.distancia,
                        objLitCompeticao.altimetria,
                        objLitCompeticao.tipoTerreno,
                        objLitCompeticao.dificuldade,
                        objLitCompeticao.numParticipantes,
                        objLitCompeticao.modalidade
                    );
                } else {
                    competicao = new Maratona(
                        objLitCompeticao.nome,
                        objLitCompeticao.data,
                        objLitCompeticao.local,
                        objLitCompeticao.distancia,
                        objLitCompeticao.numParticipantes,
                        objLitCompeticao.precoInscricao,
                        objLitCompeticao.habilitada
                    );
                }
                this.#vetCompeticoes.push(competicao);
            });
        
            this.#vetCompeticoes = [
                new Maratona("Competição 1", "2023-10-10", "Local 1", 42.195, 100, 500, true),
                new TrailRunning("Competição 2", "2023-11-15", "Local 2", 21.097, 50, "Montanhoso", "Difícil", 5, "Individual")
            ];
        }
    }
}
const controller = new CompeticaoController();
controller.cadastrarAtleta("Atleta 3", "1995-03-20", "Chile", ["Maratona", "Trail Running"], "111222333");
controller.cadastrarMaratona("Competição 3", "Local 3", "2023-12-20", 10, 200, 100, false); 
controller.salvarLocalStorage();



