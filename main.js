// Teachable Machine 모델 URL
const URL = "https://teachablemachine.withgoogle.com/models/mgornywd/";

let model, labelContainer, maxPredictions;
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const uploadLabel = document.querySelector('.upload-label');

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

// Teachable Machine 모델 로드
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    createLabelContainers();
}

function createLabelContainers() {
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; // 초기화
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

// 파일 선택 시 이벤트
imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 미리보기 표시
    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        uploadLabel.style.display = 'none'; // 업로드 문구 숨기기
        
        if (!model) await loadModel();
        await predict(imagePreview);
    };
    reader.readAsDataURL(file);
});

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barWrapper = labelContainer.childNodes[i];
        barWrapper.querySelector(".label-name").innerText = className;
        barWrapper.querySelector(".bar").style.width = probability + "%";
        barWrapper.querySelector(".percentage").innerText = probability + "%";
    }
}

// 초기 모델 로드 (선택적)
loadModel();
