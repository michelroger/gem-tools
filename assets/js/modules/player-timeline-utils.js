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

  /** Indice da nota/entrada em que o cursor deve estar (ultima com inicio <= tempo). */
  function findCursorDisplayIndexByTime(cursorStarts, seconds) {
    if (!Array.isArray(cursorStarts) || !cursorStarts.length) return 0;
    var t = typeof seconds === 'number' && isFinite(seconds) ? seconds : 0;
    var best = 0;
    var i;
    for (i = 0; i < cursorStarts.length; i++) {
      if (cursorStarts[i] <= t + 0.0005) best = i;
      else break;
    }
    return best;
  }

  function findBeatIndexByTime(beatEvents, seconds) {
    return findFirstIndexAtOrAfter(beatEvents, seconds, function (ev) {
      return ev && typeof ev.sec === 'number' ? ev.sec : Number.MAX_VALUE;
    });
  }

  window.PlayerTimelineUtils = window.PlayerTimelineUtils || {};
  window.PlayerTimelineUtils.findEventIndexByTime = findEventIndexByTime;
  window.PlayerTimelineUtils.findCursorIndexByTime = findCursorIndexByTime;
  window.PlayerTimelineUtils.findCursorDisplayIndexByTime = findCursorDisplayIndexByTime;
  window.PlayerTimelineUtils.findBeatIndexByTime = findBeatIndexByTime;
})();
