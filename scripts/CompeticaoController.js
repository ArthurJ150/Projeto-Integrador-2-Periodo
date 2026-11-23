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
        let atleta = this.consultarAtleta(docIdentidade);
        let competicoes = this.#vetCompeticoes.filter(competicao => competicao.participantes.includes(atleta));
        if (atleta !== undefined) {
            const index = this.#vetAtletas.indexOf(atleta);
            this.#vetAtletas.splice(index, 1);
            if (competicoes.length > 0) {
                atleta.habilitado = false;
            }
            return true;
        }
        return false;   
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

    cadastrarTrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa) {
        let competicao = this.consultarCompeticao(nome);
        if (competicao === undefined) {
            this.#vetCompeticoes.push(new TrailRunning(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa));
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