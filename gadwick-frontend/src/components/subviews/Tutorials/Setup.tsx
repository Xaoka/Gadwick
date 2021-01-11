import React, { useState } from 'react';
import CodeSnippet from './CodeSnippet';

export default function Setup(/*props: { app: IConfiguredApplication }*/)
{
    const [language, setLanguage] = useState<string>("NodeJS");
    return <>
        <p>Testing with Gadwick is simple and fits right into your existing test suites.</p>
        <div>First we'll need to install the Gadwick dependency.</div>
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{ "NodeJS": ["npm i gadwick"], "Python": ["pip install -i https://test.pypi.org/simple/ gadwick-pkg-Xaoka"]}}/>
        Then we can configure Gadwick so it knows which account and product you are working on. You'll need to provide the path to your test directory and the client secret for your product.
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{ "NodeJS": ["gadwick configure", "{api-key}", "./path/to/my/tests", "{app-client-secret}"], "Python": ["gadwick configure?", "./path/to/my/tests", "{app-client-secret}"]}}/>
        Once Gadwick is configured, we can sync your local test files with the features that have been set up on Gadwick. This will generate test stubs for any missing tests and update Gadwick with any local tests you might already have.
        <CodeSnippet language={language} onLanguageChanged={setLanguage} code={{ "NodeJS": ["gadwick update"] }}/>
        Once this process is complete, you will see an output like the one below and there may be new test files in your test directory.
        <code style={{ margin: 30 }}>
            [OLD]   I am a feature that existed before the update to sync files<br></br>
            [NEW]   I am a new feature that was configured on Gadwick, but you didn't have locally<br></br>
            [LOCAL] I am a feature that only existed locally, that Gadwick now knows about
        </code>
    </>
}