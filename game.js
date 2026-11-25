/**
 * ============================================================================
 * AI LÀ TRIỆU PHÚ - PHIÊN BẢN TƯ TƯỞNG HỒ CHÍ MINH
 * GAME LOGIC CONTROLLER (MÃ MẪU THAM CHIẾU TÍCH HỢP)
 * ============================================================================
 * Tệp này kết nối trực tiếp với tất cả các ID cố định theo yêu cầu:
 *
 * 1. Các phần tử câu hỏi & đáp án:
 *    - questionText      : Nội dung câu hỏi
 *    - answerA, answerB, answerC, answerD : 4 nút đáp án
 *
 * 2. Thời gian & Bảng tiền thưởng:
 *    - timer             : Số giây đếm ngược
 *    - prizeLadder       : Danh sách 10 mốc tiền thưởng
 *
 * 3. Ba quyền trợ giúp:
 *    - lifeline5050      : Nút 50:50
 *    - lifelineAudience  : Nút hỏi ý kiến khán giả
 *    - lifelineChange    : Nút đổi câu hỏi
 *
 * 4. Các nút điều hướng:
 *    - startButton       : Bắt đầu chơi
 *    - restartButton     : Chơi lại
 *
 * 5. Ba màn hình chính:
 *    - startScreen       : Màn hình mở đầu
 *    - gameScreen        : Màn hình chơi chính
 *    - resultScreen      : Màn hình kết thúc
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // A. LẤY CÁC THÀNH PHẦN THEO ĐÚNG ID CỐ ĐỊNH
  // --------------------------------------------------------------------------
  const questionTextEl = document.getElementById('questionText');
  const answerAEl = document.getElementById('answerA');
  const answerBEl = document.getElementById('answerB');
  const answerCEl = document.getElementById('answerC');
  const answerDEl = document.getElementById('answerD');

  const answerElements = {
    A: answerAEl,
    B: answerBEl,
    C: answerCEl,
    D: answerDEl
  };

  const timerEl = document.getElementById('timer');
  const timerProgressEl = document.getElementById('timerProgress');
  const timerWrapperEl = document.querySelector('.timer-wrapper');

  const prizeLadderEl = document.getElementById('prizeLadder');
  const questionCounterEl = document.getElementById('questionCounter');
  const questionCategoryEl = document.getElementById('questionCategory');

  const lifeline5050Btn = document.getElementById('lifeline5050');
  const lifelineAudienceBtn = document.getElementById('lifelineAudience');
  const lifelineChangeBtn = document.getElementById('lifelineChange');

  const startBtn = document.getElementById('startButton');
  const restartBtn = document.getElementById('restartButton');

  const correctCountEl = document.getElementById('correctCount');
  const prizeWonEl = document.getElementById('prizeWon');
  const resultTitleEl = document.getElementById('resultTitle');
  const resultSubtitleEl = document.getElementById('resultSubtitle');
  const resultIconEl = document.getElementById('resultIcon');

  const attemptBadgeEl = document.getElementById('attemptBadge');
  const attemptTextEl = document.getElementById('attemptText');

  const prevQuestionBtn = document.getElementById('prevQuestionBtn');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');

  // --------------------------------------------------------------------------
  // B. BIẾN TRẠNG THÁI GAME
  // --------------------------------------------------------------------------
  const TOTAL_QUESTIONS = 10;
  const TIME_PER_QUESTION = 10; // 10 giây mỗi câu

  let currentQuestionIndex = 0; // 0 đến 9 tương ứng câu 1 đến 10
  let currentQuestionData = null;
  let timerInterval = null;
  let remainingSeconds = TIME_PER_QUESTION;
  let isAnsweringLocked = false;
  let correctAnswersCount = 0;
  let currentQuestionAttempt = 1; // 1: Lượt Người 1, 2: Lượt Người 2 (tối đa 2 người/câu)

  // Trạng thái các quyền trợ giúp
  const lifelinesState = {
    fiftyFifty: false, // true = đã dùng
    audience: false,
    change: false
  };

  // Danh sách câu hỏi hoạt động trong vòng thi này (clone từ ngân hàng câu hỏi)
  let activeQuestions = [];
  let backupQuestion = null;

  // --------------------------------------------------------------------------
  // C. CÁC HÀM XỬ LÝ THỜI GIAN (10 GIÂY MỖI CÂU, HẾT GIỜ VẪN TỰ ẤN ĐÁP ÁN)
  // --------------------------------------------------------------------------
  function resetTimer() {
    stopTimer();
    remainingSeconds = TIME_PER_QUESTION;
    updateTimerDisplay();
  }

  function startTimer() {
    stopTimer();
    remainingSeconds = TIME_PER_QUESTION;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();

      if (remainingSeconds <= 0) {
        handleTimeOut();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const displayVal = Math.max(0, remainingSeconds);
    if (timerEl) {
      timerEl.textContent = String(displayVal).padStart(2, '0');
    }
    if (timerProgressEl) {
      const offset = 264 * (1 - displayVal / TIME_PER_QUESTION);
      timerProgressEl.style.strokeDashoffset = offset;
    }
    if (timerWrapperEl) {
      timerWrapperEl.classList.toggle('warning', displayVal <= 5);
    }
  }

  function handleTimeOut() {
    stopTimer();
    // Không khóa đáp án: Sau khi hết 10 giây vẫn cho phép tự ấn đáp án
    if (window.GameshowUI) {
      if (typeof window.GameshowUI.Sound.playTimeUp === 'function') {
        window.GameshowUI.Sound.playTimeUp();
      }
      window.GameshowUI.showToast("⏰ HẾT 10 GIÂY! MỜI TỰ CHỌN ĐÁP ÁN.");
    }
  }

  // Cập nhật trạng thái các nút điều hướng câu hỏi (Câu trước / Câu tiếp)
  function updateNavButtons() {
    if (prevQuestionBtn) {
      const canGoPrev = currentQuestionIndex > 0;
      prevQuestionBtn.disabled = !canGoPrev;
      prevQuestionBtn.classList.toggle('disabled', !canGoPrev);
    }
    if (nextQuestionBtn) {
      const canGoNext = currentQuestionIndex < TOTAL_QUESTIONS - 1;
      nextQuestionBtn.disabled = !canGoNext;
      nextQuestionBtn.classList.toggle('disabled', !canGoNext);
    }
  }

  // Cập nhật trạng thái mở khóa quyền trợ giúp (Chỉ dùng được ở Câu 8 và Câu 9: index 7 và index 8)
  function updateLifelinesAvailability(index) {
    const isUnlocked = (index === 7 || index === 8);

    if (lifeline5050Btn) {
      if (!lifelinesState.fiftyFifty) {
        lifeline5050Btn.classList.toggle('locked', !isUnlocked);
        lifeline5050Btn.title = isUnlocked
          ? "Trợ giúp 50:50: Loại bỏ 2 phương án sai"
          : "Trợ giúp 50:50: Chỉ sử dụng tại Câu 8 và Câu 9";
      }
    }

    if (lifelineAudienceBtn) {
      if (!lifelinesState.audience) {
        lifelineAudienceBtn.classList.toggle('locked', !isUnlocked);
        lifelineAudienceBtn.title = isUnlocked
          ? "Hỏi ý kiến khán giả / Lớp học"
          : "Hỏi ý kiến khán giả: Chỉ sử dụng tại Câu 8 và Câu 9";
      }
    }
  }

  // Điều hướng quay lại câu hỏi trước
  function goToPrevQuestion() {
    if (isAnsweringLocked) return;
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex);
      if (window.GameshowUI) {
        window.GameshowUI.Sound.playClick();
        window.GameshowUI.showToast(`◀ QUAY LẠI CÂU HỎI ${currentQuestionIndex + 1}/10`);
      }
    }
  }

  // Điều hướng chuyển sang câu hỏi tiếp theo
  function goToNextQuestion() {
    if (isAnsweringLocked) return;
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
      if (window.GameshowUI) {
        window.GameshowUI.Sound.playClick();
        window.GameshowUI.showToast(`▶ SANG CÂU HỎI ${currentQuestionIndex + 1}/10`);
      }
    }
  }

  // Cập nhật huy hiệu hiển thị lượt trả lời (Lượt 1: Người 1 / Lượt 2: Người 2)
  function updateAttemptBadge(attemptNum) {
    if (!attemptBadgeEl || !attemptTextEl) return;
    if (attemptNum === 1) {
      attemptBadgeEl.className = 'attempt-badge turn-1';
      attemptTextEl.textContent = 'LƯỢT 1/2: NGƯỜI CHƠI 1';
    } else {
      attemptBadgeEl.className = 'attempt-badge turn-2';
      attemptTextEl.textContent = 'LƯỢT 2/2: CƠ HỘI CHO NGƯỜI CHƠI 2';
    }
  }

  // --------------------------------------------------------------------------
  // D. HIỂN THỊ CÂU HỎI LÊN GIAO DIỆN
  // --------------------------------------------------------------------------
  function renderQuestion(index) {
    if (index >= TOTAL_QUESTIONS) {
      // Đã hoàn thành 10 câu hỏi độc lập -> Kết thúc và hiển thị tổng kết
      const isPerfect = (correctAnswersCount === TOTAL_QUESTIONS);
      endGame(isPerfect, isPerfect ? "XUẤT SẮC ĐẠT ĐIỂM TUYỆT ĐỐI (10/10)!" : "HOÀN THÀNH 10 CÂU HỎI THUYẾT TRÌNH");
      return;
    }

    currentQuestionData = activeQuestions[index];
    isAnsweringLocked = false;
    currentQuestionAttempt = 1; // Bắt đầu lượt 1 cho câu hỏi mới
    updateAttemptBadge(1);

    // Reset lại kiểu dáng các nút đáp án
    if (window.GameshowUI) {
      window.GameshowUI.resetAllAnswers();
      window.GameshowUI.updateLadder(index + 1);
    }

    // Cập nhật số thứ tự câu hỏi
    if (questionCounterEl) {
      const qNum = String(index + 1).padStart(2, '0');
      questionCounterEl.textContent = `CÂU HỎI ${qNum}/10`;
    }

    // Chuyên đề câu hỏi
    if (questionCategoryEl && currentQuestionData.category) {
      questionCategoryEl.textContent = currentQuestionData.category;
    }

    // ẨN nội dung câu hỏi & đáp án, chờ người dùng click để reveal
    const questionBox = document.querySelector('.question-box');
    if (questionBox) {
      questionBox.classList.add('question-hidden');
      questionBox.classList.remove('question-revealed');
    }
    const answersGrid = document.querySelector('.answers-grid');
    if (answersGrid) {
      answersGrid.classList.add('answers-hidden');
      answersGrid.classList.remove('answers-revealed');
    }

    // Nội dung câu hỏi (đặt sẵn vào DOM, nhưng bị ẩn bởi CSS)
    if (questionTextEl) {
      questionTextEl.textContent = currentQuestionData.question;
    }

    // Nội dung 4 đáp án A, B, C, D
    ['A', 'B', 'C', 'D'].forEach(letter => {
      const btn = answerElements[letter];
      if (btn) {
        btn.classList.remove('disabled');
        const textSpan = btn.querySelector('.answer-text');
        if (textSpan && currentQuestionData.options[letter]) {
          textSpan.textContent = currentQuestionData.options[letter];
        }
      }
    });

    updateNavButtons();
    updateLifelinesAvailability(index);
    resetTimer();
  }

  // Hàm reveal câu hỏi & đáp án khi người dùng click vào khung câu hỏi
  function revealQuestion() {
    const questionBox = document.querySelector('.question-box');
    if (questionBox && questionBox.classList.contains('question-hidden')) {
      questionBox.classList.remove('question-hidden');
      questionBox.classList.add('question-revealed');

      const answersGrid = document.querySelector('.answers-grid');
      if (answersGrid) {
        answersGrid.classList.remove('answers-hidden');
        answersGrid.classList.add('answers-revealed');
      }

      if (window.GameshowUI) {
        window.GameshowUI.Sound.playClick();
      }

      // Bắt đầu đếm ngược 10 giây ngay khi câu hỏi hiện lên
      startTimer();
    }
  }

  // --------------------------------------------------------------------------
  // E. XỬ LÝ KHI NGƯỜI CHƠI CHỌN ĐÁP ÁN (A, B, C, D)
  // Mỗi câu hỏi riêng biệt, tối đa 2 người được trả lời
  // --------------------------------------------------------------------------
  function handleSelectAnswer(chosenLetter) {
    if (isAnsweringLocked) return;
    isAnsweringLocked = true;
    stopTimer();

    const selectedBtn = answerElements[chosenLetter];
    if (!selectedBtn) return;

    // 1. Giai đoạn hồi hộp: Khóa đáp án (Màu cam/amber nhấp nháy)
    selectedBtn.classList.add('selected');
    if (window.GameshowUI) {
      window.GameshowUI.Sound.playLockIn();
    }

    // 2. Chờ 1.6 giây kịch tính trước khi công bố kết quả
    setTimeout(() => {
      const isCorrect = (chosenLetter === currentQuestionData.correct);

      if (isCorrect) {
        // TRẢ LỜI ĐÚNG
        selectedBtn.classList.remove('selected');
        selectedBtn.classList.add('correct');
        correctAnswersCount++;

        if (window.GameshowUI) {
          window.GameshowUI.Sound.playCorrect();
          const who = (currentQuestionAttempt === 1) ? "NGƯỜI CHƠI 1" : "NGƯỜI CHƠI 2";
          window.GameshowUI.showToast(`🎉 CHÍNH XÁC! ${who} ĐÃ TRẢ LỜI ĐÚNG! (+1 ĐIỂM)`);
        }

        // Chuyển sang câu hỏi tiếp theo sau 2.2 giây
        setTimeout(() => {
          currentQuestionIndex++;
          renderQuestion(currentQuestionIndex);
        }, 2200);

      } else {
        // TRẢ LỜI SAI
        selectedBtn.classList.remove('selected');
        selectedBtn.classList.add('wrong');
        selectedBtn.classList.add('disabled'); // Khóa phương án đã chọn sai

        if (window.GameshowUI) {
          window.GameshowUI.Sound.playWrong();
        }

        if (currentQuestionAttempt === 1) {
          // LƯỢT 1 SAI -> Nhường quyền trả lời cho Người thứ 2
          currentQuestionAttempt = 2;
          updateAttemptBadge(2);

          if (window.GameshowUI) {
            window.GameshowUI.showToast("❌ NGƯỜI 1 CHƯA ĐÚNG! CƠ HỘI DÀNH CHO NGƯỜI THỨ 2!");
          }

          // Mở khóa sau 0.8 giây để người thứ 2 chọn 1 trong 3 đáp án còn lại
          setTimeout(() => {
            isAnsweringLocked = false;
          }, 800);

        } else {
          // LƯỢT 2 CŨNG SAI -> Cả 2 người đều trả lời sai
          // Hiển thị đáp án đúng màu xanh để cả lớp học cùng đối chiếu
          const correctBtn = answerElements[currentQuestionData.correct];
          if (correctBtn) {
            correctBtn.classList.add('correct');
          }

          if (window.GameshowUI) {
            window.GameshowUI.showToast(`❌ CẢ 2 BẠN ĐỀU CHƯA ĐÚNG! ĐÁP ÁN ĐÚNG LÀ: ${currentQuestionData.correct}`);
          }

          // Mỗi câu hỏi riêng biệt -> Tự động chuyển tiếp sang câu tiếp theo sau 3 giây!
          setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
          }, 3000);
        }
      }

    }, 1600);
  }

  // --------------------------------------------------------------------------
  // F. XỬ LÝ HAI QUYỀN TRỢ GIÚP (CHỈ DÙNG ĐƯỢC TẠI CÂU 8 VÀ CÂU 9)
  // --------------------------------------------------------------------------

  // 1. Trợ giúp 50:50 (Chỉ dùng được ở Câu 8 và Câu 9: index 7 và 8)
  function handleLifeline5050() {
    if (currentQuestionIndex !== 7 && currentQuestionIndex !== 8) {
      if (window.GameshowUI) {
        window.GameshowUI.showToast("⚠️ Quyền 50:50 chỉ mở khóa sử dụng tại Câu 8 và Câu 9!");
      }
      return;
    }

    if (lifelinesState.fiftyFifty || isAnsweringLocked || !currentQuestionData) return;

    lifelinesState.fiftyFifty = true;
    if (window.GameshowUI) {
      window.GameshowUI.setLifelineUsed('lifeline5050');
      window.GameshowUI.Sound.playLifeline();
      window.GameshowUI.showToast("ĐÃ LOẠI BỎ 2 PHƯƠNG ÁN SAI!");
    }

    const wrongLetters = ['A', 'B', 'C', 'D'].filter(l => l !== currentQuestionData.correct);
    // Xáo trộn ngẫu nhiên và chọn 2 phương án sai để ẩn đi
    wrongLetters.sort(() => Math.random() - 0.5);
    const toEliminate = wrongLetters.slice(0, 2);

    toEliminate.forEach(letter => {
      const btn = answerElements[letter];
      if (btn) {
        btn.classList.add('eliminated');
      }
    });
  }

  // 2. Trợ giúp Hỏi ý kiến khán giả (Chỉ dùng được ở Câu 8 và Câu 9: index 7 và 8)
  function handleLifelineAudience() {
    if (currentQuestionIndex !== 7 && currentQuestionIndex !== 8) {
      if (window.GameshowUI) {
        window.GameshowUI.showToast("⚠️ Quyền Khán giả chỉ mở khóa sử dụng tại Câu 8 và Câu 9!");
      }
      return;
    }

    if (lifelinesState.audience || isAnsweringLocked || !currentQuestionData) return;

    lifelinesState.audience = true;
    if (window.GameshowUI) {
      window.GameshowUI.setLifelineUsed('lifelineAudience');
      window.GameshowUI.Sound.playLifeline();
    }
  }

  // 3. Trợ giúp Đổi câu hỏi (Đã bỏ hẳn theo yêu cầu)
  function handleLifelineChange() {
    // Đã loại bỏ quyền trợ giúp đổi câu hỏi
  }

  // --------------------------------------------------------------------------
  // G. KẾT THÚC VÀ TÍNH TIỀN THƯỞNG
  // --------------------------------------------------------------------------
  function calculatePrize(correctCount) {
    if (typeof PRIZE_VALUES === 'undefined') {
      return correctCount > 0 ? `${correctCount * 5}.000 VNĐ` : "0 VNĐ";
    }

    if (correctCount === 0) return "0 VNĐ";
    if (correctCount >= 10) return PRIZE_VALUES[9] || "50.000 VNĐ";

    // Tiền thưởng tương ứng mốc số câu trả lời đúng
    return PRIZE_VALUES[correctCount - 1] || "0 VNĐ";
  }

  function endGame(isGrandVictory, headline) {
    stopTimer();

    // Cập nhật số câu đúng
    if (correctCountEl) {
      correctCountEl.textContent = correctAnswersCount;
    }

    // Cập nhật tiền thưởng tương ứng số câu trả lời đúng
    const finalPrize = calculatePrize(correctAnswersCount);
    if (prizeWonEl) {
      prizeWonEl.textContent = finalPrize;
    }

    // Cập nhật tiêu đề & huy hiệu
    if (resultTitleEl) {
      resultTitleEl.textContent = isGrandVictory ? "XUẤT SẮC ĐẠT ĐIỂM TUYỆT ĐỐI (10/10)!" : (headline || "HOÀN THÀNH 10 CÂU HỎI THUYẾT TRÌNH");
    }
    if (resultSubtitleEl) {
      resultSubtitleEl.textContent = isGrandVictory
        ? "Chúc mừng cả lớp đã trả lời đúng trọn vẹn 10 câu hỏi Tư tưởng Hồ Chí Minh!"
        : `Cả lớp đã xuất sắc trả lời đúng ${correctAnswersCount}/10 câu hỏi lý luận và lịch sử.`;
    }
    if (resultIconEl) {
      resultIconEl.textContent = isGrandVictory ? "🏆" : (correctAnswersCount >= 5 ? "🎖️" : "📜");
    }

    if (window.GameshowUI) {
      window.GameshowUI.showScreen('resultScreen');
    }
  }

  // --------------------------------------------------------------------------
  // H. KHỞI TẠO VÀ BẮT ĐẦU TRÒ CHƠI
  // --------------------------------------------------------------------------
  // Đồng bộ giá trị mốc tiền thưởng từ PRIZE_VALUES (trong questions.js) vào cả #prizeLadder và #introPrizeLadder
  function renderPrizeLadderUI() {
    if (typeof PRIZE_VALUES === 'undefined' || !Array.isArray(PRIZE_VALUES)) return;
    
    // 1. Cập nhật thang thưởng ở màn hình chơi game (#prizeLadder)
    const ladderItems = document.querySelectorAll('#prizeLadder .ladder-item');
    ladderItems.forEach(item => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      const prizeEl = item.querySelector('.item-prize');
      if (prizeEl && PRIZE_VALUES[step - 1] !== undefined) {
        prizeEl.textContent = PRIZE_VALUES[step - 1];
      }
    });

    // 2. Cập nhật thang thưởng ở màn hình giới thiệu (#introPrizeLadder)
    const introLadderItems = document.querySelectorAll('#introPrizeLadder .intro-ladder-item');
    introLadderItems.forEach(item => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      const prizeEl = item.querySelector('.item-prize');
      if (prizeEl && PRIZE_VALUES[step - 1] !== undefined) {
        prizeEl.textContent = PRIZE_VALUES[step - 1];
      }
    });

    // 3. Cập nhật giải thưởng mốc 10 trên màn hình kết thúc
    if (prizeWonEl && PRIZE_VALUES[9]) {
      prizeWonEl.textContent = PRIZE_VALUES[9];
    }
  }

  // Đưa hàm ra phạm vi toàn cục để ui.js có thể gọi
  window.renderPrizeLadderUI = renderPrizeLadderUI;

  function initGame() {
    renderPrizeLadderUI();
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    isAnsweringLocked = false;

    // Reset lifelines
    lifelinesState.fiftyFifty = false;
    lifelinesState.audience = false;
    lifelinesState.change = false;

    if (window.GameshowUI) {
      window.GameshowUI.resetLifelines();
    }

    // Nạp câu hỏi từ QUESTIONS_BANK (trong questions.js)
    if (typeof QUESTIONS_BANK !== 'undefined' && QUESTIONS_BANK.length >= 10) {
      activeQuestions = QUESTIONS_BANK.slice(0, 10);
      backupQuestion = QUESTIONS_BANK[10] || QUESTIONS_BANK[0];
    } else {
      console.warn("Chưa tìm thấy QUESTIONS_BANK trong questions.js, sử dụng câu hỏi mặc định.");
    }

    renderQuestion(0);
  }

  // --------------------------------------------------------------------------
  // I. GẮN SỰ KIỆN CHO CÁC PHẦN TỬ THEO ID
  // --------------------------------------------------------------------------
  function attachEventListeners() {
    // 4 nút đáp án A, B, C, D
    ['A', 'B', 'C', 'D'].forEach(letter => {
      const btn = answerElements[letter];
      if (btn) {
        btn.addEventListener('click', () => {
          handleSelectAnswer(letter);
        });
      }
    });

    // 3 nút trợ giúp
    if (lifeline5050Btn) {
      lifeline5050Btn.addEventListener('click', handleLifeline5050);
    }
    if (lifelineAudienceBtn) {
      lifelineAudienceBtn.addEventListener('click', handleLifelineAudience);
    }
    if (lifelineChangeBtn) {
      lifelineChangeBtn.addEventListener('click', handleLifelineChange);
    }

    // 2 nút điều hướng câu hỏi (Câu trước / Câu tiếp)
    if (prevQuestionBtn) {
      prevQuestionBtn.addEventListener('click', goToPrevQuestion);
    }
    if (nextQuestionBtn) {
      nextQuestionBtn.addEventListener('click', goToNextQuestion);
    }

    // Phím tắt bàn phím (Mũi tên Trái / Phải, PageUp / PageDown cho bút trình chiếu)
    document.addEventListener('keydown', (e) => {
      const gameScreenEl = document.getElementById('gameScreen');
      if (!gameScreenEl || !gameScreenEl.classList.contains('active')) return;

      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevQuestion();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextQuestion();
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Phím Space hoặc Enter cũng reveal câu hỏi
        revealQuestion();
      }
    });

    // Click vào khung câu hỏi để reveal nội dung
    const questionContainer = document.querySelector('.question-container');
    if (questionContainer) {
      questionContainer.addEventListener('click', revealQuestion);
    }

    // Lắng nghe sự kiện Bắt đầu từ Start Button (qua custom event hoặc click trực tiếp)
    document.addEventListener('gameshow:start', () => {
      initGame();
    });

    // Lắng nghe sự kiện Chơi lại
    document.addEventListener('gameshow:restart', () => {
      initGame();
    });
  }

  // Khởi động lắng nghe sự kiện khi trang đã tải
  window.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    renderPrizeLadderUI();
  });

})();

