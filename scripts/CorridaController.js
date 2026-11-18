import { Atleta } from "./Atleta.js";
import { Corrida } from "./Maratona.js";
import { Maratona } from "./TrailRunning.js";

export class CorridaController {
    #vetCorridas;
    #vetAtletas;

    constructor() {
        this.#vetCorridas = [];
        this.#vetAtletas = [];
    }

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
}