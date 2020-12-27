import React, { useState } from 'react';
import { IConfiguredApplication } from '../Applications/AppView';

type SupportedLanguages = "NodeJS" | "Java" | "Python";

interface ISnippets
{
    app?: IConfiguredApplication
}

export default function Snippets(props: ISnippets)
{
    const [language, setLanguage] = useState<SupportedLanguages>("NodeJS");

    function languagePicker()
    {
        return <select name="language" id="language" onChange={(evt) => setLanguage(evt.target.value as SupportedLanguages)}>
            <option value={"NodeJS"}>NodeJS</option>
            <option value={"Python"}>Python</option>
            <option value={"Java"}>Java</option>
        </select>
    }

    function setupSnippet()
    {
        if (language === "NodeJS")
        {
            return <code>
                npm i gadwick -g
            </code>
        }
        if (language === "Python")
        {
            return <code>
                pip install -i https://test.pypi.org/simple/ gadwick-pkg-Xaoka
            </code>
        }
    }

    function configureSnippet()
    {
        if (language === "NodeJS")
        {
            return <code>
                gadwick configure
                <code className="comment">Specify the path to your test directory(.):</code>
                ./path/to/my/tests
                <code className="comment">Client Secret:</code>
                {props.app?.client_secret}
            </code>
        }
    }

    function syncSnippet()
    {
        if (language === "NodeJS")
        {
            return <code>
                gadwick update
            </code>
        }
    }

    return <>
        {languagePicker()}
        <div>First we'll need to install the Gadwick dependency.</div>
        {setupSnippet()}
        Then we can configure Gadwick so it knows which account and product you are working on. You'll need to provide the path to your test directory and the client secret for your product.
        {configureSnippet()}
        Once Gadwick is configured, we can sync your local test files with the features that have been set up on Gadwick. This will generate test stubs for any missing tests and update Gadwick with any local tests you might already have.
        {syncSnippet()}
        Once this process is complete, you will see an output like the one below and there may be new test files in your test directory.
        <code>
            [OLD]   I am a feature that existed before the update to sync files<br></br>
            [NEW]   I am a new feature that was configured on Gadwick, but you didn't have locally<br></br>
            [LOCAL] I am a feature that only existed locally, that Gadwick now knows about
        </code>
    </>
}