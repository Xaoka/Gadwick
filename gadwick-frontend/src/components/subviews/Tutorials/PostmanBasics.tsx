import TutorialBox from './TutorialBox';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CodeSnippet from './CodeSnippet';
import Link from './Link';

export default function PostmanBasics()
{
    const [language, setLanguage] = useState<string>("NodeJS");
    
    const history = useHistory();

    function next()
    {
        // history.push("/dashboard/tutorials/setup");
    }

    return <>
        <TutorialBox topics={["How to query an API with postman", "Types of requests", "Request properties"]}/>
        <p>An API (Or Application Programming Interface) is a standard way of communicating with an external service. We can use Postman for testing api calls, so let's download it from their <Link label="website" src="https://www.postman.com/"/>.</p>
        <p>When you open up postman you should arrive at a view somewhat like the one below. Click "New" and then "Request" to create our first request.</p>
        <img src='/tutorials/postman_app.png' style={{ width: "100%", padding: 20}}/>
        <h3>Calling an API</h3>
        <p>We're going to use the <Link label="PunkAPI" src="https://punkapi.com/documentation/v2"/>, so let's set the url to https://api.punkapi.com/v2/beers and click SEND. This is known as an "Endpoint" - a url that points to an API resource. You should get back a lot of data about beers back in the bottom of your view. This will be in JSON format, which we've touched on in our other tutorials.</p>
        <p>Let's add some parameters to our query! Most APIs that can potentially return a large amount of data support "pagination". This means that you can ask for the results in chunks, rather than all at once. Add two query params by filling in the key and value fields with page=2 and per_page=10.</p>
        <img src='/tutorials/postman_params.png' style={{ width: "100%", padding: 20}}/>
        <p>You'll notice that the url has automatically filled in those parameters and if you search, you should get back a lot less results, starting from id 11. You will also see the status has come back as 200 OK, which is the expected response code for our GET request.</p>
        <p>Congratulations! You've completed your first manual test of an API! Let's talk a little more about some of the options we have when querying an API.</p>
        <h3>Method</h3>
        <p>In our example we used GET as our method, which unsurprisingly gets the resource at the URL. This is one of the most common types of request and websites will use this to get html, pictures or data to show you when you load their website.</p>
        <p>POST is also used a lot and generally tells the server to store, or do something with, the data we sent it.</p>
        <p>PUT is typically used to update something on the server, such as updating your username or settings.</p>
        <p>DELETE is used to tell the server that something should be deleted.</p>
        <p>There's actually a few other types of request but they're less common and you probably won't need to worry about them nearly as much while testing.</p>
        <h3>Authorization</h3>
        <p>Most APIs are restricted in some way. Typically this is done via authorization tokens, which the user provides in an authorization header. If you've used our test suite integrations you will have noticed we ask for a special code associated with your account so that your tests can talk to our API. This helps track who is accessing something and prevent bad actors from doing so. You may find it prudent to test that your server's API to make sure it correctly requires authorization where appropriate. This is known as security penetration testing or PenTesting for short.</p>
        <h3>Headers</h3>
        <p>Headers are essentially meta-data (Information about the request) and tell routers and servers what to expect from a request and if there's anything special they should do when handling it. The most common one that will be relevant in testing is the cross origin security header, which states which client and server addresses are allowed to read it, this is also known as CORS (Cross ORigin Security).</p>
        <h3>Body</h3>
        <p>The body of a request, also known as the payload, is where the data the client and server send each other is kept. This might be formatted as raw text, XML or JSON as seen in our example.</p>
    </>
}