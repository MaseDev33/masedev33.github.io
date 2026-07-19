(function () {
    var overlay = document.getElementById('startup-overlay');
    var pageShell = document.querySelector('.page-shell');
    var progressBar = document.getElementById('startup-bar-fill');
    var statusText = document.getElementById('startup-status');
    var audio = document.getElementById('startup-audio');
    var startupKey = 'portfolioStartupShown';
    var statusLabels = [
        'Initializing MasonOS...',
        'Loading projects...',
        'Loading components...',
        'Preparing portfolio...',
        'Ready.'
    ];
    var durationMs = 2700;
    var updateInterval = 25;
    var steps = Math.ceil(durationMs / updateInterval);
    var shouldShowOverlay = !sessionStorage.getItem(startupKey);
    var audioUnlocked = false;

    function startStartupAudio() {
        if (!audio || audioUnlocked) return;

        audio.autoplay = true;
        audio.muted = false;
        audio.volume = 1;
        audio.currentTime = 0;

        var playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(function () {
                audioUnlocked = true;
            }).catch(function () {
                audioUnlocked = false;
            });
        }
    }

    if (!overlay || !pageShell || !progressBar || !statusText) {
        if (pageShell) pageShell.classList.add('visible');
        return;
    }

    function setProgress(percent) {
        progressBar.style.width = percent + '%';
        progressBar.setAttribute('data-progress', percent.toFixed(0) + '%');
    }

    function updateStatus(progress) {
        var index = Math.min(statusLabels.length - 1, Math.floor((progress / 100) * statusLabels.length));
        statusText.textContent = statusLabels[index];
    }

    function finishStartup() {
        sessionStorage.setItem(startupKey, 'true');
        overlay.classList.add('startup-hidden');
        pageShell.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'true');
        pageShell.removeAttribute('aria-hidden');
        setTimeout(function () {
            overlay.style.display = 'none';
        }, 450);
    }

    function playAudioIfAllowed(onSuccess) {
        if (!audio) {
            if (typeof onSuccess === 'function') onSuccess();
            return;
        }

        startStartupAudio();
        if (audioUnlocked) {
            if (typeof onSuccess === 'function') onSuccess();
            return;
        }

        setTimeout(function () {
            if (typeof onSuccess === 'function') onSuccess();
        }, 250);
    }

    function skipOverlay() {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        pageShell.classList.add('visible');
    }

    if (!shouldShowOverlay) {
        skipOverlay();
        return;
    }

    pageShell.setAttribute('aria-hidden', 'true');
    setProgress(0);
    updateStatus(0);

    function triggerStartupAudioOnReady() {
        startStartupAudio();
        window.removeEventListener('load', triggerStartupAudioOnReady);
    }

    function triggerVisibility() {
        if (document.visibilityState === 'visible') {
            startStartupAudio();
        }
    }

    window.addEventListener('load', triggerStartupAudioOnReady, { once: true });
    document.addEventListener('visibilitychange', triggerVisibility);
    startStartupAudio();

    var start = performance.now();
    var intervalId = setInterval(function () {
        var elapsed = performance.now() - start;
        var progress = Math.min(100, (elapsed / durationMs) * 100);
        setProgress(progress);
        updateStatus(progress);

        if (progress >= 100) {
            clearInterval(intervalId);
            setProgress(100);
            updateStatus(100);
            playAudioIfAllowed(function () {
                setTimeout(finishStartup, 300);
            });
        }
    }, updateInterval);
})();
