import express from "express";
import puppeteer from "puppeteer";
import fs from "fs/promises";

//defining port and url
const PORT = process.env.PORT || 5000;
const URL =
  "https://www.pinnacle.it/scommesse/calcio/uefa-champions-league/matchups/";

//initializing server
const app = express();

//defining get method for scrapping data from required url
app.get("/", async (request, response) => {
  try {
    const data = await scrapedData();
    response.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

//defining method for scrapping data
const scrapedData = async () => {
  try {
    const browser = await puppeteer.launch();               //launching an instance of browser
    const page = await browser.newPage();                   //opening a new page

    await page.goto(URL);                                   //opening the url in new page

    //waiting for the elements to populate in dom
    await page.waitForSelector("#primo-blocco-sport");
    await page.waitForSelector(".contenitoreRiga");

    let scrappedData = await page.evaluate(() => {
      return document.getElementById("primo-blocco-sport").textContent;
    });

    //converting the data into array
    scrappedData = scrappedData.split("\n")

    //writing data in a text file
    fs.writeFile("test.txt", scrappedData);

    //closing the instance of browser after the task completes
    await browser.close();

    //returning the scrapped data
    return scrappedData;
  } catch (error) {
    console.error(error);
  }
};

//starting the server
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
