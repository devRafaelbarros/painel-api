# Painel de Câmbio e Clima

Aplicação web que consome **duas APIs públicas** para mostrar cotações de moedas e a previsão do tempo, feita com **HTML, CSS e JavaScript puro**.

🔗 **Demo:** https://devrafaelbarros.github.io/painel-api/

## Funcionalidades

**Câmbio**
- Cotação de Dólar, Euro e Bitcoin em reais
- Variação do dia (alta, queda ou estável)
- Conversor de valores para real
- Botão para atualizar as cotações

**Clima**
- Busca de qualquer cidade pelo nome
- Temperatura, sensação térmica, umidade e vento
- Previsão para os próximos 5 dias
- Lembra a última cidade pesquisada

## APIs utilizadas

- [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas): cotações de moedas
- [Open-Meteo](https://open-meteo.com/): geocodificação e previsão do tempo

Nenhuma das duas exige chave de acesso.

## Tecnologias

- HTML5
- CSS3 (Grid, Flexbox, variáveis, efeito de vidro)
- JavaScript (fetch, async/await, DOM)
- localStorage

## O que pratiquei neste projeto

- Consumo de APIs com `fetch` e `async/await`
- Tratamento de erros com `try/catch` e checagem de `resposta.ok`
- Duas requisições encadeadas (cidade, depois clima)
- Leitura e uso de dados em JSON
- Criação de elementos na tela com `createElement` e `textContent`
- Formatação de moeda com `Intl.NumberFormat`

## Como rodar localmente

1. Clone o repositório: `git clone https://github.com/devRafaelbarros/painel-api.git`
2. Abra a pasta no VS Code
3. Abra o `index.html` com a extensão Live Server

## Próximas melhorias

- [ ] Gráfico com o histórico do dólar
- [ ] Escolher a unidade de temperatura (°C ou °F)
- [ ] Adicionar mais moedas

## Autor

**Rafael Barros**, estudante de Desenvolvimento Front-end.

- [LinkedIn](https://www.linkedin.com/in/rafaelbarrosdacosta)
- [GitHub](https://github.com/devRafaelbarros)
- [Portfólio](https://devrafaelbarros.github.io/meu-portfolio/)
