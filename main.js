class LottoNumbers extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render(numbers = []) {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: flex;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            }
            .lotto-number {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: var(--ball-bg, #ffffff);
                color: var(--ball-text, #212529);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.25rem;
                font-weight: 700;
                box-shadow: 0 4px 10px var(--ball-shadow, rgba(0, 0, 0, 0.1));
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s;
                border: 2px solid var(--primary-color);
                animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                opacity: 0;
            }
            @keyframes popIn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        </style>
        ${numbers.map((num, i) => `<div class="lotto-number" style="animation-delay: ${i * 0.1}s">${num}</div>`).join('')}
        `;
    }

    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        this.render(Array.from(numbers).sort((a, b) => a - b));
    }
}

customElements.define('lotto-numbers', LottoNumbers);

const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');

const lottoNumbers = document.createElement('lotto-numbers');
lottoNumbersContainer.appendChild(lottoNumbers);

generateBtn.addEventListener('click', () => {
    lottoNumbers.generateNumbers();
});

// Theme Toggle Logic
let isDark = false;
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    // Smooth transition for the balls if they exist
    lottoNumbers.render(lottoNumbers.shadowRoot.querySelectorAll('.lotto-number').length ? 
        Array.from(lottoNumbers.shadowRoot.querySelectorAll('.lotto-number')).map(el => el.textContent) : []);
});
