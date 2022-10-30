import express from "express";
import puppeteer from "puppeteer";
import fs from "fs/promises";

const PORT = process.env.PORT || 5000;
const URL =
  "https://www.pinnacle.it/scommesse/calcio/uefa-champions-league/matchups/";

const app = express();

app.get("/", async (request, response) => {
  try {
    const data = await scrapedData();
    response.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

const scrapedData = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    await page.waitForSelector("#primo-blocco-sport");
    await page.waitForSelector(".contenitoreRiga");

    let scrappedData = await page.evaluate(() => {
      return document.getElementById("primo-blocco-sport").textContent;
    });

    scrappedData = scrappedData.split("\n")

    fs.writeFile("test.txt", scrappedData);

    console.log(scrappedData);

    await browser.close();

    return scrappedData;
  } catch (error) {
    console.error(error);
  }
};

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
