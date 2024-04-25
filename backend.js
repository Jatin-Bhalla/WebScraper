const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3000;

async function findCareersPage(url) {
  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Look for links containing the word "careers" or "career" case-insensitively
    const careersLinks = $("a[href*='careers' i], a[href*='career' i]");
    
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

app.get("/find-careers-page", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is missing" });
  }

  try {
    const careersUrl = await findCareersPage(url);
    if (careersUrl) {
      res.json({ careersUrl });
    } else {
      res.status(404).json({ error: "Careers page not found on the provided URL" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
