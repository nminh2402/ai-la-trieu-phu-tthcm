/**
 * ============================================================================
 * AI LÀ TRIỆU PHÚ - PHIÊN BẢN TƯ TƯỞNG HỒ CHÍ MINH
 * UI Controller & Visual Effects (Pure Frontend UI Interaction)
 * ============================================================================
 * Tệp này phụ trách:
 * - Chuyển đổi giữa 3 màn hình (#startScreen, #gameScreen, #resultScreen)
 * - Hiệu ứng ánh sáng & hạt bụi trường quay (Studio Ambient Canvas)
 * - Pháo hoa / hoa giấy chiến thắng (Confetti Victory Canvas)
 * - Bộ âm thanh Gameshow thuần Web Audio API (Không phụ thuộc file nhạc ngoài)
 * - Điều khiển Fullscreen & Bật/Tắt âm thanh
 * - Mở/Đóng Modal khảo sát ý kiến khán giả
 * - Cung cấp helper API (window.GameshowUI) để dev logic (game.js) dễ dàng tích hợp!
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DOM ELEMENTS
  // --------------------------------------------------------------------------
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const resultScreen = document.getElementById('resultScreen');

  const startButton = document.getElementById('startButton');
  const restartButton = document.getElementById('restartButton');
  const homeButton = document.getElementById('homeButton');

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const fullscreenToggleBtn = document.getElementById('fullscreenToggleBtn');

  const audienceModal = document.getElementById('audienceModal');
  const closeAudienceModal = document.getElementById('closeAudienceModal');
  const confirmAudienceModal = document.getElementById('confirmAudienceModal');

  const gameToast = document.getElementById('gameToast');
  const ambientCanvas = document.getElementById('ambientCanvas');
  const victoryCanvas = document.getElementById('victoryCanvas');

  // --------------------------------------------------------------------------
  // 2. WEB AUDIO API SYNTHESIZER (ÂM THANH TRUYỀN HÌNH CHUYÊN NGHIỆP)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundMuted = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const SoundManager = {
    // Tiếng Click nút chuyển màn hình
    playClick() {
      if (isSoundMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    },

    // Tiếng hồi hộp khi khóa đáp án (Selected / Tension Drone)
    playLockIn() {
      if (isSoundMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    },

    // Tiếng Trả lời ĐÚNG (Triumphant Chord)
    playCorrect() {
      if (isSoundMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
      });
    },

    // Tiếng Trả lời SAI (Dissonant Buzz)
    playWrong() {
      if (isSoundMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    },

    // Tiếng Kích hoạt Quyền trợ giúp
    playLifeline() {
      if (isSoundMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  };

  // --------------------------------------------------------------------------
  // 3. SCREEN SWITCHING (QUẢN LÝ CHUYỂN MÀN HÌNH)
  // --------------------------------------------------------------------------
  function showScreen(screenId) {
    [startScreen, gameScreen, resultScreen].forEach(scr => {
      if (scr) scr.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }

    if (screenId === 'resultScreen') {
      startConfetti();
    } else {
      stopConfetti();
    }
  }

  // --------------------------------------------------------------------------
  // 4. TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  let toastTimeout = null;
  function showToast(message, duration = 3000) {
    if (!gameToast) return;
    gameToast.textContent = message;
    gameToast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      gameToast.classList.remove('show');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 5. AMBIENT PARTICLES (HẠT SÁNG TRƯỜNG QUAY)
  // --------------------------------------------------------------------------
  let ambientParticles = [];
  function initAmbientCanvas() {
    if (!ambientCanvas) return;
    const ctx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    const particleCount = 45;
    ambientParticles = [];
    for (let i = 0; i < particleCount; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? '245, 179, 0' : '0, 210, 255'
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      for (let p of ambientParticles) {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();
      }
      requestAnimationFrame(render);
    }
    render();
  }

  // --------------------------------------------------------------------------
  // 6. CONFETTI & VICTORY CELEBRATION (HOA GIẤY CHIẾN THẮNG)
  // --------------------------------------------------------------------------
  let confettiAnimationId = null;
  let confettiPieces = [];

  function startConfetti() {
    if (!victoryCanvas) return;
    const ctx = victoryCanvas.getContext('2d');
    let width = (victoryCanvas.width = window.innerWidth);
    let height = (victoryCanvas.height = window.innerHeight);

    const colors = ['#f5b300', '#00d2ff', '#10b981', '#ffffff', '#ff4d4f', '#a855f7'];
    confettiPieces = [];
    for (let i = 0; i < 110; i++) {
      confettiPieces.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 5,
        speedY: Math.random() * 3 + 2.5,
        speedX: (Math.random() - 0.5) * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, width, height);
      for (let p of confettiPieces) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      confettiAnimationId = requestAnimationFrame(renderConfetti);
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    renderConfetti();
  }

  function stopConfetti() {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
    if (victoryCanvas) {
      const ctx = victoryCanvas.getContext('2d');
      ctx.clearRect(0, 0, victoryCanvas.width, victoryCanvas.height);
    }
  }

  // --------------------------------------------------------------------------
  // 7. EVENT LISTENERS GIAO DIỆN CƠ BẢN
  // --------------------------------------------------------------------------
  function setupUIEventListeners() {
    // Nút Bắt đầu
    if (startButton) {
      startButton.addEventListener('click', () => {
        SoundManager.playClick();
        showScreen('gameScreen');
        // Kích hoạt custom event để game.js lắng nghe nếu có
        document.dispatchEvent(new CustomEvent('gameshow:start'));
      });
    }

    // Nút Chơi lại
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        SoundManager.playClick();
        showScreen('gameScreen');
        document.dispatchEvent(new CustomEvent('gameshow:restart'));
      });
    }

    // Nút Quay về Trang chủ
    if (homeButton) {
      homeButton.addEventListener('click', () => {
        SoundManager.playClick();
        showScreen('startScreen');
      });
    }

    // Nút Toàn màn hình
    if (fullscreenToggleBtn) {
      fullscreenToggleBtn.addEventListener('click', () => {
        SoundManager.playClick();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.log('Không thể mở toàn màn hình:', err);
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    // Nút Bật/Tắt âm thanh
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        isSoundMuted = !isSoundMuted;
        soundToggleBtn.classList.toggle('muted', isSoundMuted);
        const label = soundToggleBtn.querySelector('.btn-label');
        if (label) {
          label.textContent = isSoundMuted ? 'Đã tắt tiếng' : 'Âm thanh';
        }
        if (!isSoundMuted) SoundManager.playClick();
      });
    }

    // Modal Khán giả
    if (closeAudienceModal) {
      closeAudienceModal.addEventListener('click', () => {
        SoundManager.playClick();
        if (audienceModal) audienceModal.classList.remove('active');
      });
    }
    if (confirmAudienceModal) {
      confirmAudienceModal.addEventListener('click', () => {
        SoundManager.playClick();
        if (audienceModal) audienceModal.classList.remove('active');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. PUBLIC UI HELPER API (WINDOW.GameshowUI)
  // Tiện ích để file game.js hoặc bất kỳ lập trình viên nào gọi dễ dàng!
  // --------------------------------------------------------------------------
  window.GameshowUI = {
    showScreen,
    showToast,
    Sound: SoundManager,

    // Cập nhật thang tiền thưởng (highlight mốc hiện tại)
    updateLadder(currentQuestionIndex) {
      const items = document.querySelectorAll('.ladder-item');
      items.forEach(item => {
        const step = parseInt(item.getAttribute('data-step'), 10);
        item.classList.remove('current', 'passed');
        if (step === currentQuestionIndex) {
          item.classList.add('current');
        } else if (step < currentQuestionIndex) {
          item.classList.add('passed');
        }
      });
    },

    // Hiển thị modal ý kiến khán giả với dữ liệu phần trăm
    openAudienceModal(percents = { A: 68, B: 15, C: 10, D: 7 }) {
      if (!audienceModal) return;
      ['A', 'B', 'C', 'D'].forEach(letter => {
        const bar = document.getElementById(`pollBar${letter}`);
        if (bar) {
          const val = percents[letter] || 0;
          bar.style.height = `${val}%`;
          const textSpan = bar.querySelector('.bar-percent');
          if (textSpan) textSpan.textContent = `${val}%`;
        }
      });
      audienceModal.classList.add('active');
      SoundManager.playLifeline();
    },

    closeAudienceModal() {
      if (audienceModal) audienceModal.classList.remove('active');
    },

    // Đánh dấu quyền trợ giúp đã dùng
    setLifelineUsed(buttonId) {
      const btn = document.getElementById(buttonId);
      if (btn) {
        btn.classList.add('used');
      }
    },

    // Reset lại trạng thái các quyền trợ giúp
    resetLifelines() {
      ['lifeline5050', 'lifelineAudience', 'lifelineChange'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('used');
      });
    },

    // Đặt trạng thái thị giác cho 1 đáp án ('selected' | 'correct' | 'wrong' | 'eliminated' | 'reset')
    setAnswerState(buttonId, state) {
      const btn = typeof buttonId === 'string' ? document.getElementById(buttonId) : buttonId;
      if (!btn) return;

      if (state === 'reset') {
        btn.classList.remove('selected', 'correct', 'wrong', 'eliminated', 'disabled');
      } else {
        btn.classList.add(state);
      }
    },

    // Reset toàn bộ 4 đáp án về trạng thái ban đầu
    resetAllAnswers() {
      ['answerA', 'answerB', 'answerC', 'answerD'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.classList.remove('selected', 'correct', 'wrong', 'eliminated', 'disabled');
        }
      });
    }
  };

  // Khởi động khi tải xong trang
  window.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    setupUIEventListeners();
  });

})();

