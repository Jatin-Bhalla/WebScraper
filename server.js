const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const fetchJobListings = async (keyword, location) => {
    try {
        const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&pageNum=0`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const jobListings = $('div.job-search-card');
            const jobListingsArray = [];

            jobListings.each((index, element) => {
                const title = $(element).find('h3.base-search-card__title').text().trim();
                const company = $(element).find('a.hidden-nested-link').text().trim();
                const location = $(element).find('span.job-search-card__location').text().trim();
                const hrefLink = $(element).find('a.base-card__full-link').attr('href');

                jobListingsArray.push({ title, company, location, hrefLink });
            });

            return jobListingsArray;
        } else {
            throw new Error("Failed to fetch job listings.");
        }
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Error processing request.");
    }
};

app.post('/search', async (req, res) => {
    try {
        const { keyword, location } = req.body;
        const jobListings = await fetchJobListings(keyword, location);
        res.json(jobListings);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
