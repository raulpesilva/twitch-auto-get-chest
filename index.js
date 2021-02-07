// ==UserScript==
// @name         Twitch auto get chest
// @namespace    https://github.com/raulpesilva/twitch-auto-get-chest
// @version      0.2
// @description  auto get chest on twitch stream
// @author       RaulPeSilva
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const INTERVAL = 7000;
  const INITIAL_TIMEOUT = 2000;
  const $button = createButton();
  const control = new Proxy({ getChest: false, total: 0 }, { set: handleControl });
  let intervalId;

  const setters = { total: onTotalChange, getChest: onGetChest };

  function handleControl(currentContext, propertyKey, newValue) {
    currentContext[propertyKey] = newValue;
    setters[propertyKey](currentContext);
  }

  function toggleGetChestValue() {
    control.getChest = !control.getChest;
  }

  function onTotalChange({ total, getChest }) {
    if (getChest) $button.textContent = `Parar: ${total}`;
  }

  function onGetChest({ total, getChest }) {
    if (!getChest) {
      $button.textContent = `Pegar baús`;
      window.removeEventListener('mousemove', onPageChange);

      return;
    }

    $button.textContent = `Parar: ${total}`;
    searchChest({ getChest });
  }

  function searchChest({ getChest }) {
    if (!getChest) clearInterval(intervalId);
    intervalId = setInterval(clickChest, INTERVAL);
  }

  function createButton() {
    const button = document.createElement('button');
    const classList = [
      'tw-align-items-center',
      'tw-align-middle',
      'tw-border-bottom-left-radius-medium',
      'tw-border-bottom-right-radius-medium',
      'tw-border-top-left-radius-medium',
      'tw-border-top-right-radius-medium',
      'tw-core-button',
      'tw-core-button--text',
      'tw-inline-flex',
      'tw-justify-content-center',
      'tw-overflow-hidden',
      'tw-relative',
    ];

    classList.forEach((classe) => button.classList.add(classe));
    button.style.padding = '0 5px';
    button.id = 'getChest';
    button.style.marginRight = '-10px';
    button.textContent = 'Pegar Baus';
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
