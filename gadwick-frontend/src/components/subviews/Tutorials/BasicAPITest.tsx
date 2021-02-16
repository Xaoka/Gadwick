import TutorialBox from './TutorialBox';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CodeSnippet from './CodeSnippet';
import Link from '../../Link';

export default function BasicAPITest()
{
    const [language, setLanguage] = useState<string>("NodeJS");
    
    const history = useHistory();

    function next()
    {
        // history.push("/dashboard/tutorials/setup");
    }

    return <>
        <TutorialBox topics={["How to check an API endpoint's OPTIONS", "How to validate the response for a GET request"]}/>
        <p>Testing APIs is a core part of a QA tester's toolkit, but it can feel a bit daunting to get started. We're going to make use of <Link label="PunkAPI" src="https://punkapi.com/documentation/v2"/> again and write some tests around the behaviour.</p>
        <p>Create a test file and install the http library we'll be using for this tutorial.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{ "NodeJS": ["npm i axios", "npm i jest"], "Python": [] }}/>
        <p>The simplest test to write is typically for the OPTIONS method, so let's add a case and check we get back the headers we're expecting. We'll define our test case and make a request to the endpoint using the OPTIONS method. We can get the headers out of the response, save them in a variable and then make some assertions about the contents of the header.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{
            "NodeJS":
            [
                "const axios = require('axios');",
                "",
                "describe('The PunkAPI', () => {",
                "\tit('Should provide OPTIONS', async () => {",
                "\t\tconst response = await axios.options(`https://api.punkapi.com/v2/beers`)",
                "\t\tconst methods = response.headers[`access-control-allow-methods`].split(`,`);",
                "\t\t",
                "\t\texpect(methods).toContain(`GET`);",
                "\t\texpect(methods).toContain(`HEAD`);",
                "\t\texpect(methods).toContain(`PUT`);",
                "\t\texpect(methods).toContain(`PATCH`);",
                "\t\texpect(methods).toContain(`POST`);",
                "\t\texpect(methods).toContain(`DELETE`);",
                "\t})",
                "})"],
            "Python": [
                "import requests",
                "import unittest",
                "import json",
                "",
                "",
                "class PunkAPITest(unittest.TestCase):",
                "\tdef test_options(self):",
                "\t\tresponse = requests.options('https://api.punkapi.com/v2/beers')",
                "\t\theaders = response.headers['access-control-allow-methods']",
                "\t\tself.assertIn('GET', headers)",
                "\t\tself.assertIn('HEAD', headers)",
                "\t\tself.assertIn('PUT', headers)",
                "\t\tself.assertIn('PATCH', headers)",
                "\t\tself.assertIn('POST', headers)",
                "\t\tself.assertIn('DELETE', headers)",
                "",
                "",
                "if __name__ == '__main__':",
                "\tunittest.main()",
                ""
            ]
        }}/>
        <p>Great, now we know the end point is accepting all the methods we're expecting! Let's add another test case, this time for GET. We're going to check we get back a JSON object containing some entries.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{
            "NodeJS":
            [
                "\tit('Should return a list of beers', async () => {",
                "\t\tconst response = await axios.get(`https://api.punkapi.com/v2/beers`);",
                "\t\texpect(response.data.length).toBeGreaterThan(0);",
                "\t})"],
            "Python": [
                "\tdef test_get(self):",
                "\t\tresponse = requests.get('https://api.punkapi.com/v2/beers')",
                "\t\tself.assertGreater(len(json.loads(response.text)), 0)"
            ]
        }}/>
        <p>Finally, let's add a quick check to make sure some fields are formatted the way we expect.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{
            "NodeJS":
            [
                "\tit('Should return a list of beers', async () => {",
                "\t\tconst response = await axios.get(`https://api.punkapi.com/v2/beers`);",
                "\t\texpect(response.data.length).toBeGreaterThan(0);",
                "\t\tfor (const beer of response.data)",
                "\t\t{",
                "\t\t\texpect(beer.id).not.toBeNaN();",
                "\t\t\texpect(beer.id % 1).toBe(0);",
                "\t\t\texpect(beer.name).toMatch(/[a-zA-Z ]+/);",
                "\t\t}",
                "\t})"],
            "Python": [
                "\tdef test_get(self):",
                "\t\tresponse = requests.get('https://api.punkapi.com/v2/beers')",
                "\t\tself.assertGreater(len(json.loads(response.text)), 0)",
                "\t\tfor beer in json.loads(response.text):",
                "\t\t\tself.assertTrue(beer['id'] % 1 == 0)",
                "\t\t\tself.assertTrue(re.match('[a-zA-Z ]+', beer['name']))"
            ]
        }}/>
        <p>We should now have a green passing test suite for part of the PunkAPI!</p>
    </>
}