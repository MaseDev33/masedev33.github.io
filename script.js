(function () {
    var overlay = document.getElementById('startup-overlay');
    var pageShell = document.querySelector('.page-shell');
    var progressBar = document.getElementById('startup-bar-fill');
    var statusText = document.getElementById('startup-status');
    var actionButton = document.getElementById('startup-action-button');
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

    if (actionButton) {
        actionButton.addEventListener('click', handleActionClick);
    }

    function showActionButton() {
        if (!actionButton) return;
        actionButton.style.display = 'inline-flex';
        actionButton.disabled = false;
    }

    function hideActionButton() {
        if (!actionButton) return;
        actionButton.style.display = 'none';
        actionButton.disabled = true;
    }

    function unlockAudio() {
        if (!audio || audioUnlocked) return;
        audio.muted = true;
        audio.currentTime = 0;
        var playPromise = audio.play();
        if (!playPromise || typeof playPromise.then !== 'function') {
            audio.muted = false;
            return;
        }

        playPromise.then(function () {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
            audioUnlocked = true;
        }).catch(function () {
            audio.muted = false;
        });
    }

    function handleActionClick() {
        if (!actionButton) return;
        actionButton.disabled = true;
        statusText.textContent = 'Unlocking startup sound...';
        if (!audio) {
            finishStartup();
            return;
        }

        audio.currentTime = 0;
        audio.play().then(function () {
            audioUnlocked = true;
            statusText.textContent = 'Ready.';
            setTimeout(finishStartup, 300);
        }).catch(function () {
            statusText.textContent = 'Playback blocked. Please try again.';
            actionButton.disabled = false;
        });
    }

    function playAudioIfAllowed(onSuccess) {
        if (!audio) {
            if (typeof onSuccess === 'function') onSuccess();
            return;
        }

        audio.currentTime = 0;

        if (audioUnlocked) {
            audio.play().then(function () {
                if (typeof onSuccess === 'function') onSuccess();
            }).catch(function () {
                if (typeof onSuccess === 'function') onSuccess();
            });
            return;
        }

        var playPromise = audio.play();
        if (!playPromise || typeof playPromise.then !== 'function') {
            statusText.textContent = 'Click Enter to continue.';
            showActionButton();
            return;
        }

        playPromise.then(function () {
            audioUnlocked = true;
            if (typeof onSuccess === 'function') onSuccess();
        }).catch(function () {
            statusText.textContent = 'Click Enter to continue.';
            showActionButton();
        });
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
    hideActionButton();

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
                hideActionButton();
                setTimeout(finishStartup, 300);
            });
        }
    }, updateInterval);
})();
