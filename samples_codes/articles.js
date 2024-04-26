const axios =require("axios");
const cheerio =require("cheerio");
const express =require("express");

const PORT = process.env.PORT||3000

const app =express();

const url ="--WEBSITE NAME--";
axios(url)
    .then(response =>{
        const html =response.data;
        // console.log(html);
        const  $ =cheerio.load(html)
        const articles=[]
// the class name for the articles  on the website
        $("--XYZ--").each(function(){
           const careers = $(this).text();
           const url= $(this).find('a').attr('href');
           articles.push({title,url})

        })
        console.log(articels)
    }).catch(err=>console.log(err))



app.listen(PORT,()=>console.log(`SERVER RUNNNING ON PORT: ${PORT}`));
