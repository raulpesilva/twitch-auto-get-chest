// ==UserScript==
// @name         Twitch auto get chest
// @namespace    https://github.com/raulpesilva/twitch-auto-get-chest
// @version      0.3
// @description  auto get chest on twitch stream
// @author       RaulPeSilva
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const CHEST_ICON = `<svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 cMQeyU"><g><path fill-rule="evenodd" d="M16.503 3.257L18 7v11H2V7l1.497-3.743A2 2 0 015.354 2h9.292a2 2 0 011.857 1.257zM5.354 4h9.292l1.2 3H4.154l1.2-3zM4 9v7h12V9h-3v4H7V9H4zm7 0v2H9V9h2z" clip-rule="evenodd"></path></g></svg>`;
  const INTERVAL = 7000;
  const INITIAL_TIMEOUT = 2000;
  const $text = createText();
  const $icon = createIcon();
  const $button = createButton();
  const control = new Proxy({ getChest: false, total: 0 }, { set: handleControl });
  let intervalId;

  const setters = { total: onTotalChange, getChest: onGetChest };

  function handleControl(currentContext, propertyKey, newValue) {
    currentContext[propertyKey] = newValue;
    setters[propertyKey](currentContext);
    return true;
  }

  function toggleGetChestValue() {
    control.getChest = !control.getChest;
  }

  function onTotalChange({ total, getChest }) {
    if (getChest) $text.textContent = ` ${total}`;
  }

  function onGetChest({ total, getChest }) {
    if (!getChest) {
      $text.textContent = ` Pegar`;
      $button.style.color = 'var(--color-background-button-success)';
      window.removeEventListener('mousemove', onPageChange);

      return;
    }

    $text.textContent = ` ${total}`;
    $button.style.color = 'var(--color-background-button-primary-default)';
    searchChest({ getChest });
  }

  function searchChest({ getChest }) {
    if (!getChest) clearInterval(intervalId);
    intervalId = setInterval(clickChest, INTERVAL);
  }

  function createIcon() {
    const wrapperIcon = document.createElement('div');
    wrapperIcon.style.width = '2rem';
    wrapperIcon.style.height = '2rem';
    wrapperIcon.innerHTML = CHEST_ICON;
    return wrapperIcon;
  }
  function createText() {
    const text = document.createElement('span');
    const classList = ['tw-strong'];
    classList.forEach((classe) => text.classList.add(classe));

    text.style.marginLeft = '1rem';
    text.textContent = ' Pegar';
    return text;
  }

  function createButton() {
    const button = document.createElement('button');
    button.appendChild($icon);
    button.appendChild($text);
    const classList = ['tw-button-icon', 'tw-core-button'];
    // background-color: ;
    // color: var(--color-text-button-primary);
    classList.forEach((classe) => button.classList.add(classe));
    button.style.padding = '0 1rem';
    button.id = 'getChest';
    button.style.marginRight = '-1rem';
    button.style.width = 'fit-content';
    $button.style.color = 'var(--color-background-button-success)';
    button.addEventListener('click', toggleGetChestValue);

    return button;
  }

  function getButtonPlacement() {
    const place = document.querySelector('.chat-input__buttons-container');
    if (!place) return;
    const buttonPlace = place.querySelector(
      '.tw-align-content-center.tw-align-items-center.tw-flex.tw-flex-row'
    );
    return buttonPlace;
  }

  function clickChest() {
    const element = document.querySelector('.tw-button--success');
    if (element) {
      element.click();
      control.total++;
    }
  }

  function addButtonInPage() {
    const place = getButtonPlacement();
    if (place) place.prepend($button);
  }

  function onPageChange() {
    const buttonAlreadyExists = document.querySelector('#getChest');
    if (buttonAlreadyExists) return;
    addButtonInPage();
  }

  function init() {
    setTimeout(addButtonInPage, INITIAL_TIMEOUT);
    window.addEventListener('mousemove', onPageChange);
  }

  init();
})();
