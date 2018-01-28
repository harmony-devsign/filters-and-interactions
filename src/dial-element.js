const INNER_TEMPLATE = `
  <style>
    .dial {
      position: relative;
      height: 0;
      padding-bottom: 100%;
    }

    .dial svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .dial .bg,
    .dial .fill {
      fill: transparent;
    }

    .dial .bg {
      stroke: rgba(0, 0, 0, 0.2);
    }

    .dial .fill {
      stroke: #fff;
    }
  </style>
  <div class="dial">
    <svg width="40" height="40" viewbox="0 0 40 40">
      <circle class="bg" r="16" cx="20" cy="20" stroke-width="8"></circle>
      <path class="fill" stroke-width="8"></path>
    </svg>
  </div>
`;

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
  const x = centerX + (radius * Math.cos(angleInRadians));
  const y = centerY + (radius * Math.sin(angleInRadians));
  return { x, y };
}

function describeArc(x, y, radius, startAngle, endAngle) {

  // if this is a full 360 angle then return a two point constant 360 arc
  if (endAngle - startAngle === 360) {

    const start = polarToCartesian(x, y, radius, 0);
    const mid = polarToCartesian(x, y, radius, 180);
    const end = polarToCartesian(x, y, radius, 360);

    const d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, 0, 0, mid.x, mid.y,
      "A", radius, radius, 0, 0, 0, end.x, end.y
    ].join(" ");

    return d;
  }

  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}

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
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const x = touch.clientX - rect.x;
  const y = touch.clientY - rect.y;

  const lastAngle = this.angle;
  let angle = ((Math.atan2(centerY - y, centerX - x) * (180 / Math.PI) - 90) % 360 + 360) % 360;

  if ((lastAngle > 270) && (angle < 90)) {
    angle = 360;
  } else if((lastAngle < 90) && (angle > 270)) {
    angle = 0;
  }

  this.angle = angle;
}

export default class Dial extends HTMLElement {

  constructor() {
    super();
    const shadow = this.shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = INNER_TEMPLATE;
    this._capturedIdentifier = null;
    this.angle = 0;
  }

  get angle() {
    return this._angle;
  }

  set angle(value) {
    const progress = value / 360;
    const fillElement = this.shadow.querySelector('.fill');
    fillElement.setAttribute('d', describeArc(20, 20, 16, 0, value));
    this._angle = value;
    const ev = new Event('progress-change', { bubbles: true});
    ev.progress = progress;
    this.dispatchEvent(ev);
  }

  connectedCallback() {
    this.addEventListener('touchstart', handleTouchStart.bind(this), { passive: false });
    this.ownerDocument.addEventListener('touchmove', handleTouchMove.bind(this), { passive: false });
    this.ownerDocument.addEventListener('touchend', handleTouchEnd.bind(this), { passive: false });
  }
}
