import { Atleta } from "./Atleta.js";
import { Maratona } from "./Maratona.js";
import { TrailRunning } from "./TrailRunning.js";

export class CorridaController {
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

    cadastrarAtletla(nome, dataNascimento, nacionalidade, modalidade, docIdentidade) {
        let atleta = this.consultarAtleta(docIdentidade);
        if (atleta === undefined) {
            this.#vetAtletas.push(new Atleta(nome, dataNascimento, nacionalidade, modalidade, docIdentidade));
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
}