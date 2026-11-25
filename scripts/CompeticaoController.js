import { Atleta } from "./Atleta.js";
import { Maratona } from "./Maratona.js";
import { TrailRunning } from "./TrailRunning.js";

export class CompeticaoController {
    #vetCompeticoes;
    #vetAtletas;

    constructor() {
        this.#vetCompeticoes = [];
        this.#vetAtletas = [];
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
            if(nome !== "" || nome !== atleta.nome) {
                atleta.nome = nome;
            }
            if(dataNascimento !== "" || dataNascimento !== atleta.dataNascimento) {
                atleta.dataNascimento = dataNascimento;
            }
            if(nacionalidade !== "" || nacionalidade !== atleta.nacionalidade) {
                atleta.nacionalidade = nacionalidade;
            }
            if(modalidade !== "") {
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

    listarAtletas(){
        var vetObjLiteraisAtletals = [];
        this.#vetAtletas.forEach(atleta => {
            if(atleta.habilitado){
                vetObjLiteraisAtletals.push({
                    nome: atleta.nome,
                    dataNascimento: atleta.dataNascimento,
                    nacionalidade: atleta.nacionalidade,
                    modalidade: atleta.modalidade,
                    docIdentidade: atleta.docIdentidade
                });
            }
        });
        return vetObjLiteraisAtletals;
    }

    filtrarAtletasPorModalidade(modalidade) {
        var vetObjLiteraisAtletals = [];
        this.#vetAtletas.forEach(atleta => {
            if(atleta.habilitado && atleta.modalidade.includes(modalidade)) {
                vetObjLiteraisAtletals.push({
                    nome: atleta.nome,
                    dataNascimento: atleta.dataNascimento,
                    nacionalidade: atleta.nacionalidade,
                    modalidade: atleta.modalidade,
                    docIdentidade: atleta.docIdentidade
                });
            }
        });
        return vetObjLiteraisAtletals;
    }

    filtrarAtletasPorNome(nome) {
        var vetObjLiteraisAtletals = [];
        this.#vetAtletas.forEach(atleta => {
            if(atleta.habilitado && atleta.nome.includes(nome)) {
                vetObjLiteraisAtletals.push({
                    nome: atleta.nome,
                    dataNascimento: atleta.dataNascimento,
                    nacionalidade: atleta.nacionalidade,
                    modalidade: atleta.modalidade,
                    docIdentidade: atleta.docIdentidade
                });
            }
        });
        return vetObjLiteraisAtletals;
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

    deletarMaratona(nome) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao !== undefined && competicao instanceof Maratona) {
            const index = this.#vetCompeticoes.indexOf(competicao);
            this.#vetCompeticoes.splice(index, 1);
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

    deletarTrailRunning(nome) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao !== undefined && competicao instanceof TrailRunning) {
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
}