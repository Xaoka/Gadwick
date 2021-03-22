import React, { useEffect } from 'react';
import SubView from '../SubView';
import Notification from './Notification';

export default function Mail()
{
    useEffect(() => {
        // TODO: Move this server side
        window.document.cookie = "mail=true"
    }, [])
    return <SubView title="Mail">
        Your notifications about events related to your Gadwick account will be shown here.
        <Notification title="1.0.2 Update" date="18/02/2021">
            {/** Accessing a page while not logged in will redirect back there after login */}
            <p>
                You can now revoke the client secret for an app and a new one will automatically be generated.
            </p>
            <p>
                Feature problem frequency is no longer set by the user and is instead determined by the test results.
            </p>
        </Notification>
        <Notification title="1.0.1 Update" date="05/02/2021">
            <p>
                We've launched several new FREE tutorials for you to try out! Upgrade your toolkit with our tutorials on Cypress and Postman, learn the basics of API testing and learn how to take advantage of continuous integration techniques!
            </p>
            <p>
                We're also adding some quality of life updates to the dashboard with this update. Most forms you interact with now have snackbar notifications on save, to help make it obvious when you can move on. New users will be prompted to create their first application and given some guidance on how to get into the flow of things. You can also now import features from directly inside the app view to streamline the process instead of needing to go back to your overview and we've swapped the features and analytics tab around in the app view.
            </p>
            <p>
                We're working on bringing Python support to Gadwick so keep your eyes on this space for that in the coming updates. This will include code generation, uploading features from test case files and test result tracking.
            </p>
        </Notification>
    </SubView>
}