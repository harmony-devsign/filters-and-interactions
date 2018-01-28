const INNER_TEMPLATE = `<div class="value"></div>`;

export default class Pop extends HTMLElement {

  static get observedAttributes() {
    return ['value'];
  }

  constructor() {
    super();
    const shadow = this.shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = INNER_TEMPLATE;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.setAttribute('value', value);
  }

  attributeChangedCallback(name, _, value) {
    const valueElement = this.shadow.querySelector('.value');
    valueElement.textContent = value;
  }

}
