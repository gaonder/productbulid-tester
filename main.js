// Teachable Machine 모델 URL
const URL = "https://teachablemachine.withgoogle.com/models/mgornywd/"; // 사용자의 모델 주소를 여기에 넣으세요 (기존 URL 패턴 참고)

let model, webcam, labelContainer, maxPredictions;

// 테마 토글 로직
const themeToggle = document.getElementById('theme-toggle');
let isDark = false;
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

// Disqus 연동
(function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://producttester-1.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();

// Teachable Machine 초기화 및 실행
async function init() {
    const startBtn = document.getElementById('start-btn');
    startBtn.style.display = 'none'; // 시작 버튼 숨기기
    
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.appendChild(webcam.canvas);
    
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        const barWrapper = document.createElement("div");
        barWrapper.className = "prediction-bar-wrapper";
        barWrapper.innerHTML = `
            <div class="label-name"></div>
            <div class="bar-container">
                <div class="bar"></div>
            </div>
            <div class="percentage"></div>
        `;
        labelContainer.appendChild(barWrapper);
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barWrapper = labelContainer.childNodes[i];
        barWrapper.querySelector(".label-name").innerText = className;
        barWrapper.querySelector(".bar").style.width = probability + "%";
        barWrapper.querySelector(".percentage").innerText = probability + "%";
    }
}
