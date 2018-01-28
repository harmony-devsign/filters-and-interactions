import { tween } from "./tween.js";

async function handleCallback() {
  const words = [...this.children];
  const word = words[this._index];

  if (word == null) return;

  this._index = this._index === (words.length - 1) ? 0 : this._index + 1;

  const factor = Math.random() * 0.003;
  const holderElement = this.shadow.querySelector('#holder');
  const turbulenceElement = this.shadow.querySelector('feTurbulence');

  holderElement.innerHTML = '';
  holderElement.appendChild(word.cloneNode(true));

  await tween({ duration: 200 }, t => {
    const x = 0.001 + (Math.random() * (t * factor));
    turbulenceElement.setAttribute('baseFrequency', `${x} 2`);
  });

  turbulenceElement.setAttribute('baseFrequency', `0 0`);
}

const INNER_TEMPLATE = `
  <style>
    svg {
      opacity: 0;
      position: absolute;
    }

    #holder {
      filter: url('#filter');
    }
  </style>
  <svg>
    <defs>
      <filter id="filter">
        <feTurbulence type="turbulence" numOctaves="1" result="turbulence" seed="142" />
        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>
  <span id="holder"></span>
`;

export default class Words extends HTMLElement {
  constructor() {
    super();
    const shadow = this.shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = INNER_TEMPLATE;
    this._index = 0;
  }

  connectedCallback() {
    this._interval = setInterval(handleCallback.bind(this), 700);
    handleCallback.call(this);
  }
}
