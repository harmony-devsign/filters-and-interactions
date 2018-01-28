import Words from './words-element.js';
import Slide from './slide-element.js';
import Dial from './dial-element.js';
import Pop from './pop-element.js';

customElements.define('st-words', Words);
customElements.define('st-slide', Slide);
customElements.define('st-dial', Dial);
customElements.define('st-pop', Pop);

document.addEventListener('progress-change', e => {

  const optionElement = e.target.closest('.vote-options li');

  if (optionElement == null) return;

  const popElement = optionElement.querySelector('st-pop');
  const progress = Math.round(e.progress * 100);

  popElement.value = progress;

});
