import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CodeSnippet from '../Components/CodeSnippet';
import TutorialBox from '../Components/TutorialBox';

export default function FirstTest()
{
    const [language, setLanguage] = useState<string>("JS - Jest");
    
    const history = useHistory();

    function next()
    {
        history.push("/dashboard/tutorials/setup");
    }

    return <>
        <TutorialBox topics={["How to install a test framework", "How to run your first test"]}/>
        <p>Let's write our first test.</p>
        <div>First we'll need to install the testing library we want to use.</div>
        <CodeSnippet language={language} onLanguageChanged={setLanguage}
            code={
                {
                    "JS - Jest": ["npm i jest -g"],
                }}/>
        {/** TODO: The file name should be lang-specific */}
        <div>Now let's create a file called MyTest.spec.js, normally Gadwick would generate this for us. In this file we will add the following code:</div>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} title="MyTest.spec.js"
            code={{
                "JS - Jest": ["describe('My first test', () => {", "\tit('Should pass', async () => {", "\t\texpect(1 + 2).toBe(3);", "\t})", "})"]
            }}
            />
        <div>We can now run this simple test suite using</div>
        <CodeSnippet language={language} onLanguageChanged={setLanguage}
            code={{
                "JS - Jest": ["jest"]
            }}
            />
        <div>Then we should expect to see some output about our test results.</div>
        <CodeSnippet language={language} onLanguageChanged={setLanguage}
            code={{
                "JS - Jest": ["Test Suites: 0 failed, 1 passed, 1 total", "Tests:       0 failed, 1 passed, 1 total", "Snapshots:   0 total", "Time:        0.87 s", "Ran all test suites."]
            }}
            />
        <div>In our next tutorial we will learn how to send these results to Gadwick and generate the bulk of this code automatically.</div>
        <button onClick={next}>Next: Setting up Gadwick</button>
    </>
}