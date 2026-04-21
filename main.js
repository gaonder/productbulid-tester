const URL = "https://teachablemachine.withgoogle.com/models/qfMH7oUjN/";

let model, labelContainer, maxPredictions;
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const uploadLabel = document.querySelector('.upload-label');
const resultArea = document.getElementById('result-area');
const resultDescription = document.getElementById('result-description');
const loadingSpinner = document.getElementById('loading-spinner');

// 결과별 상세 설명 데이터 (콘텐츠 보강용)
const resultDetails = {
    "강아지": "당신은 보는 사람마저 미소 짓게 만드는 따뜻하고 친근한 인상의 <b>강아지상</b>입니다! <br><br>처진 눈매와 부드러운 얼굴 선이 특징인 당신은 처음 보는 사람에게도 신뢰감을 주는 매력이 있습니다. 선한 눈망울은 당신의 가장 큰 매력 포인트입니다. <br><br>추천 스타일: 내추럴한 메이크업과 부드러운 파스텔톤의 의상이 당신의 따뜻한 분위기를 한층 살려줄 것입니다.",
    "고양이": "당신은 세련되고 도도한 매력이 넘치는 <b>고양이상</b>입니다! <br><br>시원하게 올라간 눈꼬리와 날렵한 턱선이 조화를 이루어 이지적이고 신비로운 분위기를 자아냅니다. 가만히 있어도 시선을 끄는 강렬한 아우라가 당신의 특징입니다. <br><br>추천 스타일: 화려한 포인트 메이크업이나 시크한 올블랙 룩이 당신의 도시적인 매력을 극대화해 줄 것입니다."
};

// 테마 토글
const themeToggle = document.getElementById('theme-toggle');
let isDark = false;
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

// Disqus
(function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://producttester-1.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();

async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    createLabelContainers();
}

function createLabelContainers() {
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const barWrapper = document.createElement("div");
        barWrapper.className = "prediction-bar-wrapper";
        barWrapper.innerHTML = `
            <div class="label-name" style="width:60px; font-weight:600;"></div>
            <div class="bar-container"><div class="bar"></div></div>
            <div class="percentage" style="width:40px; font-size:0.8rem;"></div>
        `;
        labelContainer.appendChild(barWrapper);
    }
}

imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    loadingSpinner.style.display = 'block';
    resultArea.style.display = 'none';

    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        uploadLabel.style.display = 'none';
        
        if (!model) await loadModel();
        await predict(imagePreview);
        
        loadingSpinner.style.display = 'none';
        resultArea.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    let topResult = { className: "", probability: 0 };

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const prob = prediction[i].probability;
        const probabilityPercent = (prob * 100).toFixed(0);
        
        const barWrapper = labelContainer.childNodes[i];
        barWrapper.querySelector(".label-name").innerText = className;
        barWrapper.querySelector(".bar").style.width = probabilityPercent + "%";
        barWrapper.querySelector(".percentage").innerText = probabilityPercent + "%";

        if (prob > topResult.probability) {
            topResult = { className, probability: prob };
        }
    }

    // 결과 상세 설명 출력
    const detailText = resultDetails[topResult.className] || "분석 결과를 기반으로 당신의 매력을 찾아보세요.";
    resultDescription.innerHTML = detailText;
}

loadModel();
