var tasksIndexSelector = '.tasks-index'

$(tasksIndexSelector).ready(function () {
  var tags = {
    none: function () {
      return false;
    },
    '#all': function (el) {
      return true;
    }
  };

  // var customTags = ['#work', '#school'];
  var customTags = [];
  $.ajax({
    url: "/tasks/tags",
  }).done(function(data) {
    customTags = data;
    customTags.forEach(function (tag) {
      tags[tag] = function (el) {
        return el.matches('.tag[href="' + tag + '"]');
      };
    });
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

  $( document ).on('turbolinks:load', function() {
    if ($(tasksIndexSelector).length === 0) {
      return
    }

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
  })
});
