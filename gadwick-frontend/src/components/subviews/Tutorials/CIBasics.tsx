import TutorialBox from './TutorialBox';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CodeSnippet from './CodeSnippet';
import Link from '../../Link';
import ProCon from './ProCon';

export default function CIBasics()
{
    const [language, setLanguage] = useState<string>("GitlabCI");
    const [scriptLanguage, setScriptLanguage] = useState<string>("bash");
    
    const history = useHistory();

    function next()
    {
        // history.push("/dashboard/tutorials/setup");
    }

    return <>
        <TutorialBox topics={["The ideas behind CI", "How to implement CI"]}/>
        <p>Continuous integration is an extremely powerful philosophy for testing, in which integration tests are automatically applied every time a change is made to the product. This allows you and your team to be confident in each incremental change rather than having to test a wide range of changes all at once. So how do we go about it? This sort of automated testing can be implemented at a range of points in the development lifecycle and we'll talk about their benefits and considerations.</p>
        <h3>Code Repositories</h3>
        <ProCon pros={["Widely supported", "Runs asynchronously", "Reviewable history"]} cons={["Requires a repository", "Delayed feedback"]}/>
        <p>This is the most common way of implementing CI practices, by taking advantage of triggers built into the repository we can run tests on the newly submitted code. Different repository providers have different methods for this but for now we'll cover using GitLab.</p>
        <p>We can create a new file for the repository triggers to use in the root of our project.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage}
            code={
                {
                    "GitlabCI": ["touch gitlab-ci.yml"]
                }}/>
        <p>We can now fill in this file and tell gitlab what to do when we push up some code. CI pipelines allow us to perform actions in stages that rely on the previous stage succeeding, so we can define a testing stage we'd like to run. Pipeline actions run within containers, so let's select a node container and run our tests within it. Finally, let's tell our pipeline to run these tests every time someone proposes a code change to our product.</p>
        <CodeSnippet language={language} onLanguageChanged={setLanguage}
            code={
                {
                    "GitlabCI": [
                        "stages:",
                        "  - testing",
                        "jest-tests:",
                        "   image: node:12",
                        "   stage: testing",
                        "   script:",
                        "      - npm install",
                        "      - jest",
                        "   only:",
                        "     - merge_requests"]
                }}/>
        <p>We can make this testing pipeline a bit more useful by updating our repository settings to only allow code to be merged in when the pipeline passes, so that code changes are more likely to be bug free. We could also leverage our work messaging apps such as Slack to notify us with <Link label="webhooks" src="https://api.slack.com/messaging/webhooks"/>, support for this built into Gadwick is coming soon.</p>
        <h3>Pre-Commit hooks</h3>
        <ProCon pros={["More complicated setup", "Feedback before code is pushed up"]} cons={["Slower code pushes", "Local environment"]}/>
        <p>One strategy we can use is git hooks to execute our tests before a developer is allowed to commit code up to the shared repository. These are written in bash at least initially, but might invoke a node or python script to make them more user friendly. We can add a new file "pre-commit" to our .git/hooks folder:</p>
        <CodeSnippet language={scriptLanguage} onLanguageChanged={setScriptLanguage} title="pre-commit"
            code={
                {
                    "bash": ["jest"]
                }}/>
        <p>This will now automatically run every time we try to commit and will prevent the code from being committed if it does not pass.</p>
        <h3>On Save Testing</h3>
        <ProCon pros={["Feedback while writing tests or features"]} cons={["Not suitable for many tests"]}/>
        <p>On save testing is the fastest way to get feedback on potential bugs in your product, but it comes with a cost. Running tests every time you change a file can be expensive, so works best for tests that are quick to run and aren't going to cause issues if they abort part way through. Unit tests around functions are a good example of this typically.</p>
        <p>React components for example have this feature built in, but if you wish to roll your own you may need to take advantage of something like <Link label="inotify" src="https://github.com/inotify-tools/inotify-tools/wiki"/></p>
        <CodeSnippet language={scriptLanguage} onLanguageChanged={setScriptLanguage} title="pre-commit"
            code={
                {
                    "bash": ["inotifywait -r  -m /dir/to/monitor/"]
                }}/>

    </>
}