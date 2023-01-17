const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const scrapeUrls = async (url, allUrls = []) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $('a').each((i, el) => {
      const link = $(el).attr('href');
      if (link && !link.startsWith('http')) {
        allUrls.push(`${url}${link}`);
        scrapeUrls(`${url}${link}`, allUrls);
      } else if (link) {
        allUrls.push(link);
        scrapeUrls(link, allUrls);
      }
    });
  } catch (error) {
    console.log(error);
  }
  return allUrls;
};



app.get('/scrape', async (req, res) => {
    const { url } = req.query;
    try {
      const urlList = await scrapeUrls(url);
      res.status(200).send(urlList);
    } catch (error) {
      res.status(500).send(error);
    }
});

app.listen(4000, () => console.log("Server is listening on port 4000"));
