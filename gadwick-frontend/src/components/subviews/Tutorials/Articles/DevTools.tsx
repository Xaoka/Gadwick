import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CodeSnippet from '../Components/CodeSnippet';
import TutorialBox from '../Components/TutorialBox';

export default function DevTools()
{
    const [language, setLanguage] = useState<string>("JS");
    
    const history = useHistory();

    function next()
    {
        // history.push("/dashboard/tutorials/setup");
    }

    return <>
        <TutorialBox topics={["How to open up browser development tools", "What kind of information each tab shows you"]}/>
        <p>When you message the dev team about an issue, one of the most common responses you get back is "are there any errors in the console?". Knowing how to hunt down specifics of what's going wrong with a website can really help speed up how quickly issues get fixed and help you know what exactly to look for when testing.</p>
        <p>Let's open up Chrome's development tools and see what's going on. Each browser's tools are slightly different but they all support the same core set of features that we'll be talking about. Open up a fresh tab and right click the page, then choose "inspect" from the dropdown. You should get something that looks like the image below and while there's a lot going on here, we're just going to touch on the parts that will help you with testing for now.</p>
        <img src='/tutorials/devtools.png' style={{ width: "100%", padding: 20}}/>
        <h3>Elements</h3>
        <p>A web page is made up of lots of HTML elements, this view lets us view them all and explore their properties. You'll be using this view a lot when writing automated tests, as you can search (Ctrl+F on windows) for elements by their properties or text content to find their IDs.</p>
        <h3>Console</h3>
        The console is a powerful part of the development tools. Errors with the web page will show up here if not caught by the web page itself, such as denied network requests or problems with the code on the site. These can be extremely useful in tracking down why an issue is happening or what specifically is going wrong, there may also be extra information printed out here about the state of the site.
        <Alert severity="info">Plain "Info" logs are often printed by website code to help developers keep track of the state of parts of a site while working.</Alert>
        <Alert severity="warning">Warnings indicate that something might not be right, but the site will continue on anyway.</Alert>
        <Alert severity="error">Errors tell you that something has gone wrong with the site and it may well stop working partially or entirely.</Alert>
        <p>You can click the drop down which defaults to "All Levels" to configure the level of logging you want to be looking at. The console also allows you to write and execute javascript directly in your browser, which can be very useful for testing your XPATH code in your tests (We'll touch more on XPATH in a later tutorial).</p>
        <h3>Network</h3>
        The network tab lets you see pretty much everything a site is requesting, such as images or external data. There's a few key things that will be helpful when testing here;
        <img src='/tutorials/network.png' style={{ width: "100%", padding: 20}}/>
        <ul>
            <li>Disable cache is an extremely useful option, as it allows us to stop our browser keeping old versions of a site around and force it to use the latest one.</li>
            <li>The status of a network request will tell us if something went wrong, common HTTP status codes such as 200 (OK), 500 (Internal Server Error) or 403 (Unauthorized)can help you figure out why a site is not working as expected.</li>
            <li>The size of a network request will let you know how big the file or resource is, particularly large files may lead to slower loading times or even crashes on weaker devices.</li>
            <li>The time for a network request to respond will have a real impact on user experience and may even cause unexpected bugs if the time taken causes requests to come back in an unexpected order.</li>
        </ul>
        <h3>Application</h3>
        The application tab stores information about the web page, such as cookies, which you may need to check for features that are intended to persist between web sessions.
    </>
}