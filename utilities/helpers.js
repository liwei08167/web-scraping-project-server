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

  const imageDetails = getImageDetails($);
  const linksDetails = getLinksDetails($, reqUrl);
  return { doctypeVersion, title, headingsDetails, imageDetails, linksDetails };
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

const getImageDetails = ($) => {
  //**The number of pictures and the largest one

  const imageArr = [];
  $("img").each((index, e) => {
    const width = e.attribs.width && parseInt(e.attribs.width);
    const height = e.attribs.height && parseInt(e.attribs.height);
    const src = e.attribs.src;

    imageArr.push({
      imageSize: width && height ? width * height : null,
      width: width ? width : null,
      height: height ? height : null,
      src: src || null,
    });
  });

  return imageArr;
};

const getLinksDetails = ($, reqUrl) => {
  // **Internal links and their count
  // External links and their count
  //Inaccessible links and their count
  const reqURLOrigin = new URL(reqUrl).origin
    .replace(/^(https?):\/\/(www.)?/g, "")
    .trimStart();

  const linkResult = {
    internal: {
      count: 0,
      weblinks: [],
    },
    external: {
      count: 0,
      weblinks: [],
    },
    uncategorized: {
      count: 0,
    },
    totalLinks: 0,
  };

  $("a").each((index, e) => {
    const link = e.attribs.href;

    if (link) {
      if (link.startsWith("/") || link.startsWith("#")) {
        linkResult.internal.count++;
        linkResult.internal.weblinks.push(link);
      } else if (link.startsWith("http")) {
        const linkUrlOrigin = new URL(link).origin
          .replace(/^(https?):\/\/(www.)?/g, "")
          .trimStart();
        if (!linkUrlOrigin) {
          linkResult.uncategorized.count++;
        }
        if (reqURLOrigin === linkUrlOrigin) {
          linkResult.internal.count++;
          linkResult.internal.weblinks.push(link);
        } else {
          linkResult.external.count++;
          linkResult.external.weblinks.push(link);
        }
      } else {
        linkResult.uncategorized.count++;
      }
    } else {
      linkResult.uncategorized.count++;
    }
    linkResult.totalLinks++;
  });
  console.log(
    linkResult.totalLinks,
    linkResult.internal.count,
    linkResult.external.count,
    linkResult.uncategorized.count
  );
  return linkResult;
};

module.exports = {
  fetchPage,
  parsePage,
  stringIsAValidUrl,
  getDoctypeVersion,
  getTitle,
  getHeadingsDetails,
  getImageDetails,
  getLinksDetails,
};
