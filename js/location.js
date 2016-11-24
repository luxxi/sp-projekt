(function () {
  function run() {
    document.querySelector('#getLocation').addEventListener('click', function (e) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    });
  }

  function showPosition(position) {
    document.querySelector('#location').value = position.coords.latitude + " " + position.coords.longitude;
  }

  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(run());
})();
