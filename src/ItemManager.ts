import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import { itemEndTemplate, itemNewsTemplate } from './templates';
import { ItemData } from './types';

const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAJYCAMAAACtqHJCAAABEVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABoX7lMAAAAW3RSTlMAXgYsGUUTViVKHV0BAlsHUQVaAxwKXEZYDCIEIxJDFVM0JzgOEVBUCUc6FjJNS04LPy0PGy5CK0gYITBVNh8mVylJKkwzQD5BLzEQJDUXO1kIHkRSKDwUDTlP76vJ/AAACDdJREFUeAHt3YV6G1m2x9HajjuKIzYzQ5iZqZm7h9//PYbn3gbbR4qr5JLOWs9Qv09g/b0LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgFHNT2SkGA92X25GfzpPLBaTd2Y5MfVlA0tXI1nQBCQeRry8KSFiNfP2hgIRLka9GAQkCgRMIBBIEAgMFcvOTTPwgED4ikMtFJmYGCgQEAgkCgRMIBBIEAicQCCQIBE4gEBCIQBCIQBCIQBCIQBCIQBCIQBCIQBBI687Fixe/nhMIAvmdr7980ol/aR7uPWgJBIH8wvxM/FLjwppAEMh/7S/Fbx29EggC+bf12TjG92sCQSBF61oc7/YdgSCQvTjJYVcguRPI4zjZk7ZA8iaQ6804xY5AsiaQuV6c6juB5Ewg7+N07wSSMYHMvYiEaYHkSyCrkfJIIPkSyGakLHYFkiuBzHUi6ZVAciWQrUjbEUiuBPJNpP0skFwJ5HmkHQokVwLZibQXAsmVQL6NtIZAciWQryKtJ5BcCWQ30pYEkiuBTEfaXwWSK4H0FyNpXSC5EkjxLpLuCCRbAtmNlKVCINkSSHc2ElYFki+BFJ/G6XqtojJr8xdu7O4LpMYE0n0Tp/qpqMrUtz/Ev3x4IJDaEkhiMvVFUZXvXsT/PFoQSF0JpLgWJ9vuFhV51Yn/d3SxroEgkLmlOMny15W9fizGL81erGkgCKTofxLHa/y5qMjKm/i1Fys1DQSBFO2XcZxbK0VF2jPxWzPt2gaC8weXj+K3Fm/MFVXZid/bqW0gCKTof7kcv9S8e7+ozIM4zoMaB4ITbP31R7P/q2Pm4V+K6iw04jiNhVoHgiOe7YOfXr9+vb41VVSptRTHW2oJBGegn8dJnguE7AOZbsZJmtMCIfNArjTiZI0rAiHvQDbjNJsCIetAHsfpHguEjAPZWozTLW4JhGwDmepFSm9KIOQayN1IuysQMg3kUgzikkDIMpCDTgyicyAQMgxk7XYM5vaaQMgvkL0Y1J5AyC6QZzG4ZwIhs0BWlmNwyysCIatA2jMxjJm2QMgpkE9jODcEQkaBzMew5gVCNoEsNGJYjSsCIZNAWldjeEstgZBHIPfiY9wTCFkEcr0ZH6N5XSBkEEj3KD7OdnfyA0Egj+JjfTbxgSCQP8bH253wQBDIRic+XmdjogNBIP1enMVhf5IDQSDfx9lcm+BAEMhqnNXqxAaCQO7PxlnN7o9HIAjk6bUPvZt/mm+V+Rv3tHftMQgEgRy8i//4cL3M37in3ahTIAgkfbZ5rz3EIakza07XPRAEst6MX7g6NcT/cT+zxo91CgSBpI963OoXKa0nUZarrToFgkDSg6cvipR7UZ4LNQ4EgbRnhn9mp5tRnubT+gaCQL6K32tupT6AlOmoW9dAEMh0c/i1xmaUa7OmgSCQK43h1xrvo2xvaxkIAmn9PPxaY2sxytbZqGMgCOTx8M/sVC/K1+vXLxAEstUcfq1xN6rwee0CQSDd7eHXGpeiGut1CwSB3B1+rXHQiWrM3q9XIAjk9fBrjbXbUZWbc3UKBIGkXwxutROHpEr1skaBIJC1v0XSTuKQVLku1ycQBLI3/DO7shxVWr5Tl0AQyLMYRGMhNbIt00y7HoEgkJXl4dcaN6Jqz2sQCAIZ5sXgYeKQVKma03UIBIF8OvxaY6ER1WtcEQjnH8j88GuN1lKMwqZAONdAhn8xeJQY2ZbrsUA410CGfzF4mzgkVarFLYFwvoHcG36t0d2OUelNCYTzDGT4F4Ne/1GMzl2BMMpAShg83YxRWhcI5xfIZ1F3nQOBcF6B7Eb93V4TCOcTyEYnxsCeQDiXQPqHMRaeCYTzCORajIflFYEw+kBWY1zMtAXCqAPZn42xcUMgjDiQ9q0YI/MCYbSB7MQ4aVwRCKMM5HKMl6WWQBhdIAtvYszcEwgjC6R1NcZN87pAGFUgD2P8bHcFwmgCedqMMfSZQBhJIN2jGEu7AmEUgWzGeOpsVB8IAnkb4+qwX3UgCGSjE2PrWsWBIJB+L8bYarWBIJDvY5zN7lcZCAJZj/F2q11dIAjk/myMuZ3KAkEgczdj7F2uKhAE8m2MvzcL1QSCQC7HJLjaqiIQBHJnOSbCwwoCQSCtJzEZmk/LDwSBPI9JcdQtOxAEMt2MibFZciAI5MdGTJC35QaCQDZjknQ2ygwEgbyPydLrlxcIAtlajAnzeWmBIJB+LybOelmBIJDPY/LM3i8nEATyTUyim3NlBIJA7s/GRHpZQiAIpH0rJtQDgXD2QNYuTqp9gXCmQDIxWCAgEEgQyAlAIJAgEBgokIfTmTgUCEMEkiuBkCAQSBDICUAgkPBN5OtFAQnzka8PBSRMzUa2viog5X3kanuqgKSHi5Gl2/vFAGBl90KG5lvFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gHtCsN7ZVLJnwAAAABJRU5ErkJggg==';

function imageErrorHandler(event: Event) {
  (<HTMLImageElement>event.target).src = PLACEHOLDER_IMAGE
};

export class ItemManager {
  constructor(
    private container: HTMLDivElement,
    private scroll: HTMLDivElement,
    private itemCollection: HTMLCollectionOf<Element>,
  ) {}

  get count() {
    return this.itemCollection.length;
  }

  private createItem(template: string, ...classList) {
    const item = document.createElement('div');
    item.classList.add('item', ...classList);
    item.innerHTML = template;
    this.container.appendChild(item);
    return item;
  }

  private createScrollItem(...classList) {
    const item = document.createElement('div');
    item.classList.add('scroll-item', ...classList);
    this.scroll.appendChild(item);
    return item;
  }

  addNewsItems(count: number) {
    const containerItems: HTMLDivElement[] = [];
    const scrollItems: HTMLDivElement[] = [];

    for(let i = 0; i < count; i++) {
      containerItems.push(this.createItem(itemNewsTemplate, 'loading'));
      scrollItems.push(this.createScrollItem());
    }

    return { containerItems, scrollItems };
  }

  addEndItem() {
    return this.createItem(itemEndTemplate);
  }

  updateNewsItem(index: number, data: ItemData) {
    const item = this.itemCollection.item(index) as HTMLDivElement;
    item.querySelector<HTMLParagraphElement>('.title').innerHTML = `<a href="${data.url}">${data.title}</a>`;
    item.querySelector<HTMLParagraphElement>('.text').innerHTML = data.text;
    item.querySelector<HTMLParagraphElement>('.author').innerHTML = data.author;
    item.querySelector<HTMLParagraphElement>('.time').innerText = `${distanceInWordsToNow(data.time)} ago`;
    item.classList.remove('loading');
    const img = item.querySelector<HTMLImageElement>('.image');
    img.onerror = imageErrorHandler;
    img.src = data.image;
  }

  removeItems(items: HTMLElement[]) {
    items.forEach(item => item.remove());
  }
}
