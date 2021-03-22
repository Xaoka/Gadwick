import React, { useState } from 'react';
import CodeSnippet from '../Components/CodeSnippet';
import TutorialBox from '../Components/TutorialBox';

export default function SeleniumScreenshots()
{
    const [language, setLanguage] = useState<string>("Cucumber");
    return <>
        <TutorialBox topics={["'After' hooks", "How to take a screenshot when a test fails"]}/>
        <p>
            When tests fail, especially intermittently, it can be tricky to work out exactly what went wrong. Is there a new problem with the product that we just caught, or did we fail to take into account normal behaviour? While logs and comparison statements help, they don't always give us the full picture - which can be important when we're testing UI.
        </p>
        <p>
            Let's use this poorly thought out test case as an example. While this might pass when we write the test, it probably won't keep passing when the site updates, despite the site's intended behaviour still working just fine.
        </p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage}
            code={
                {
                    // "Cucumber": [
                    //     "Feature: Ministry of Test timeline",
                    //     "",
                    //     " As a User I expect to see the latest blogs",
                    //     "",
                    //     " Scenario: Visiting the home page",
                    //     "   Given We have navigated to \"https://www.ministryoftesting.com/\"",
                    //     "   Then I expect to see \"Quality Engineer Learning Roadmap has just been posted\""],
                    "Selenium": [
                        "await this.driver.get(\"https://www.ministryoftesting.com/\");",
                        "await this.driver.wait(until.elementLocated(By.css(\".lead a\")));",
                        "assert(await (await this.driver.findElement(By.xpath(xpath)).text() == \"Quality Engineer Learning Roadmap has just been posted\");",
                    ]
                }}/>
        <CodeSnippet language={language} onLanguageChanged={setLanguage}
            code={
                {
                    // "Cucumber": [
                    //     "var {Before} = require('@cucumber/cucumber');",
                    //     "After(function()",
                    //     "{",
                    //     "  await this.driver.screenshot()",
                    //     "});"
                    // ],
                    "Selenium": [

                    ]
                }}/>

    </>
}