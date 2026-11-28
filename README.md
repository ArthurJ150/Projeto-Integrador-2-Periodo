# Gestão de Competições

Projeto Integrador do 2º período para gerenciar competições esportivas e atletas. A aplicação foi desenvolvida com HTML, CSS e JavaScript e roda diretamente no navegador.

## Funcionalidades

| **Competições** | Buscar eventos por nome ou local, filtrar por modalidade e cadastrar novas competições. Em **Gerenciar inscritos**, é possível editar ou excluir a competição, ver as vagas disponíveis e inscrever, buscar ou remover atletas.

| **Atletas** | Buscar atletas por nome ou país, filtrar por modalidade e cadastrar novos atletas. Em **Ver ficha**, é possível consultar os dados e as competições vinculadas, além de editar ou excluir o cadastro.

| **Relatório** | Consultar a capacidade, as vagas ocupadas e as vagas disponíveis por competição, com uma linha de totais.

Na ficha do atleta, o rótulo **Participou** indica uma inscrição em uma competição cuja data já passou. A exclusão de um atleta libera suas vagas nas competições vinculadas.

## Como inscrever um atleta

1. Na aba **Competições**, escolha um evento e clique em **Gerenciar inscritos**.
2. Clique em **Inscrever Atleta**.
3. Escolha uma das opções na janela:
   - **Atleta Cadastrado** — digite parte do nome, selecione um resultado e clique em **Confirmar Inscrição**. A busca aceita nomes sem acentos e mostra até 20 resultados por vez.
   - **Novo Atleta** — preencha o formulário e clique em **Cadastrar e Inscrever** para salvar o atleta e sua inscrição juntos.

Somente atletas que ainda têm uma inscrição disponível naquela competição aparecem na busca, e a inscrição respeita o limite de vagas.

## Onde os dados ficam salvos

Cadastros, alterações e inscrições ficam no `localStorage` do navegador. Eles continuam disponíveis ao recarregar a página no mesmo perfil do navegador e pelo mesmo endereço. A limpeza dos dados armazenados da página apaga as alterações locais.