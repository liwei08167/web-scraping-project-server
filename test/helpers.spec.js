const fs = require("fs");
const helperFunctions = require("../utilities/helpers");
const cherrio = require("cheerio");

const exampleFile = fs.readFileSync(__dirname + "/example.html");

const $ = cherrio.load(exampleFile);

describe("getTitle", () => {
  it("should get title text", () => {
    const getExampleTitle = helperFunctions.getTitle($);
    expect(getExampleTitle).toBe("Example Domain");
  });
});

describe("getHeadingsDetails", () => {
  const exampleTest = helperFunctions.getHeadingsDetails($);
  it("should get heading counts", () => {
    expect(exampleTest.length).toBe(3);
  });
  it("should return same heading result as expectedHeadingArr", () => {
    const expectedHeadingArr = [
      {
        headings: "h1",
        level: 3,
      },
      {
        headings: "h2",
        level: 4,
      },
      {
        headings: "h4",
        level: 5,
      },
    ];
    expect(exampleTest.map((heading) => heading.headings)).toEqual(
      expectedHeadingArr.map((h) => h.headings)
    );
  });
});

describe("getImageDetails", () => {
  const exampleImages = helperFunctions.getImageDetails($);
  it("should get image tag", () => {
    expect(exampleImages.length).toBe(2);
  });
  it("should have one image size return null and one with size", () => {
    expect(exampleImages.map((img) => img.imageSize)).toContain(null);
    expect(exampleImages[1].imageSize).toBe(80000);
  });
  it("should have one image with http links", () => {
    expect(exampleImages[0].src).toMatch(/^(http.)/);
  });
});
