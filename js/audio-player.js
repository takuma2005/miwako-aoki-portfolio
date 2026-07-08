'use strict';

(() => {
  const audio = document.getElementById('audio');
  const playerBar = document.getElementById('playerBar');
  const playerPlay = document.getElementById('playerPlay');
  const playerTitle = document.getElementById('playerTitle');
  const playerCurrent = document.getElementById('playerCurrent');
  const playerDuration = document.getElementById('playerDuration');
  const playerProgress = document.getElementById('playerProgress');
  const playerProgressFill = document.getElementById('playerProgressFill');
  const playerVolume = document.getElementById('playerVolume');
  const playerClose = document.getElementById('playerClose');
  const sampleCards = document.querySelectorAll('.sample-card');

  if (!audio || !playerBar) return;

  const DEFAULT_VOLUME = 0.7;
  const SEEK_STEP = 5;

  let currentCard = null;

  /* ============ 時間フォーマット ============ */
  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  /* ============ プレイヤーバー表示制御 ============ */
  const showPlayerBar = () => {
    playerBar.classList.add('is-active');
    playerBar.setAttribute('aria-hidden', 'false');
  };

  const hidePlayerBar = () => {
    playerBar.classList.remove('is-active');
    playerBar.setAttribute('aria-hidden', 'true');
  };

  /* ============ 再生状態クラスの同期 ============ */
  const setPlayingState = (isPlaying) => {
    playerBar.classList.toggle('is-playing', isPlaying);
    if (playerPlay) playerPlay.classList.toggle('is-playing', isPlaying);
    if (currentCard) currentCard.classList.toggle('is-playing', isPlaying);
  };

  const clearAllCardStates = () => {
    sampleCards.forEach((card) => {
      card.classList.remove('is-current', 'is-playing');
    });
  };

  /* ============ 進捗バー更新 ============ */
  const updateProgressUI = () => {
    if (!audio.duration || !Number.isFinite(audio.duration)) {
      if (playerProgressFill) playerProgressFill.style.width = '0%';
      if (playerProgress) playerProgress.setAttribute('aria-valuenow', '0');
      return;
    }

    const percent = (audio.currentTime / audio.duration) * 100;
    if (playerProgressFill) playerProgressFill.style.width = `${percent}%`;
    if (playerProgress) playerProgress.setAttribute('aria-valuenow', String(Math.round(percent)));
    if (playerCurrent) playerCurrent.textContent = formatTime(audio.currentTime);
  };

  /* ============ トラック読み込み ============ */
  const loadTrack = (card) => {
    const src = card.dataset.src;
    const title = card.dataset.title || '';

    if (!src) return;

    clearAllCardStates();
    currentCard = card;
    currentCard.classList.add('is-current');

    audio.src = src;
    if (playerTitle) playerTitle.textContent = title;
    if (playerCurrent) playerCurrent.textContent = '0:00';
    if (playerDuration) playerDuration.textContent = '0:00';
    if (playerProgressFill) playerProgressFill.style.width = '0%';
    if (playerProgress) playerProgress.setAttribute('aria-valuenow', '0');

    showPlayerBar();
  };

  const play = () => {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        /* 再生できない場合は静かに失敗させる（自動再生制限など） */
      });
    }
  };

  const pause = () => {
    audio.pause();
  };

  /* ============ サンプルカードのクリック処理 ============ */
  sampleCards.forEach((card) => {
    const playBtn = card.querySelector('.sample-play');
    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
      const isSameTrack = currentCard === card && audio.src && audio.src.endsWith(card.dataset.src || '');

      if (isSameTrack) {
        if (audio.paused) {
          play();
        } else {
          pause();
        }
        return;
      }

      loadTrack(card);
      play();
    });
  });

  /* ============ プレイヤーバー: 再生/一時停止ボタン ============ */
  if (playerPlay) {
    playerPlay.addEventListener('click', () => {
      if (!audio.src) return;
      if (audio.paused) {
        play();
      } else {
        pause();
      }
    });
  }

  /* ============ audio要素のイベント ============ */
  audio.addEventListener('play', () => {
    setPlayingState(true);
  });

  audio.addEventListener('pause', () => {
    setPlayingState(false);
  });

  audio.addEventListener('ended', () => {
    setPlayingState(false);
    if (playerProgressFill) playerProgressFill.style.width = '0%';
    if (playerProgress) playerProgress.setAttribute('aria-valuenow', '0');
    if (playerCurrent) playerCurrent.textContent = '0:00';
  });

  audio.addEventListener('loadedmetadata', () => {
    if (playerDuration) playerDuration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', updateProgressUI);

  audio.addEventListener('error', () => {
    /* 音声ファイルが見つからない場合もエラーを出さず静かに処理 */
    setPlayingState(false);
  });

  /* ============ シークバー操作（クリック・キーボード） ============ */
  const seekToPercent = (percent) => {
    if (!audio.duration || !Number.isFinite(audio.duration)) return;
    const clamped = Math.min(Math.max(percent, 0), 100);
    audio.currentTime = (clamped / 100) * audio.duration;
    updateProgressUI();
  };

  if (playerProgress) {
    playerProgress.addEventListener('click', (event) => {
      if (!audio.duration || !Number.isFinite(audio.duration)) return;
      const rect = playerProgress.getBoundingClientRect();
      const percent = ((event.clientX - rect.left) / rect.width) * 100;
      seekToPercent(percent);
    });

    playerProgress.addEventListener('keydown', (event) => {
      if (!audio.duration || !Number.isFinite(audio.duration)) return;

      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        audio.currentTime = Math.min(audio.currentTime + SEEK_STEP, audio.duration);
        updateProgressUI();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        audio.currentTime = Math.max(audio.currentTime - SEEK_STEP, 0);
        updateProgressUI();
      } else if (event.key === 'Home') {
        event.preventDefault();
        audio.currentTime = 0;
        updateProgressUI();
      } else if (event.key === 'End') {
        event.preventDefault();
        audio.currentTime = audio.duration;
        updateProgressUI();
      }
    });
  }

  /* ============ 音量調整 ============ */
  audio.volume = DEFAULT_VOLUME;
  if (playerVolume) {
    playerVolume.value = String(DEFAULT_VOLUME * 100);

    playerVolume.addEventListener('input', () => {
      const value = Number(playerVolume.value);
      audio.volume = Math.min(Math.max(value / 100, 0), 1);
    });
  }

  /* ============ 閉じるボタン ============ */
  if (playerClose) {
    playerClose.addEventListener('click', () => {
      pause();
      audio.removeAttribute('src');
      audio.load();
      hidePlayerBar();
      setPlayingState(false);
      clearAllCardStates();
      currentCard = null;
      if (playerTitle) playerTitle.textContent = '-';
      if (playerCurrent) playerCurrent.textContent = '0:00';
      if (playerDuration) playerDuration.textContent = '0:00';
      if (playerProgressFill) playerProgressFill.style.width = '0%';
      if (playerProgress) playerProgress.setAttribute('aria-valuenow', '0');
    });
  }
})();
