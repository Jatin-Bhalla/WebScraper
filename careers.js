const axios = require("axios");
const cheerio = require("cheerio");

async function findCareersPage(url) {
  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Look for links containing the word "careers" case-insensitively
    const careersLinks = $("a[href*='careers'], a[href*='Careers'], a[href*='CAREERS']");
    
    // Extract the href attribute of the first link found
    if (careersLinks.length > 0) {
      const careersUrl = new URL($(careersLinks[0]).attr("href"), url).href;
      return careersUrl;
    } else {
      throw new Error("Careers page not found");
    }
  } catch (error) {
    console.error("Error finding careers page:", error);
    return null;
  }
}

// Example usage
// https://www.uncountable.com/
// https://www.uplers.com
const url = "https://www.uncountable.com"; // Replace this with the URL you want to scan
findCareersPage(url)
  .then(careersUrl => {
    if (careersUrl) {
      console.log("Found careers page:", careersUrl);
    } else {
      console.log("Careers page not found on the provided URL");
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
