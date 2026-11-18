import { Competicao } from "./Competicao.js";

export class TrailRunning extends Competicao {
    #tipoTerreno;
    #nivelDificuldade;
    #checkpoints;
    #tipoDisputa;

    constructor(nome, local, data, distancia, capacidade, tipoTerreno, nivelDificuldade, checkpoints, tipoDisputa) {
        super(nome, local, data, distancia, capacidade);
        this.#tipoTerreno = tipoTerreno;
        this.#nivelDificuldade = nivelDificuldade;
        if (checkpoints > 0) {
            this.#checkpoints = checkpoints;
        }
        this.#tipoDisputa = tipoDisputa;
    }

    get tipoTerreno() {
        return this.#tipoTerreno;
    }

    get nivelDificuldade() {
        return this.#nivelDificuldade;
    }

    get checkpoints() {
        return this.#checkpoints;
    }

    get tipoDisputa() {
        return this.#tipoDisputa;
    }

    set tipoTerreno(tipoTerreno) {
        this.#tipoTerreno = tipoTerreno;
    }

    set nivelDificuldade(nivelDificuldade) {
        this.#nivelDificuldade = nivelDificuldade;
    }

    set checkpoints(checkpoints) {
        if (checkpoints > 0) {
            this.#checkpoints = checkpoints;
        }
    }

    set tipoDisputa(tipoDisputa) {
        this.#tipoDisputa = tipoDisputa;
    }

    toString() {
        return `${super.toString()}
        \nTipo de Terreno: ${this.#tipoTerreno}
        \nNível de Dificuldade: ${this.#nivelDificuldade}
        \nCheckpoints: ${this.#checkpoints}
        \nTipo de Disputa: ${this.#tipoDisputa}`;
    }
}