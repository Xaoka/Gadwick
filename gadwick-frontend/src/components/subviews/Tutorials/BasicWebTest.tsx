import TutorialBox from './TutorialBox';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CodeSnippet from './CodeSnippet';

export default function BasicWebTest()
{
    const [language, setLanguage] = useState<string>("NodeJS");
    
    const history = useHistory();

    function next()
    {
        // history.push("/dashboard/tutorials/setup");
    }

    return <>
        <TutorialBox topics={["How to install cypress", "How to write and run a basic cypress test"]}/>
        <p>Let's install cypress and set up our test suite folders.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{ "NodeJS": ["npm i cypress", "npx cypress open"] }}/>
        <p>This will have generated a cypress folder with a few folders within it. We won't worry about too many of those for now and instead create a new file mytest.spec.ts within the integration folder.</p>
        <p>Gadwick would normally generate these files and a bulk of the code for us, but for now let's write a test to check out the cypress website.</p>
        
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{
            "NodeJS":
            [
                "describe('The Cypress website', () => {",
                "\tit('Should have a helpful introduction', async () => {",
                "\t\tcy.visit('https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell');",
                "\t\tcy.get(`.article-title`).should(`have.text`, `Why Cypress?`);",
                "\t})",
                "})"]
        }}/>
        <p>You can run this test by clicking on it in the view that opened when you ran npx cypress open. We can also run all our tests using npx cypress run.</p>
        <p>Hopefully you should see a nice passing result like the one below!</p>
        <img src='/tutorials/testpass.png' style={{ width: "100%", padding: 20}}/>
        <p>So what exactly just happened?</p>
        <p>The first two lines here describe our test case, so we know what the test was meant to check when we look through our test results.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{
            "NodeJS":
            [
                "describe('The Cypress website', () => {",
                "\tit('Should have a helpful introduction', async () => {"]
        }}/>
        <p>Then we tell cypress that we'd like to navigate to a specific web page, in this case it's the cypress website.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{
            "NodeJS": ["cy.visit('https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell');"]
        }}/>
        <p>Cypress waits for the web page to finish loading and then moves on to our next instruction.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{
            "NodeJS": ["cy.get(`.article-title`).should(`have.text`, `Why Cypress?`);"]
        }}/>
        <p>This last instruction tells cypress to find elements that match our search for elements with the class name "article title", we then check that the result has the text we're expecting. If you're not sure why we used "." here, check out our tutorial on css selectors.</p>
    </>
}