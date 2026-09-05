const visor = document.getElementById('visor');

function addValor(valor) {
    if (visor.value === '0' || visor.value === 'Erro') {
        visor.value = '';
    }
    visor.value += valor;
}

function limpar() {
    visor.value = '0';
    visor.setAttribute('aria-label', 'Visor limpo');
}

function apagar() {
    if (visor.value !== 'Erro' && visor.value.length > 0) {
        visor.value = visor.value.slice(0, -1);
    }
    if (visor.value === '') visor.value = '0';
}

function calcular() {
    let expressao = visor.value;

    try {
        // Substituições Matemáticas
        expressao = expressao.replace(/×/g, '*').replace(/÷/g, '/');
        expressao = expressao.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
        expressao = expressao.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
        expressao = expressao.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
        expressao = expressao.replace(/log\(/g, 'Math.log10(');
        expressao = expressao.replace(/ln\(/g, 'Math.log(');
        expressao = expressao.replace(/√\(/g, 'Math.sqrt(');
        expressao = expressao.replace(/\^/g, '**');
        expressao = expressao.replace(/π/g, 'Math.PI');

        // Cálculo seguro
        let resultado = new Function('return ' + expressao)();
        
        if (resultado !== undefined && !isNaN(resultado)) {
            let final = Number(resultado.toFixed(8)).toString();
            visor.value = final;
            // Atualiza o aria-label para o leitor de tela ler o resultado
            visor.setAttribute('aria-label', 'Resultado: ' + final);
        } else {
            throw new Error();
        }
    } catch (e) {
        visor.value = 'Erro';
        visor.setAttribute('aria-label', 'Erro de cálculo');
    }
}

// Eventos de Teclado
document.addEventListener('keydown', (e) => {
    if (/[0-9]/.test(e.key)) addValor(e.key);
    if (['+', '-', '*', '/'].includes(e.key)) addValor(e.key);
    if (e.key === 'Enter') calcular();
    if (e.key === 'Backspace') apagar();
    if (e.key === 'Escape') limpar();
});
