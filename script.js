'use strict';

/* =========================================
   SLIDE NAVIGATION
========================================= */
const wrapper = document.getElementById('slides-wrapper');
const slides = document.querySelectorAll('.slide');
const total = slides.length;
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const fill = document.getElementById('progress-fill');
const counter = document.getElementById('slide-counter');

let currentIdx = 0;

function goTo(idx) {
    if (idx < 0 || idx >= total) return;
    currentIdx = idx;
    slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateUI();
}

function updateUI() {
    const pct = (currentIdx / (total - 1)) * 100;
    fill.style.width = pct + '%';
    counter.textContent = (currentIdx + 1) + ' / ' + total;
    btnPrev.disabled = currentIdx === 0;
    btnNext.disabled = currentIdx === total - 1;
}

btnPrev.addEventListener('click', () => goTo(currentIdx - 1));
btnNext.addEventListener('click', () => goTo(currentIdx + 1));

// Sync currentIdx when user scrolls manually
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            currentIdx = +e.target.dataset.index;
            updateUI();
        }
    });
}, { root: wrapper, threshold: 0.5 });
slides.forEach(s => observer.observe(s));

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(currentIdx + 1);
    if (e.key === 'ArrowUp' || e.key === 'PageUp') goTo(currentIdx - 1);
});

updateUI();


/* =========================================
   SLIDE 3 – INDEX CLICK DEMO
========================================= */
document.querySelectorAll('#idx-demo .va-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        document.querySelectorAll('#idx-demo .va-cell').forEach(c => c.classList.remove('active'));
        cell.classList.add('active');
        const v = cell.dataset.v, i = cell.dataset.i;
        document.getElementById('idx-output').textContent =
            `A[${i}] = ${v}  ←  это ${i === '0' ? 'первый' : i === '4' ? 'последний' : 'элемент с индексом ' + i} массива`;
    });
});


/* =========================================
   SLIDE 6 – LOOP VISUALIZER
========================================= */
const loopArr = [7, 12, 5, 99, 3];
const loopCells = document.querySelectorAll('#loop-arr .va-cell');
const loopConsole = document.getElementById('loop-console');
const loopOutput = document.getElementById('loop-output');
let loopTimer = null;

function resetLoop() {
    loopCells.forEach(c => c.classList.remove('active', 'done'));
    loopConsole.innerHTML = '';
    loopOutput.textContent = 'Нажми ▶ чтобы запустить';
    document.getElementById('btn-loop-play').disabled = false;
    clearTimeout(loopTimer);
}

document.getElementById('btn-loop-reset').addEventListener('click', resetLoop);
document.getElementById('btn-loop-play').addEventListener('click', () => {
    document.getElementById('btn-loop-play').disabled = true;
    loopConsole.innerHTML = '';
    loopCells.forEach(c => c.classList.remove('active', 'done'));

    function step(i) {
        if (i > 0) { loopCells[i - 1].classList.remove('active'); loopCells[i - 1].classList.add('done'); }
        if (i >= loopArr.length) {
            loopOutput.textContent = '✅ Цикл завершён! Все элементы перебраны.';
            return;
        }
        loopCells[i].classList.add('active');
        loopOutput.textContent = `i = ${i} → A[${i}] = ${loopArr[i]}`;
        loopConsole.innerHTML += `<div>print(A[${i}]) → ${loopArr[i]}</div>`;
        loopTimer = setTimeout(() => step(i + 1), 900);
    }
    step(0);
});


/* =========================================
   SLIDE 9 – MAX FINDER
========================================= */
const MAX_ARR = [7, 12, 5, 99, 3];
let maxStep = -1, currentMax = null, maxWinner = 0;
const maxCells = document.querySelectorAll('#max-arr-vis .va-cell');
const champVal = document.getElementById('champ-val');
const maxLog = document.getElementById('max-log');

function renderMaxCells() {
    maxCells.forEach((c, i) => {
        c.classList.remove('active', 'winner', 'done');
        if (maxStep > i) c.classList.add('done');
        if (maxStep === i) c.classList.add('active');
        if (i === maxWinner && maxStep >= 0) c.classList.add('winner');
    });
}

function resetMax() {
    maxStep = -1; currentMax = null; maxWinner = 0;
    champVal.textContent = '?';
    maxLog.textContent = 'Нажми «Следующий шаг» для старта';
    maxLog.style.color = '';
    document.getElementById('btn-max-step').disabled = false;
    maxCells.forEach(c => c.classList.remove('active', 'winner', 'done'));
}

function stepMax() {
    if (maxStep === -1) {
        maxStep = 0;
        currentMax = MAX_ARR[0];
        maxWinner = 0;
        champVal.textContent = currentMax;
        maxLog.textContent = `Шаг 0: Берём A[0] = ${currentMax} как первого «чемпиона».`;
        renderMaxCells();
        maxStep = 1;
        return;
    }
    if (maxStep >= MAX_ARR.length) {
        maxLog.textContent = `✅ Готово! Максимум = ${currentMax}`;
        maxLog.style.color = '#10b981';
        document.getElementById('btn-max-step').disabled = true;
        return;
    }
    const i = maxStep;
    const val = MAX_ARR[i];
    renderMaxCells();
    maxCells[i].classList.add('active');

    if (val > currentMax) {
        const old = currentMax;
        currentMax = val;
        maxWinner = i;
        champVal.textContent = currentMax;
        maxLog.textContent = `Шаг ${i}: A[${i}] = ${val} > ${old} → новый чемпион!`;
        maxLog.style.color = '#10b981';
    } else {
        maxLog.textContent = `Шаг ${i}: A[${i}] = ${val} ≤ ${currentMax} → чемпион не меняется.`;
        maxLog.style.color = '';
    }
    maxStep++;
    if (maxStep >= MAX_ARR.length) {
        setTimeout(() => {
            maxLog.textContent = `✅ Готово! Максимум = ${currentMax}`;
            maxLog.style.color = '#10b981';
            document.getElementById('btn-max-step').disabled = true;
        }, 600);
    }
}

document.getElementById('btn-max-step').addEventListener('click', stepMax);
document.getElementById('btn-max-reset').addEventListener('click', resetMax);


/* =========================================
   SLIDE 12 – TEST
========================================= */
const questions = [
    {
        q: 'С какого индекса начинается нумерация элементов массива в Python?',
        opts: ['С 1', 'С 0', 'С -1', 'С любого числа'],
        ok: 1,
        tip: 'В Python первый элемент всегда имеет индекс 0. Это фундаментальное правило!'
    },
    {
        q: 'Что делает команда A.append(42)?',
        opts: ['Удаляет элемент 42', 'Добавляет 42 в начало массива', 'Добавляет 42 в конец массива', 'Находит элемент 42'],
        ok: 2,
        tip: 'append() всегда добавляет элемент в конец списка.'
    },
    {
        q: 'Массив A = [3, 5, 8]. Чему равно выражение len(A)?',
        opts: ['2', '3', '8', '0'],
        ok: 1,
        tip: 'len() возвращает количество элементов. В массиве [3, 5, 8] три элемента → len = 3.'
    },
    {
        q: 'Какой элемент вернёт A[-1] для массива A = [10, 20, 30]?',
        opts: ['10', '20', '30', 'Ошибка'],
        ok: 2,
        tip: 'Индекс -1 всегда указывает на последний элемент. A[-1] = 30.'
    },
    {
        q: 'Как правильно создать массив из 5 нулей?',
        opts: ['A = [0, 5]', 'A = 5 * [0]', 'A = zeros(5)', 'A = [5] + 0'],
        ok: 1,
        tip: 'A = [0] * 5 или A = 5 * [0] — оба варианта создают [0, 0, 0, 0, 0]. Второй вариант тоже правильный!'
    },
    {
        q: 'Чему равна сумма элементов массива A = [2, 4, 6]?',
        opts: ['10', '12', '6', '8'],
        ok: 1,
        tip: '2 + 4 + 6 = 12. Функция sum([2, 4, 6]) вернёт 12.'
    },
    {
        q: 'Переменная k = 0. Мы считаем элементы > 5 в массиве [1, 7, 3, 9, 2]. Чему будет равно k?',
        opts: ['1', '2', '3', '5'],
        ok: 1,
        tip: 'Больше 5 только числа 7 и 9. Значит, k увеличится дважды → k = 2.'
    },
    {
        q: 'Какая встроенная функция Python находит наибольший элемент массива?',
        opts: ['maximum(A)', 'max(A)', 'biggest(A)', 'A.max()'],
        ok: 1,
        tip: 'Правильный ответ: max(A). Функция встроена в Python и работает сразу.'
    }
];

let qIdx = 0, score = 0, answered = false;
let stuName = '', stuSurname = '';

document.getElementById('test-form').addEventListener('submit', e => {
    e.preventDefault();
    stuName = document.getElementById('stu-name').value.trim();
    stuSurname = document.getElementById('stu-surname').value.trim();
    if (!stuName || !stuSurname) return;
    document.getElementById('test-intro').classList.add('hidden');
    document.getElementById('test-quiz').classList.remove('hidden');
    qIdx = 0; score = 0;
    showQ(0);
});

function showQ(i) {
    if (i >= questions.length) { showResult(); return; }
    answered = false;
    const q = questions[i];
    document.getElementById('q-num').textContent = `Вопрос ${i + 1} из ${questions.length}`;
    document.getElementById('q-fill').style.width = (i / questions.length * 100) + '%';
    document.getElementById('q-text').textContent = q.q;
    const fb = document.getElementById('q-feedback');
    fb.className = 'q-feedback hidden';
    fb.textContent = '';
    const box = document.getElementById('q-options');
    box.innerHTML = '';
    q.opts.forEach((opt, oi) => {
        const btn = document.createElement('button');
        btn.className = 'q-option'; btn.textContent = opt;
        btn.addEventListener('click', () => pick(oi));
        box.appendChild(btn);
    });
}

function pick(oi) {
    if (answered) return; answered = true;
    const q = questions[qIdx];
    const btns = document.querySelectorAll('.q-option');
    btns.forEach(b => b.disabled = true);
    const fb = document.getElementById('q-feedback');
    if (oi === q.ok) {
        score++;
        btns[oi].classList.add('correct');
        fb.textContent = '✅ Правильно! ' + q.tip;
        fb.className = 'q-feedback correct-fb';
    } else {
        btns[oi].classList.add('wrong');
        btns[q.ok].classList.add('correct');
        fb.textContent = '❌ Неверно. ' + q.tip;
        fb.className = 'q-feedback wrong-fb';
    }
    setTimeout(() => { qIdx++; showQ(qIdx); }, 2000);
}

function showResult() {
    document.getElementById('q-fill').style.width = '100%';
    document.getElementById('test-quiz').classList.add('hidden');
    document.getElementById('test-result').classList.remove('hidden');
    document.getElementById('result-score-txt').textContent = score + '/' + questions.length;
    document.getElementById('result-name').textContent = `${stuSurname} ${stuName}`;

    let grade;
    let msg;
    if (score === 8) {
        grade = 5;
        msg = '🏆 Блестяще! Твоя оценка: 5. Отличная работа!';
    } else if (score >= 6) {
        grade = 4;
        msg = '👍 Твоя оценка: 4. Хорошая работа!';
    } else if (score >= 4) {
        grade = 3;
        msg = '📖 Твоя оценка: 3. Тема требует повторения.';
    } else {
        grade = 2;
        msg = '💡 Оценка: 2. Пройди урок ещё раз.';
    }

    document.getElementById('result-msg').innerHTML = `<strong style="font-size:1.2rem; color:var(--blue);">Оценка: ${grade}</strong><br><br>` + msg;

    // Отправляем на сервер
    sendToGoogleSheets(stuName, stuSurname, score, grade);
}

function sendToGoogleSheets(name, surname, rawScore, grade) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwFRxQ2xb3-rNoDeOiuxzrM56YGbS8xsLY_rXirL0zKLBqFwmZvobuqUn6gqWClICHx/exec';

    const payload = {
        name: name,
        surname: surname,
        score: rawScore,
        maxScore: questions.length,
        grade: grade
    };

    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8' // отправка как text/plain предотвращает CORS OPTIONS-запрос
        },
        body: JSON.stringify(payload)
    })
        .then(() => {
            // Как только реквест ушёл
            const existingNote = document.getElementById('sent-note');
            if (existingNote) existingNote.remove();

            const note = document.createElement('div');
            note.id = 'sent-note';
            note.style.marginTop = '1.5rem';
            note.style.padding = '0.8rem';
            note.style.background = '#ecfdf5';
            note.style.border = '1px solid #10b981';
            note.style.borderRadius = '8px';
            note.style.color = '#047857';
            note.style.fontWeight = '800';
            note.textContent = '✅ Данные успешно отправлены учителю!';
            document.getElementById('test-result').insertBefore(note, document.getElementById('btn-restart'));
        })
        .catch(err => console.error('Ошибка отправки:', err));
}

document.getElementById('btn-restart').addEventListener('click', () => {
    document.getElementById('test-result').classList.add('hidden');
    document.getElementById('test-intro').classList.remove('hidden');
    const existingNote = document.getElementById('sent-note');
    if (existingNote) existingNote.remove();
});
