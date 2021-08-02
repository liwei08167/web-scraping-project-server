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

  const doctypeVersion = getDoctypeVersion(document);

  const title = getTitle($);
  const headingsDetails = getHeadingsDetails($);
  return { doctypeVersion, title, headingsDetails };
};

const getDoctypeVersion = (document) => {
  const doctypeTagArr = document.substring(0, 800).split("<");
  const doctypeVersion =
    "<" +
    doctypeTagArr.find((el) => {
      return el.includes("!DOCTYPE");
    });
  return doctypeVersion;
};

const getTitle = ($) => {
  const title = $("title").text();
  console.log({ title });
  return title;
};

const getHeadingsDetails = ($) => {
  //headings and levels
  let headingsDetailsArr = [];

  for (let i = 1; i <= 6; i++) {
    $(`h${i}`).each(function (index, e) {
      headingsDetailsArr.push({
        headings: e.name,
        level: $(this).parents().length,
      });
    });
  }

  return headingsDetailsArr;
};

module.exports = {
  fetchPage,
  parsePage,
  stringIsAValidUrl,
};
