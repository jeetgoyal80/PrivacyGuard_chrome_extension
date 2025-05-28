// injected.js
(() => {
  const origin = window.location.origin;

  function record(perm, state) {
    window.postMessage({
      source: 'privacy-guard',
      origin,
      perm,
      state
    }, '*');
  }

  // Wrap getUserMedia: initial grant
  if (navigator.mediaDevices?.getUserMedia) {
    const orig = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = (...args) => {
      record('camera', 'granted');
      record('microphone', 'granted');
      return orig(...args);
    };
  }

  // Wrap Notification.requestPermission + constructor
  const NativeNotification = window.Notification;
  Notification.requestPermission = (...args) =>
    NativeNotification.requestPermission(...args).then(result => {
      record('notifications', result);
      return result;
    });
  window.Notification = function(title, opts) {
    record('notifications', 'granted');
    return new NativeNotification(title, opts);
  };

  // Wrap geolocation calls
  if (navigator.geolocation) {
    ['getCurrentPosition','watchPosition'].forEach(fn => {
      const orig = navigator.geolocation[fn].bind(navigator.geolocation);
      navigator.geolocation[fn] = (...args) => {
        record('geolocation', 'granted');
        return orig(...args);
      };
    });
  }

  // Watch Permissions API for dynamic on/off
  if (navigator.permissions) {
    ['camera','microphone','geolocation','notifications'].forEach(name => {
      navigator.permissions.query({ name }).then(status => {
        record(name, status.state);
        status.onchange = () => record(name, status.state);
      });
    });
  }
})();
