const messages = [
    "Dear {name},\nAs this year closes, I hope you find yourself surrounded by warmth and the kind of peace that feels like coming home.\nMay the new year bring you moments that remind you why it's all worth it.",
    
    "{name}, I wanted to reach out before midnight.\nYou've carried so much this year, and I hope you know that's something worth honoring.\nHere's to a year where you feel lighter, steadier, and more yourself.",
    
    "Hey {name},\nI know the turn of the year can feel heavy with expectation, but I hope you give yourself permission to simply be.\nMay this next chapter bring you the gentleness you deserve.",
    
    "{name}, thank you for being you.\nWhatever this past year held, you made it through, and that's not nothing.\nI'm wishing you a year filled with small joys and quiet victories.",
    
    "Dear {name},\nSome years are for striving, and some are for healing.\nWhatever this new year needs to be for you, I hope you move through it with kindness toward yourself.\nYou're doing better than you think.",
    
    "{name}, as the clock resets, I hope you feel a little less burdened and a little more hopeful.\nMay the year ahead surprise you in the best ways, and may you feel held even in uncertain moments.",
    
    "Hey {name},\nI don't have big resolutions for you, just this: I hope you find more reasons to smile this year.\nMay it bring you connection, comfort, and the courage to keep going even when it's hard.",
    
    "{name}, the year is ending, but your story is still unfolding.\nI hope the next chapter brings you closer to what matters most, and that you feel a little more at home in your own skin.\nYou're worth every good thing that comes your way.",
    
    "Dear {name},\nI wanted to say this before the year slips away: you've been braver than you probably give yourself credit for.\nMay this new year meet you where you are and carry you gently forward.",
    
    "{name}, here's what I hope for you:\nThat you laugh more easily, rest more deeply, and trust yourself more fully.\nMay the new year feel like an exhale after holding your breath for too long."
];

let userName = '';
let countdownInterval = null;
let inputSection, countdownSection, transitionSection, messageSection;
let nameInput, continueBtn, messageContent;
let hoursDisplay, minutesDisplay, secondsDisplay;

function createParticles() {
    const particlesContainer = document.getElementById('particles-container');
    
    if (!particlesContainer) {
        console.error('Particles container not found');
        return;
    }
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.setProperty('--drift', (Math.random() - 0.5) * 100 + 'px');
        
        const size = 3 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

function getNewYearTarget() {
    const now = new Date();
    const newYear = new Date(2026, 0, 1, 0, 0, 0);
    
    if (now < newYear) {
        return newYear;
    }
    
    return null;
}

function updateCountdown(targetDate) {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
        clearInterval(countdownInterval);
        onCountdownComplete();
        return;
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    hoursDisplay.textContent = String(hours).padStart(2, '0');
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');

    updateCircularProgress('hours-progress', hours, 24);
    updateCircularProgress('minutes-progress', minutes, 60);
    updateCircularProgress('seconds-progress', seconds, 60);
}

function updateCircularProgress(elementId, value, max) {
    const progressBar = document.getElementById(elementId);
    const circumference = 314;
    const offset = circumference - (value / max) * circumference;
    progressBar.style.strokeDashoffset = offset;
}

function startCountdown(targetDate) {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    updateCountdown(targetDate);
    
    countdownInterval = setInterval(() => {
        updateCountdown(targetDate);
    }, 1000);
}

function onCountdownComplete() {
    countdownSection.classList.remove('active');
    
    setTimeout(() => {
        transitionSection.classList.add('active');
        
        setTimeout(() => {
            transitionSection.classList.remove('active');
            showPersonalizedMessage();
        }, 3000);
    }, 800);
}

function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

function personalizeMessage(name) {
    const template = getRandomMessage();
    const personalizedMessage = template.replace(/{name}/g, name);
    const lines = personalizedMessage.split('\n');
    
    const formattedLines = lines.map(line => {
        const highlighted = line.replace(new RegExp(name, 'g'), `<span class="highlight-name">${name}</span>`);
        return `<div class="message-line">${highlighted}</div>`;
    }).join('');
    
    return formattedLines;
}

function showPersonalizedMessage() {
    const personalizedMessage = personalizeMessage(userName);
    messageContent.innerHTML = personalizedMessage;
    messageSection.classList.add('active');
}

function handleNameSubmit() {
    const name = nameInput.value.trim();
    
    if (name === '') {
        alert('Please enter your name to continue.');
        nameInput.focus();
        return;
    }
    
    userName = name;
    inputSection.classList.remove('active');
    
    const newYearTarget = getNewYearTarget();
    
    setTimeout(() => {
        if (newYearTarget) {
            countdownSection.classList.add('active');
            startCountdown(newYearTarget);
        } else {
            showPersonalizedMessage();
        }
    }, 800);
}

function initializePage() {
    inputSection = document.getElementById('input-section');
    countdownSection = document.getElementById('countdown-section');
    transitionSection = document.getElementById('transition-section');
    messageSection = document.getElementById('message-section');
    nameInput = document.getElementById('name-input');
    continueBtn = document.getElementById('continue-btn');
    messageContent = document.getElementById('message-content');
    hoursDisplay = document.getElementById('hours');
    minutesDisplay = document.getElementById('minutes');
    secondsDisplay = document.getElementById('seconds');
    
    if (!inputSection || !nameInput || !continueBtn) {
        console.error('Required DOM elements not found');
        return;
    }
    
    createParticles();
    
    continueBtn.addEventListener('click', handleNameSubmit);
    
    nameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleNameSubmit();
        }
    });
    
    nameInput.focus();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}