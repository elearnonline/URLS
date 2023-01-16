const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');

const app = express();

app.use(cors({
  origin: ['http://clientDomain.com']
}));

app.get('/scrape', async (req, res) => {
  const { url: initialUrl } = req.query;
  const parsedUrl = url.parse(initialUrl);
  const domain = parsedUrl.protocol + '//' + parsedUrl.host;
  const urls = await getUrls(initialUrl, domain);
  res.json(urls);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

const getUrls = async (url, domain) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  let urls = $('a').map((i, el) => $(el).attr('href')).get();

  urls = urls.map((u) => {
    if (!u.startsWith('http') && !u.startsWith('/')) {
      return domain + '/' + u;
    }
    return u;
  });

  const result = [];
  for (const u of urls) {
    result.push(...await getUrlsRecursive(u, domain));
  }
  return result;
};

const getUrlsRecursive = async (url, domain) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  let urls = $('a').map((i, el) => $(el).attr('href')).get();

  urls = urls.map((u) => {
    if (!u.startsWith('http') && !u.startsWith('/')) {
      return domain + '/' + u;
    }
    return u;
  });

  const result = [];
  for (const u of urls) {
    result.push(...await getUrlsRecursive(u, domain));
  }
  return [...result, url];
};
