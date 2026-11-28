import { Competicao } from "./Competicao.js";

export class Maratona extends Competicao {
    #altimetria;
    #percursoUrbano;

    constructor(nome, local, data, distancia, capacidade, altimetria, percursoUrbano, participantes) {
        super(nome, local, data, distancia, capacidade, participantes);
        this.#altimetria = altimetria;
        this.#percursoUrbano = percursoUrbano;
    }
    
    get altimetria() {
        return this.#altimetria;
    }
    
    get percursoUrbano() {
        return this.#percursoUrbano;
    }

    set altimetria(altimetria) {
        this.#altimetria = altimetria;
    }

    set percursoUrbano(percursoUrbano) {
        this.#percursoUrbano = percursoUrbano;
    }

    toString() {
        return `${super.toString()}
        \nAltimetria: ${this.#altimetria} m
        \nPercurso Urbano: ${this.#percursoUrbano ? "Sim" : "Não"}`;
    }
    stringify() {
        return JSON.stringify({
            ...JSON.parse(super.stringify()),
            modalidade: "Maratona",
            altimetria: this.#altimetria,
            percursoUrbano: this.#percursoUrbano
        });
    }

    stringfy() {
        return this.stringify();
    }
}
