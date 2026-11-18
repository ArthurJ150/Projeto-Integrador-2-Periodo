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
}