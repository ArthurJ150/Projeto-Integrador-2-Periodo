export class Atleta {
    #nome;
    #dataNascimento;
    #nacionalidade;
    #modalidade = [];
    #docIdentidade;

    constructor(nome, dataNascimento, nacionalidade, modalidade = [], docIdentidade) {
        this.#nome = nome;
        this.#dataNascimento = dataNascimento;
        this.#nacionalidade = nacionalidade;
        this.#docIdentidade = docIdentidade;
        this.adicionarModalidade(modalidade);
    }

    get nome() {
        return this.#nome;
    }

    get dataNascimento() {
        return this.#dataNascimento;
    }

    get nacionalidade() {
        return this.#nacionalidade;
    }

    get modalidade() {
        return this.#modalidade.slice();
    }

    get docIdentidade() {
        return this.#docIdentidade;
    }

    set nome(nome) {
        this.#nome = nome;
    }

    set dataNascimento(dataNascimento) {
        this.#dataNascimento = dataNascimento;
    }

    set nacionalidade(nacionalidade) {
        this.#nacionalidade = nacionalidade;
    }

    adicionarModalidade(modalidade) {
        this.#modalidade.push(modalidade);
        return true;
    }

    removerModalidade(modalidade) {
        const index = this.#modalidade.indexOf(modalidade);
        if (index !== -1) {
            this.#modalidade.splice(index, 1);
            return true;
        }
        return false;
    }

    toString() {
        return `Nome: ${this.#nome}
        \nData de Nascimento: ${this.#dataNascimento}
        \nNacionalidade: ${this.#nacionalidade}
        \nModalidades: ${this.#modalidade.join(', ')}
        \nDocumento de Identidade: ${this.#docIdentidade}`;
    }
}