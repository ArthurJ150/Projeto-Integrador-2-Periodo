export class Corrida {
    #nome;
    #local;
    #data;
    #distancia;
    #capacidade;
    #participantes = [];

    constructor(nome, local, data, distancia, capacidade, participantes = []) {
        this.#nome = nome;
        this.#local = local;
        this.#data = data;
        if (distancia > 0) {
            this.#distancia = distancia;
        }
        if (capacidade > 0) {
            this.#capacidade = capacidade;
        }
        if (participantes instanceof Atleta) {
            this.#participantes.push(participantes);
        }
    }

    get nome() {
        return this.#nome;
    }

    get local() {
        return this.#local;
    }

    get data() {
        return this.#data;
    }

    get distancia() {
        return this.#distancia;
    }

    get capacidade() {
        return this.#capacidade;
    }

    get participantes() {
        return this.#participantes.slice();
    }

    set nome(nome) {
        this.#nome = nome;
    }

    set local(local) {
        this.#local = local;
    }

    set data(data) {
        this.#data = data;
    }

    set distancia(distancia) {
        if (distancia > 0) {
            this.#distancia = distancia;
        }
    }

    set capacidade(capacidade) {
        if (capacidade > 0) {
            this.#capacidade = capacidade;
        }
    }

    adicionarParticipante(atleta) {
        if (this.#participantes.length < this.#capacidade) {
            if (atleta instanceof Atleta) {
                this.#participantes.push(atleta);
                return true;
            }
        }
        return false;
    }

    removerParticipante(atleta) {
        if (atleta instanceof Atleta) {
            const index = this.#participantes.indexOf(atleta);
            if (index !== -1) {
                this.#participantes.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    toString() {
        return `Corrida: ${this.#nome};
        \nLocal: ${this.#local};
        \nData: ${this.#data};
        \nDistância: ${this.#distancia} km;
        \nCapacidade: ${this.#capacidade} participantes.`;
    }
}