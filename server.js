const express = require('express');
const compression = require('compression');
const path = require('path');
const morgan = require('morgan');
const request = require('request-promise');

const app = express();

app.disable('x-powered-by');
app.use(morgan('short'));
app.use(compression());

app.get('/api/news', (req, res) => {
  const limit = Number(req.query.limit);
  const to = req.query.to;

  if(limit !== 5 && limit !== 20) {
    return res.status(400).send('Bad request');
  } else if(limit === 5 && to == null) {
    return res.status(400).send('Bad request');
  } else if(limit === 20 && to != null) {
    return res.status(400).send('Bad request');
  }

  request({
    uri: `https://newsapi.org/v2/everything`,
    json: true,
    qs: {
      apiKey: process.env.NEWS_API_KEY,
      language: 'en',
      sources: 'ars-technica,crypto-coins-news,engadget,recode,techradar,the-next-web,the-verge,wired',
      pageSize: limit,
      page: 1,
      to,
      sortBy: 'publishedAt',
    }
  })
  .then(d => res.json(d))
  .catch(err => res.status(500).send(err.message));
});

if(process.env.NODE_ENV === 'development') {
  const Bundler = require('parcel-bundler');
  const bundler = new Bundler('src/index.pug');
  app.use(bundler.middleware());
} else {
  app.use('/dist', express.static(path.join(__dirname, 'dist'), {
    maxage: '30d',
  }));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });;
}

const port = process.env.PORT || 1235;
app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
