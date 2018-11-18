import { fetchNews } from './api';
import { ItemManager } from './ItemManager';
import { ItemData } from './types';

const INITIAL_BATCH_SIZE = 20;
const SUBSEQUENT_BATCH_SIZE = 5;
const SCROLL_THRESHOLD = 0.02;

const indicator = document.getElementById('indicator') as HTMLDivElement;
const containerElement = document.getElementById('container') as HTMLDivElement;
const scrollElement = document.getElementById('scroll') as HTMLDivElement;
const itemCollection = document.getElementsByClassName('item');
const logoElement = document.getElementById('logo') as HTMLImageElement;
const itemManager = new ItemManager(containerElement, scrollElement, itemCollection);

let lastBatch: Promise<ItemData[]>;
let allDone = false;

function handleLastBatch() {
  allDone = true;
  itemManager.addEndItem();
}

async function fetchNextBatch(count: number) {
  if(allDone) { return; }
  const startIndex = itemManager.count;
  const { containerItems, scrollItems } = itemManager.addNewsItems(count);

  lastBatch = fetchNews(count, lastBatch);
  const data = await lastBatch;

  if(allDone) {
    itemManager.removeItems(containerItems);
    itemManager.removeItems(scrollItems);
  } else {
    const dataLength = Math.min(count, data.length);
    for(let i = 0; i < dataLength; i++) {
      itemManager.updateNewsItem(startIndex + i, data[i]);
    }

    if(data.length < count) {
      itemManager.removeItems(containerItems.slice(data.length));
      itemManager.removeItems(scrollItems.slice(data.length));
      handleLastBatch();
    }
  }

  updateIndicator();
}

function getPercentFromBottom() {
  return (document.body.clientHeight - window.innerHeight - window.pageYOffset) / document.body.clientHeight;
}

function handleScroll() {
  if(getPercentFromBottom() < SCROLL_THRESHOLD) {
    fetchNextBatch(SUBSEQUENT_BATCH_SIZE);
  }

  updateIndicator();
}

function handleResize() {
  updateIndicator();
}

function handleTopClick() {
  window.scrollTo(window.pageXOffset, 0);
}

function handleScrollClick(event: MouseEvent) {
  window.scrollTo(window.pageXOffset, (event.clientY / window.innerHeight) * document.body.clientHeight - window.innerHeight / 2);
}

function updateIndicator() {
  const visibleShare = window.innerHeight / document.body.clientHeight;
  const pxHeight = window.innerHeight * visibleShare;
  const offsetShare = window.pageYOffset / document.body.clientHeight;
  const pxTop = window.innerHeight * offsetShare;

  indicator.style.height = pxHeight + 'px';
  indicator.style.top = pxTop + 'px';
}

document.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize);
logoElement.addEventListener('click', handleTopClick);
scrollElement.addEventListener('click', handleScrollClick);

fetchNextBatch(INITIAL_BATCH_SIZE);
