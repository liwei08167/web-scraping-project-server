const axios = require("axios");
const cheerio = require("cheerio");

const stringIsAValidUrl = (url) => {
  const urlObj = new URL(url);
  if (urlObj) {
    return true;
  } else {
    return false;
  }
};

const fetchPage = async (url) => {
  try {
    const startTime = new Date().getTime();
    const { data } = await axios.get(url);

    const endTime = new Date().getTime();

    return { data, loadingTime: endTime - startTime };
  } catch (err) {
    throw err;
  }
};

const parsePage = (body, reqUrl) => {
  const $ = cheerio.load(body.data);
  const document = $.html();
  return document;
};

module.exports = {
  fetchPage,
  parsePage,
  stringIsAValidUrl,
};
