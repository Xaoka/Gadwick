import React from 'react';
import SubView from '../SubView';
import Notification from './Notification';

export default function Mail()
{
    return <SubView title="Mail">
        Your notifications about events related to your Gadwick account will be shown here.
        <Notification title="Update" body="We're adding some quality of life updates to the dashboard with this update. Most forms now have snackbar notifications on save, to help make it obvious when you can move on. New users will be prompted to create their first application. You can now import features from inside the app view and we've swapped the features and analytics tab around in the app view." date="05/02/2021"/>
    </SubView>
}