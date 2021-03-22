import React, { useState } from 'react';
import Link from '../../../Link';
import TutorialBox from '../Components/TutorialBox';
import Axios from 'axios'
import { Input, TextField } from '@material-ui/core';

export default function MITM()
{
    const [response, setResponse] = useState<string>("");
    const punkAPIURL = "https://api.punkapi.com/v2/beers";
    async function sendPunkAPIRequest()
    {
        const data = await Axios.get(punkAPIURL);
        setResponse(JSON.stringify(data.data, null, 2));
    }

    return <>
        <TutorialBox topics={["Client-Server behaviour", "What a MITM attack is", "How to test for MITM vulnerabilities"]}/>
        <p>Generally most software we work with is composed of two or three main parts; the client (The user interface and parts the user interacts with directly), the server (That handles requests to get or update data) and the database (Where all the data is stored long term). The client will typically check the information you put in, before letting you send it along to the server, this might be checking your file size or that your username matches some requirements.</p>
        {/* <img src="/tutorials/client_server.jpg" style={{ width: "30%", marginLeft: "35%", marginRight: "35%" }}/> */}
        <p>
            However, some products make the mistake of fully trusting the data the client sends along, assuming it's been checked thoroughly and not changed on the way. This exposes our product to all sorts of sneaky manipulations that can range from accessing data that shouldn't be allowed to inserting data that breaks our rules or even taking down our service! These sorts of manipulations are known as Man In The Middle or MITM attacks, as they are performed by someone or something sitting in the middle between our client and our server to perform their attack.
        </p>
        <h2>Charles Proxy</h2>
        <p>
            Let's try out some examples, we can download a program called <Link label="CharlesProxy" src="https://www.charlesproxy.com/"/> which will allow us to intercept network traffic on our machine.
        </p>
        <p>
            Once we open up charles, we should get a screen that looks somewhat like the one below - you might even spot network traffic you recognize such as youtube or twitter if you have those open! We're going to make a request to a public API called PunkAPI, which we've used before in our Postman tutorial, then intercept it and manipulate it.
        </p>
        <img src="/tutorials/charles-windows.png" style={{ width: "30%", marginLeft: "35%", marginRight: "35%" }}/>
        <p>
            When you're ready, click the Send Request button to send a request to the API, you should see a request pop up near the bottom of the list in charles like in the image below and the Response field in the window below should display a list of beers that you got back from the API. We can now select 
        </p>
        <img src="/tutorials/punk_api_charles.png" style={{ width: "30%", marginLeft: "35%", marginRight: "35%" }}/>
        <div style={{ display: "grid", gridTemplateColumns: "30% 70%", margin: 20 }}>
            <div style={{ padding: 20, paddingTop: 0, boxShadow: "0px 0px 5px grey" }}>
                <h3>Request</h3>
                URL: <Input disabled={true} value={punkAPIURL} style={{ width: "100%" }} />
                <button onClick={sendPunkAPIRequest} style={{ display: "block" }}>Send Request</button>
            </div>
            <div style={{ padding: 20, paddingTop: 0, boxShadow: "0px 0px 5px grey" }}>
                <h3>Response</h3>
                <TextField value={response} style={{ width: "100%", height: 200, overflowY: "scroll" }} multiline={true}/>
            </div>
        </div>
    </>
}