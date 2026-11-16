// ---------- Funções auxiliares ----------
function criar(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

const formatoReal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// ---------- Abas ----------
const abas = document.querySelectorAll('.aba');
const paineis = document.querySelectorAll('.painel');

abas.forEach(function (aba) {
    aba.addEventListener('click', function () {
        abas.forEach(function (a) { a.classList.remove('ativa'); });
        paineis.forEach(function (p) { p.classList.remove('ativo'); });
        aba.classList.add('ativa');
        document.getElementById(aba.dataset.aba).classList.add('ativo');
    });
});

// ---------- Câmbio ----------
const URL_CAMBIO = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL';
const MOEDAS = [
    { chave: 'USDBRL', nome: 'Dólar' },
    { chave: 'EURBRL', nome: 'Euro' },
    { chave: 'BTCBRL', nome: 'Bitcoin' }
];

const cambioCards = document.getElementById('cambio-cards');
const cambioMsg = document.getElementById('cambio-msg');
const cambioHora = document.getElementById('cambio-hora');
const inputValor = document.getElementById('valor');
const selectMoeda = document.getElementById('moeda');
const resultado = document.getElementById('resultado');

let cotacoes = null;

function desenharCambio() {
    cambioCards.replaceChildren();

    MOEDAS.forEach(function (moeda) {
        const dado = cotacoes[moeda.chave];
        const variacao = Number(Number(dado.pctChange).toFixed(2));
        const classe = variacao > 0 ? 'sobe' : variacao < 0 ? 'desce' : 'neutro';
        const seta = variacao > 0 ? '▲ ' : variacao < 0 ? '▼ ' : '● ';

        const card = criar('div', 'moeda');
        card.append(
            criar('p', 'nome', moeda.nome + ' (' + dado.code + ')'),
            criar('p', 'preco', formatoReal.format(Number(dado.bid))),
            criar('p', 'variacao ' + classe, seta + variacao.toFixed(2) + '% hoje')
        );
        cambioCards.appendChild(card);
    });
}

function converter() {
    if (!cotacoes) return;
    const valor = Number(inputValor.value);
    const taxa = Number(cotacoes[selectMoeda.value].bid);
    resultado.textContent = formatoReal.format(valor * taxa);
}

async function buscarCambio() {
    cambioMsg.textContent = 'Carregando cotações...';

    try {
        const resposta = await fetch(URL_CAMBIO);
        if (!resposta.ok) throw new Error('Erro na requisição');

        cotacoes = await resposta.json();
        desenharCambio();
        converter();
        cambioMsg.textContent = '';
        cambioHora.textContent = 'Atualizado às ' + new Date().toLocaleTimeString('pt-BR');
    } catch (erro) {
        cambioMsg.textContent = 'Não foi possível carregar as cotações. Tente novamente.';
    }
}

inputValor.addEventListener('input', converter);
selectMoeda.addEventListener('change', converter);
document.getElementById('atualizar').addEventListener('click', buscarCambio);// ---------- Clima ----------
const CODIGOS_CLIMA = {
    0: ['Céu limpo', '☀️'],
    1: ['Quase sem nuvens', '🌤️'],
    2: ['Parcialmente nublado', '⛅'],
    3: ['Nublado', '☁️'],
    45: ['Neblina', '🌫️'],
    48: ['Neblina com geada', '🌫️'],
    51: ['Garoa fraca', '🌦️'],
    53: ['Garoa', '🌦️'],
    55: ['Garoa forte', '🌦️'],
    61: ['Chuva fraca', '🌧️'],
    63: ['Chuva', '🌧️'],
    65: ['Chuva forte', '🌧️'],
    71: ['Neve fraca', '❄️'],
    73: ['Neve', '❄️'],
    75: ['Neve forte', '❄️'],
    80: ['Pancadas de chuva fracas', '🌦️'],
    81: ['Pancadas de chuva', '🌧️'],
    82: ['Pancadas de chuva fortes', '⛈️'],
    95: ['Trovoada', '⛈️'],
    96: ['Trovoada com granizo', '⛈️'],
    99: ['Trovoada com granizo forte', '⛈️']
};

function descreverClima(codigo) {
    return CODIGOS_CLIMA[codigo] || ['Condição desconhecida', '🌡️'];
}

const formClima = document.getElementById('form-clima');
const inputCidade = document.getElementById('cidade');
const climaMsg = document.getElementById('clima-msg');
const climaResultado = document.getElementById('clima-resultado');

function desenharClima(local, dados) {
    const atual = dados.current;
    const descricao = descreverClima(atual.weather_code);

    const caixa = criar('div', 'atual');
    caixa.append(
        criar('p', 'emoji', descricao[1]),
        criar('p', 'cidade', local.name),
        criar('p', 'local', [local.admin1, local.country].filter(Boolean).join(', ')),
        criar('p', 'temp', Math.round(atual.temperature_2m) + '°C'),
        criar('p', 'desc', descricao[0])
    );

    const detalhes = criar('div', 'detalhes');
    detalhes.append(
        criar('span', '', '🌡️ Sensação: ' + Math.round(atual.apparent_temperature) + '°C'),
        criar('span', '', '💧 Umidade: ' + atual.relative_humidity_2m + '%'),
        criar('span', '', '💨 Vento: ' + Math.round(atual.wind_speed_10m) + ' km/h')
    );
    caixa.appendChild(detalhes);

    const previsao = criar('div', 'previsao');
    dados.daily.time.forEach(function (dia, i) {
        const emojiDia = descreverClima(dados.daily.weather_code[i])[1];
        const data = new Date(dia + 'T00:00:00');
        const semana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
        const maxima = Math.round(dados.daily.temperature_2m_max[i]);
        const minima = Math.round(dados.daily.temperature_2m_min[i]);

        const item = criar('div', 'dia');
        item.append(
            criar('p', 'semana', semana),
            criar('p', 'emoji', emojiDia),
            criar('p', '', maxima + '° / ' + minima + '°')
        );
        previsao.appendChild(item);
    });

    climaResultado.replaceChildren(caixa, previsao);
}

async function buscarClima(cidade) {
    climaMsg.textContent = 'Buscando...';
    climaResultado.replaceChildren();

    try {
        // 1) Descobre latitude e longitude da cidade
        const urlGeo = 'https://geocoding-api.open-meteo.com/v1/search?name='
            + encodeURIComponent(cidade) + '&count=1&language=pt&format=json';
        const respostaGeo = await fetch(urlGeo);
        if (!respostaGeo.ok) throw new Error('Erro na busca da cidade');

        const geo = await respostaGeo.json();
        if (!geo.results || geo.results.length === 0) {
            climaMsg.textContent = 'Cidade não encontrada. Confira o nome e tente de novo.';
            return;
        }
        const local = geo.results[0];

        // 2) Busca o clima atual e a previsão para essa localização
        const urlClima = 'https://api.open-meteo.com/v1/forecast'
            + '?latitude=' + local.latitude + '&longitude=' + local.longitude
            + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code'
            + '&daily=weather_code,temperature_2m_max,temperature_2m_min'
            + '&timezone=auto&forecast_days=5';
        const respostaClima = await fetch(urlClima);
        if (!respostaClima.ok) throw new Error('Erro na previsão');

        const dados = await respostaClima.json();
        desenharClima(local, dados);
        climaMsg.textContent = '';
        localStorage.setItem('ultimaCidade', cidade);
    } catch (erro) {
        climaMsg.textContent = 'Não foi possível carregar o clima. Tente novamente.';
    }
}

formClima.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const cidade = inputCidade.value.trim();
    if (cidade === '') return;
    buscarClima(cidade);
});

// ---------- Início ----------
buscarCambio();
const ultimaCidade = localStorage.getItem('ultimaCidade') || 'São Paulo';
inputCidade.value = ultimaCidade;
buscarClima(ultimaCidade);