//create a basic structure for the web crawler
require('dotenv').config();

const axios = require('axios');
const express = require('express');
const app = express();
const ratelimit = require('express-rate-limit');
const fs = require('fs');
const PORT = process.env.PORT||3000;

//rate limit
const apilimit =ratelimit({
    windowMS:5*60*1000, // MIN*SEC*MS
    max:10, //10 request per IP 
})
app.use('/api/',apilimit)  //all the routes under api/* will be rate limited

// Load LinkedIn API credentials from environment variables or use default values
const apiKey = process.env.LINKEDIN_API_KEY || 'YOUR_DEFAULT_API_KEY';
const apiSecret = process.env.LINKEDIN_API_SECRET || 'YOUR_DEFAULT_API_SECRET';

// Set up Axios instance to manage API calls
const axiosInstance = axios.create({
    baseURL: 'https://api.linkedin.com/v2/',
});

// Set up an express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Define the routes and logic
// Fetch a job role
app.get('/job/:role', async (req, res) => {
    const { role } = req.params;
    try {
        const response = await axiosInstance.get(`/jobsV2?q=${role}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        const jobData = response.data;
        res.json(jobData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `ERROR: ${error.message}` });
    }
});

// Handling pagination
app.get('/jobs', async (req, res) => {
    const start = req.query.start || 0;
    const count = req.query.count || 10;
    try {
        const response = await axiosInstance.get('/jobsV2', {
            params: {
                q: '', // You need to provide the query string for job search, adjust as per your requirement
                start: start,
                count: count,
            },
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        const jobData = response.data;
        res.json(jobData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `ERROR: ${error.message}` });
    }
});

// Save data to JSON file
const saveToJSONFile = (data, filename) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
};

// Example usage
app.get('/saveJobs', async (req, res) => {
    try {
        const response = await axiosInstance.get('/jobsV2', {
            params: {
                q: 'software engineer', // Example job search query
                start: 0,
                count: 10,
            },
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        const jobData = response.data.elements; // Access elements array from response data
        saveToJSONFile(jobData, 'jobs.json'); // Pass job data to saveToJSONFile function
        res.json({ message: 'Job data saved to jobs.json' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `ERROR: ${error.message}` });
    }
});
