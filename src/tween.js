const LINEAR_EASING = t => t;

export function tween({ duration, easing = LINEAR_EASING }, handler) {

  return new Promise(resolve => {

    let startTime;
    let id = requestAnimationFrame(function sample(time) {
      startTime = startTime || time;

      const delta = time - startTime;
      const p = Math.min(delta, duration) / duration;

      handler(easing(p));

      if (1 > p) {
        id = requestAnimationFrame(sample);
      } else {
        resolve();
      }

    });

  });

}
