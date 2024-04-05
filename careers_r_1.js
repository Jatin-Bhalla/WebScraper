const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

async function findRemoteSpans(url, visitedUrls = new Set()) {
  try {
    // Normalize the URL
    const normalizedUrl = new URL(url).href;

    // Skip if URL has already been visited or has unsupported protocol
    if (visitedUrls.has(normalizedUrl) || !normalizedUrl.startsWith("http")) {
      return;
    }
    visitedUrls.add(normalizedUrl);

    // Fetch the webpage content
    const response = await axios.get(normalizedUrl);
    const $ = cheerio.load(response.data);

    // Select all <span> elements containing the word "Remote" (case-insensitive)
    const remoteSpans = $("span:contains('Remote')");

    // Print the URL if any <span> element with "Remote" is found
    if (remoteSpans.length > 0) {
      console.log("Found Remote span(s) on:", normalizedUrl);
    }

    // Find all links on the page
    const links = $("a[href]");

    // Iterate through each link
    for (let i = 0; i < links.length; i++) {
      const href = $(links[i]).attr("href");
      const absoluteUrl = new URL(href, normalizedUrl).href;

      // Recursively call findRemoteSpans for each link
      await findRemoteSpans(absoluteUrl, visitedUrls);
    }
  } catch (error) {
    console.error("Error while processing", url, ":", error.message);
  }
}

// Example usage
const baseUrl = "https://www.uplers.com"; // Replace this with the URL of the website
findRemoteSpans(baseUrl);
