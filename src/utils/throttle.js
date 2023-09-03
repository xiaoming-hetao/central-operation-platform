// 节流

function throttle(fn, delay) {
  let canRun = true;

  return function(...args) {
    let context = this;

    if (!canRun) return;

    canRun = false;

    setTimeout(function() {
      fn.apply(context, args);
      canRun = true;
    }, delay)
  }
}

export default throttle;