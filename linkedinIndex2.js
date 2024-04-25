const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.linkedin.com/jobs/search?keywords=Frontend%20Developer&location=United%20States&pageNum=0';

axios.get(url)
  .then(response => {
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const jobListings = $('div.job-search-card');
      
      jobListings.each((index, element) => {
        const title = $(element).find('h3.base-search-card__title').text().trim();
        const company = $(element).find('a.hidden-nested-link').text().trim();
        const location = $(element).find('span.job-search-card__location').text().trim();
        const hrefLink = $(element).find('a.base-card__full-link').attr('href');
        
        console.log(`Title: ${title}\nCompany: ${company}\nLocation: ${location}\nJob Link: ${hrefLink}\n`);
      });
    } else {
      console.log("Failed to fetch job listings.");
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
