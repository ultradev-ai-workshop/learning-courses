/* Google Analytics 4 for learn.coderhop.com — every page loads this file.
   Paste your measurement ID below (Google Analytics → Admin → Data streams → Web → Measurement ID). */
(function () {
  'use strict';
  var MEASUREMENT_ID = 'G-N2XMFWXV14';

  if (!/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID) || MEASUREMENT_ID === 'G-XXXXXXXXXX') return;  // not configured yet
  if (location.hostname !== 'learn.coderhop.com') return;  // don't count local copies, file:// or previews

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);
})();
