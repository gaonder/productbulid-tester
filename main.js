
class LottoNumbers extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        this.shadowRoot.innerHTML = Array.from(numbers).sort((a, b) => a - b)
            .map(number => `<div class="lotto-number">${number}</div>`).join('');
    }
}

customElements.define('lotto-numbers', LottoNumbers);

const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const generateBtn = document.getElementById('generate-btn');

const lottoNumbers = document.createElement('lotto-numbers');
lottoNumbersContainer.appendChild(lottoNumbers);

generateBtn.addEventListener('click', () => {
    lottoNumbers.generateNumbers();
});
