import { Competicao } from "./Competicao.js";

export class Maratona extends Competicao {
    #altimetria;
    #percursoUrbano;

    constructor(nome, local, data, distancia, capacidade, altimetria, percursoUrbano) {
        super(nome, local, data, distancia, capacidade);
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
}