let questions = [];
let currentQuestionIndex = 0;
let timer = 30;
let timerInterval;
let answers = []; // Kullanıcı cevaplarını saklayacağız

// API'den soruları çekiyoruz
async function fetchQuestions() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  questions = data.slice(0, 10); // İlk 10 soruyu alıyoruz
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    clearInterval(timerInterval);
    showResults(); // Test bitince sonuçları göster
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById('question-title').innerText = question.title;

  // Şıkların içeriği (random bir şekilde simüle edeceğiz)
  document.getElementById('choiceA').innerText = 'A. ' + question.body.slice(0, 20);
  document.getElementById('choiceB').innerText = 'B. ' + question.body.slice(20, 40);
  document.getElementById('choiceC').innerText = 'C. ' + question.body.slice(40, 60);
  document.getElementById('choiceD').innerText = 'D. ' + question.body.slice(60, 80);

  disableChoices(true); // İlk 10 saniye şıkları pasif yapıyoruz
  startTimer();
}

function disableChoices(disable) {
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(button => {
    button.disabled = disable;
    button.classList.toggle('active', !disable);
  });
}

function startTimer() {
  timer = 30;
  document.getElementById('time').innerText = timer;
  
  timerInterval = setInterval(() => {
    timer--;

    if (timer === 20) {
      disableChoices(false); // 10 saniye sonra şıkları etkinleştiriyoruz
    }

    if (timer === 0) {
      nextQuestion(); // 30 saniye dolunca bir sonraki soruya geç
    }

    document.getElementById('time').innerText = timer;
  }, 1000);
}

function nextQuestion() {
  clearInterval(timerInterval);
  currentQuestionIndex++;
  loadQuestion();
}

// Kullanıcı cevaplarını kaydet
function selectAnswer(choice) {
  const answer = {
    question: questions[currentQuestionIndex].title,
    selectedAnswer: choice.innerText
  };
  answers.push(answer);

  nextQuestion(); // Bir sonraki soruya geç
}

// Şık butonlarına tıklama olaylarını dinleyelim
document.getElementById('choiceA').addEventListener('click', function() { selectAnswer(this); });
document.getElementById('choiceB').addEventListener('click', function() { selectAnswer(this); });
document.getElementById('choiceC').addEventListener('click', function() { selectAnswer(this); });
document.getElementById('choiceD').addEventListener('click', function() { selectAnswer(this); });

// Sonuçları tablo olarak göster
function showResults() {
  const resultContainer = document.createElement('div');
  resultContainer.innerHTML = `
    <h2>Sonuçlar</h2>
    <table border="1" id="resultTable">
      <tr>
        <th>Soru</th>
        <th>Verilen Cevap</th>
      </tr>
    </table>
  `;

  document.getElementById('app').innerHTML = ''; // Mevcut quiz ekranını temizle
  document.getElementById('app').appendChild(resultContainer); // Yeni tabloyu ekle

  // Kullanıcı cevaplarını tabloya ekleyelim
  const resultTable = document.getElementById('resultTable');
  answers.forEach(answer => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${answer.question}</td>
      <td>${answer.selectedAnswer}</td>
    `;
    resultTable.appendChild(row);
  });
}

// Uygulama başladığında soruları çek
fetchQuestions();
