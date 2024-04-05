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

async function findJobsLink(url) {
  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Look for elements containing the text "jobs", "roles", or "role" case-insensitively
    const jobsElements = $("*:contains('jobs'), *:contains('roles'), *:contains('role')");

    // Check if any element containing the specified text is found
    if (jobsElements.length > 0) {
      // Check if the element is a link and return its href attribute
      const element = jobsElements.first();
      if (element.is("a")) {
        return new URL(element.attr("href"), url).href;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error finding jobs link:", error);
    return null;
  }
}

async function scrapeSpanParents(url) {
  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Select all <span> elements
    const spanElements = $("span");

    // Loop through each <span> element and print its parent heading
    spanElements.each((index, element) => {
      const parentHeading = $(element).parents("h1, h2, h3, h4, h5, h6").first();
      if (parentHeading.length > 0) {
        console.log(parentHeading.text().trim());
      }
    });
  } catch (error) {
    console.error("Error scraping span parents:", error);
  }
}

// Example usage
const baseUrl = "https://www.uplers.com"; // Replace this with the URL of the website
findCareersPage(baseUrl)
  .then(careersUrl => {
    if (careersUrl) {
      console.log("Found careers page:", careersUrl);
      return findJobsLink(careersUrl);
    } else {
      console.log("Careers page not found");
      return null;
    }
  })
  .then(jobsLink => {
    if (jobsLink) {
      console.log("Found jobs link:", jobsLink);
      console.log("Scraping parent headings of <span> elements...");
      return scrapeSpanParents(jobsLink);
    } else {
      console.log("Jobs link not found");
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
