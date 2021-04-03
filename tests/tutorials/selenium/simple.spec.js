const { Builder, By, Key, until } = require('selenium-webdriver');
let driver;
beforeAll(() => {
    driver = new Builder()
        .forBrowser('chrome')
        .build();  
    jest.setTimeout(10 * 1000)
});
afterAll(() => {
    driver.quit();
})
describe("Ministry of Test", () =>
{
    it("Should show the latest blogs", async () =>
    {
        await driver.get("https://www.ministryoftesting.com/");
        console.log(`Waiting for elements`)
        await driver.wait(until.elementsLocated(By.css(".lead a")));
        console.log(`Getting elements`)
        const element = (await driver.findElements(By.css(".lead a")))[0];
        console.log(`Checking`)
        expect(await element.getText()).toBe("Quality Engineer Learning Roadmap has just been posted");
    })
})