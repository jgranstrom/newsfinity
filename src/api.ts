import { ItemData } from './types';

interface NewsItem { publishedAt: string; title: string; description: string; urlToImage: string; source: { name: string }; url: string; }
interface LastBatchDetails { nextTo: Date | void, lastCount: number };

function transformNewsItem(item: NewsItem) {
  return {
    time: new Date(item.publishedAt),
    title: item.title,
    text: item.description,
    image: item.urlToImage,
    author: item.source.name,
    url: item.url,
  };
}

async function getLastBatchDetails(lastBatch: Promise<ItemData[]>): Promise<LastBatchDetails> {
  const lastData = await lastBatch;

  return {
    nextTo: lastData.length > 0 ? new Date(lastData[lastData.length - 1].time.valueOf() - 1) : void 0,
    lastCount: lastData.length
  }
}

export async function fetchNews(count: number, lastBatch?: Promise<ItemData[]>): Promise<ItemData[]> {
  const { nextTo, lastCount } = lastBatch ? await getLastBatchDetails(lastBatch) : { nextTo: void 0, lastCount: -1 };
  if(lastCount === 0) { return []; }

  try {
    const response = await fetch(nextTo ? `/api/news?limit=${count}&to=${nextTo.toISOString()}` : `/api/news?limit=${count}`)
    const data = await response.json();
    return data.articles.map(transformNewsItem);
  } catch(err) {
    console.error(err);
    return [];
  }
}