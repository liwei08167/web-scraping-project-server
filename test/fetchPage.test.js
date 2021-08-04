const axios = require("axios");
const { fetchPage } = require("../utilities/helpers");

jest.mock("axios");

describe("fetchPage", () => {
  it("fetches successfully data from url", async () => {
    const data = `<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        
    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 2em;
        background-color: #fdfdff;
        border-radius: 0.5em;
        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        div {
            margin: 0 auto;
            width: auto;
        }
    }
    </style>    
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents. You may use this
    domain in literature without prior coordination or asking for permission.</p>
    <p><a href="https://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
      `;

    axios.get.mockImplementation(() =>
      Promise.resolve({ data, loadingTime: 1 })
    );
    const response = await fetchPage("https://example.com/");

    expect(axios.get).toHaveBeenCalledWith("https://example.com/");
    expect(response.data).toEqual(data);
  });
  it("should should throw an error when fetching notFound website", async () => {
    const errorMessage = "Network Error";

    axios.get.mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await expect(fetchPage("https://easdfasfple.com/")).rejects.toThrow(
      errorMessage
    );
  });
});
