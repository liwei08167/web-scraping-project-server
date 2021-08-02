const express = require("express");

const {
  fetchPage,
  parsePage,
  stringIsAValidUrl,
} = require("../utilities/helpers");

const app = express();

app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3006;

app.get("/", (req, res, next) => {
  //   res.send({ message: "Hello FROM NODEJS!" });
  res.send(
    '<form action="/" method="POST"><input type="text" name="website"><button type="submit">search</button></form>'
  );
});

app.post("/", async (req, res, next) => {
  console.log(req.body.website);
  try {
    const isvalidUrl = stringIsAValidUrl(req.body.website);
    if (isvalidUrl) {
      const page = await fetchPage(req.body.website);
      const webData = page && parsePage(page, req.body.website);
      console.log(webData);
    }
  } catch (err) {
    console.log(err);
  }
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
