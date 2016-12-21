(function () {
  var tags = {
    none: function () {
      return false;
    },
    '#all': function (el) {
      return true;
    }
  };
  var customTags = ['#work', '#school'];
  customTags.forEach(function (tag) {
    tags[tag] = function (el) {
      return el.matches('.tag[href="' + tag + '"]');
    };
  });

  function parent(targetSelector, el) {
    if (!el || !el.matches) {
      return null;
    }

    if (el.matches(targetSelector)) {
      return el;
    }

    return parent(targetSelector, el.parentNode);
  }

  function filterTags(tagName) {
    var matchFn = tags[tagName];
    if (!matchFn) {
      return;
    }

    // find all tags and map them in arrays of sibling tags
    var rowTags = document.querySelectorAll('.tag:not(.tags__tag)');
    var allTags = Array.prototype.map.call(rowTags, function (el) {
      return Array.prototype.filter.call(el.parentNode.children, function(child) {
        return child.matches('.tag');
      });
    });

    // hide rows which do not contain selected tag
    allTags.forEach(function (tagSiblings) {
      parent('tr', tagSiblings[0]).classList.toggle('hidden', !tagSiblings.some(matchFn));
    });

    if (tagName !== 'none') {
      // add active class to selected tag
      document.querySelectorAll('.tags__tag').forEach(function (e) {
        e.classList.remove('tag__active');
      });
      document.querySelector('.tags__tag[href="' + tagName + '"]').classList.add('tag__active');
    }
  }

  var resetTags = filterTags.bind(null, 'none');

  function toggleRowCheckbox(nameEl) {
    var rowCheckbox = nameEl.parentNode.querySelector('input[type="checkbox"]');
    rowCheckbox.checked = !rowCheckbox.checked;
    return rowCheckbox;
  }

  function initWS() {
    if (!window.WebSocket) {
      alert('WebSocket is not supported.');
      return;
    }

    var ws, reconnectInterval, send = {};
    function connect() {
      // listen on websocket at current url at port 9998
      ws = new WebSocket('ws://' + window.location.hostname + ':9998');

      // when socket server connects, clear reconnection interval
      ws.onopen = function () {
        reconnectInterval = clearInterval(reconnectInterval);
      };

      // when socket server closes, try to reconnect each second
      ws.onclose = function() {
        if (!reconnectInterval) {
          reconnectInterval = setInterval(connect, 1000);
        }
      };

      // when message is received, parse it as nameIndex and toggle corresponding checkbox
      ws.onmessage = function(e) {
        var nameIndex = parseInt(e.data);
        var nameEl = document.querySelectorAll('.tasks__name')[nameIndex];
        if (nameEl) {
          toggleRowCheckbox(nameEl);
        }
      };

      // function which sends nameIndex to socket server when called
      send.all = function (nameIndex) {
        ws.send(nameIndex);
      };
    }
    connect();

    return send;
  }

  function run() {
    // register click event on all tags
    document.querySelectorAll('.tag').forEach(function (tag) {
      tag.addEventListener('click', function (e) {
        resetTags();
        filterTags(e.target.attributes.href.value);
      });
    });
    // if url hash is not valid, reset it to #all
    if (!Object.keys(tags).includes(window.location.hash)) {
      window.location.hash = '#all';
    }
    // filter tags based on url hash value
    resetTags();
    filterTags(window.location.hash);

    var wsSend = initWS();

    // register click event on each task name and toggle checkbox state on click
    document.querySelectorAll('.tasks__name,.tasks__checkbox').forEach(function (task) {
      task.addEventListener('click', function (e) {
        var checkboxEl = e.target.matches('.tasks__name') ? toggleRowCheckbox(e.target) : e.target;
        if (wsSend) {
          var nameIndex = Array.prototype.indexOf.call(document.querySelectorAll('.tasks__checkbox'), checkboxEl);
          wsSend.all(nameIndex);
        }
      });
    });
  }

  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(run);
})();
