/* Utilitarios de timeline do player. */
(function () {
  'use strict';

  function findFirstIndexAtOrAfter(list, seconds, selector) {
    if (!Array.isArray(list) || !list.length) return 0;
    for (var i = 0; i < list.length; i++) {
      var value = selector ? selector(list[i]) : list[i];
      if (value >= seconds) return i;
    }
    return list.length;
  }

  function findEventIndexByTime(events, seconds) {
    return findFirstIndexAtOrAfter(events, seconds, function (ev) {
      return ev && typeof ev.startSec === 'number' ? ev.startSec : Number.MAX_VALUE;
    });
  }

  function findCursorIndexByTime(cursorStarts, seconds) {
    return findFirstIndexAtOrAfter(cursorStarts, seconds, null);
  }

  function findBeatIndexByTime(beatEvents, seconds) {
    return findFirstIndexAtOrAfter(beatEvents, seconds, function (ev) {
      return ev && typeof ev.sec === 'number' ? ev.sec : Number.MAX_VALUE;
    });
  }

  window.PlayerTimelineUtils = window.PlayerTimelineUtils || {};
  window.PlayerTimelineUtils.findEventIndexByTime = findEventIndexByTime;
  window.PlayerTimelineUtils.findCursorIndexByTime = findCursorIndexByTime;
  window.PlayerTimelineUtils.findBeatIndexByTime = findBeatIndexByTime;
})();
