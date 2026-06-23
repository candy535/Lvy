(function() {
    const correctPassword = "key=QAZqaz";
    const maxAttempts = 5;
    const lockDurationHours = 24;
    const cookieExpireDays = 30;
    const cookieName = "page_unlocked";

    const STORAGE_KEY_ATTEMPTS = 'lock_attempts';
    const STORAGE_KEY_LOCK_UNTIL = 'lock_until';

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function deleteCookie(name) {
        setCookie(name, '', -1);
    }

    function getAttempts() {
        return parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10);
    }

    function setAttempts(count) {
        localStorage.setItem(STORAGE_KEY_ATTEMPTS, count.toString());
    }

    function getLockUntil() {
        return parseInt(localStorage.getItem(STORAGE_KEY_LOCK_UNTIL) || '0', 10);
    }

    function setLockUntil(timestamp) {
        localStorage.setItem(STORAGE_KEY_LOCK_UNTIL, timestamp.toString());
    }

    function isLocked() {
        const lockUntil = getLockUntil();
        if (lockUntil && Date.now() < lockUntil) {
            return true;
        }
        if (lockUntil && Date.now() >= lockUntil) {
            localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
            setAttempts(0);
            return false;
        }
        return false;
    }

    let overlay, passwordInput, lockBtn, errorEl, lockoutInfoEl;
    let updateTimer = null;

    function updateLockUI() {
        if (isLocked()) {
            passwordInput.disabled = true;
            lockBtn.disabled = true;
            const remaining = getLockUntil() - Date.now();
            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            lockoutInfoEl.textContent = `⏳ 系统已锁定，请 ${hours}小时${minutes}分${seconds}秒 后再试`;
            errorEl.textContent = '';
            if (!updateTimer) {
                updateTimer = setInterval(() => {
                    if (!isLocked()) {
                        clearInterval(updateTimer);
                        updateTimer = null;
                        unlockInterface();
                    } else {
                        updateLockUI();
                    }
                }, 1000);
            }
        } else {
            passwordInput.disabled = false;
            lockBtn.disabled = false;
            lockoutInfoEl.textContent = '';
            if (updateTimer) {
                clearInterval(updateTimer);
                updateTimer = null;
            }
            const attemptsLeft = maxAttempts - getAttempts();
            if (attemptsLeft <= 2 && attemptsLeft > 0) {
                errorEl.textContent = `剩余尝试次数：${attemptsLeft} 次`;
            } else {
                errorEl.textContent = '';
            }
        }
    }

    function unlockInterface() {
        passwordInput.disabled = false;
        lockBtn.disabled = false;
        lockoutInfoEl.textContent = '';
        errorEl.textContent = '';
        setAttempts(0);
        localStorage.removeItem(STORAGE_KEY_LOCK_UNTIL);
        overlay.style.display = 'none';
        if (cookieExpireDays > 0) {
            setCookie(cookieName, "true", cookieExpireDays);
        }
    }

    window.handleUnlock = function() {
        if (isLocked()) {
            updateLockUI();
            return;
        }
        const password = passwordInput.value;
        if (password === '') {
            errorEl.textContent = '请输入密码';
            return;
        }
        if (password === correctPassword) {
            unlockInterface();
        } else {
            let attempts = getAttempts();
            attempts++;
            setAttempts(attempts);
            if (attempts >= maxAttempts) {
                const lockUntil = Date.now() + lockDurationHours * 60 * 60 * 1000;
                setLockUntil(lockUntil);
                setAttempts(0);
                errorEl.textContent = '密码错误次数过多，系统已锁定24小时';
                updateLockUI();
            } else {
                const left = maxAttempts - attempts;
                errorEl.textContent = `密码错误，还剩 ${left} 次尝试机会`;
            }
            passwordInput.value = '';
        }
    };

    window.lockModule = {
        init: function() {
            overlay = document.getElementById('lockOverlay');
            passwordInput = document.getElementById('lockPassword');
            lockBtn = document.getElementById('lockBtn');
            errorEl = document.getElementById('lockError');
            lockoutInfoEl = document.getElementById('lockoutInfo');

            if (!overlay) return;

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    errorEl.textContent = '请先输入密码解锁';
                }
            });

            passwordInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    handleUnlock();
                }
            });

            if (cookieExpireDays > 0 && getCookie(cookieName) === "true") {
                overlay.style.display = 'none';
            } else {
                if (isLocked()) {
                    updateLockUI();
                } else {
                    const attempts = getAttempts();
                    if (attempts > 0) {
                        errorEl.textContent = `剩余尝试次数：${maxAttempts - attempts} 次`;
                    }
                }
            }
        }
    };
})();
