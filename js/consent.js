/* ========================================
   Cookie-согласие. Метрика включается только
   после «Принять», выбор живёт в localStorage.
   ======================================== */

(function () {
  var KEY = 'cookie_consent';
  var banner = document.getElementById('cookieBanner');

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function save(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* приватный режим — выбор проживёт до перезагрузки */
    }
  }

  function apply(value) {
    if (value === 'accepted' && typeof window.loadMetrika === 'function') {
      window.loadMetrika();
    }
  }

  var current = read();
  if (current === 'accepted' || current === 'rejected') {
    apply(current);
    return;
  }

  if (!banner) return;
  banner.hidden = false;

  document.getElementById('cookieAccept').addEventListener('click', function () {
    save('accepted');
    apply('accepted');
    banner.hidden = true;
  });

  document.getElementById('cookieReject').addEventListener('click', function () {
    save('rejected');
    banner.hidden = true;
  });
})();
