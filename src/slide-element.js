const INNER_TEMPLATE = `
  <style>
    :host {
      overflow: hidden;
      position: relative;
    }

    .meter {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #fff;
      pointer-events: none;
    }
  </style>
  <div class="meter"></div>
`;

const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

function handleTouchStart(event) {
  if (this._capturedIdentifier != null) return;
  const [touch] = event.changedTouches;
  this._capturedIdentifier = touch.identifier;
  handleTouchMove.call(this, event);
}

function handleTouchEnd(event) {
  this._capturedIdentifier = null;
}

function handleTouchMove(event) {
  const touch = [...event.touches].find(t => t.identifier === this._capturedIdentifier);

  if (touch == null) return;

  event.preventDefault();

  const rect = this.getBoundingClientRect();
  const progress = clamp(1 - ((touch.clientY - rect.y) / rect.height), 0, 1);

  this.progress = progress;
}

export default class Slide extends HTMLElement {

  constructor() {
    super();
    const shadow = this.shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = INNER_TEMPLATE;
    this._capturedIdentifier = null;
  }

  get progress() {
    return this._value = value;
  }

  set progress(value) {
    const meterElement = this.shadow.querySelector('.meter');
    meterElement.style.height = `${value * 100}%`;

    this._value = value;
    const ev = new Event('progress-change', { bubbles: true});
    ev.progress = value;
    this.dispatchEvent(ev);
  }

  connectedCallback() {
    this.addEventListener('touchstart', handleTouchStart.bind(this), { passive: false });
    this.ownerDocument.addEventListener('touchmove', handleTouchMove.bind(this), { passive: false });
    this.ownerDocument.addEventListener('touchend', handleTouchEnd.bind(this), { passive: false });
  }
}
