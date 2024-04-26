const express = require('express');
const axios = require('axios');
const cheerio =require('cheerio');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Console } = require('console');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

let job=[];

app.post('/save', (req, res) => {
    let newjob = {
        // Define your job object here
    };
    // Assuming newjob is defined somewhere in your code
    job.push(newjob);
    fs.writeFile("job.json", JSON.stringify(job), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving job data');
        } else {
            res.status(200).json(newjob);
        }
    });
});

// const url = 'https://www.linkedin.com/jobs/search?keywords=Frontend%20Developer&location=United%20States&pageNum=0';
const keywords = "Backend Developer";
const location = "United States";
const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}&pageNum=0`;


app.get('/joblistings', async (req, res) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const html = response.data;
            let $ = cheerio.load(html);
            let jobListings = $('div.job-search-card');
            let jobListingsArray=[];

            jobListings.each((index, element) => {
                const title = $(element).find('h3.base-search-card__title').text().trim();
                const company = $(element).find('a.hidden-nested-link').text().trim();
                const location = $(element).find('span.job-search-card__location').text().trim();
                const hrefLink = $(element).find('a.base-card__full-link').attr('href');

                jobListingsArray.push({ title, company, location, hrefLink });
            });
            
            res.json(jobListingsArray);

            
        } else {
            res.status(500).send("Failed to fetch job listings.");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error processing request.");
    }
});




// Serve the index.html file for the root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
//t sends the index.html file back to the client as the response.


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
