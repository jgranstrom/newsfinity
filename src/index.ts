import { fetchNews } from './api';
import { ItemManager } from './ItemManager';
import { ItemData } from './types';

const INITIAL_BATCH_SIZE = 20;
const SUBSEQUENT_BATCH_SIZE = 5;
const SCROLL_THRESHOLD = 0.02;

const containerElement = document.getElementById('container') as HTMLDivElement;
const itemCollection = document.getElementsByClassName('item');
const logoElement = document.getElementById('logo') as HTMLImageElement;
const itemManager = new ItemManager(containerElement, itemCollection);

let lastBatch: Promise<ItemData[]>;
let allDone = false;

function handleLastBatch() {
  document.removeEventListener('scroll', handleScroll);
  allDone = true;
  itemManager.addEndItem();
}

async function fetchNextBatch(count: number) {
  if(allDone) { return; }
  const startIndex = itemManager.count;
  const items = itemManager.addNewsItems(count);

  lastBatch = fetchNews(count, lastBatch);
  const data = await lastBatch;

  if(allDone) {
    itemManager.removeItems(items);
  } else {
    const dataLength = Math.min(count, data.length);
    for(let i = 0; i < dataLength; i++) {
      itemManager.updateNewsItem(startIndex + i, data[i]);
    }

    if(data.length < count) {
      itemManager.removeItems(items.slice(data.length));
      handleLastBatch();
    }
  }
}

function getPercentFromBottom() {
  return (document.body.clientHeight - window.innerHeight - window.pageYOffset) / document.body.clientHeight;
}

function handleScroll() {
  if(getPercentFromBottom() < SCROLL_THRESHOLD) {
    fetchNextBatch(SUBSEQUENT_BATCH_SIZE);
  }
}

function handleTopClick() {
  window.scrollTo(window.pageXOffset, 0);
}

document.addEventListener('scroll', handleScroll);
logoElement.addEventListener('click', handleTopClick);

fetchNextBatch(INITIAL_BATCH_SIZE);