import React from 'react';
import SubView from '../SubView';

export default function PrivacyPolicy()
{
    // return <div style={{ padding: 40, height: "100%" }}>
    return <SubView title="Privacy Policy">
            <embed src="/documents/PrivacyPolicy.pdf" width="100%" height="100%" type="application/pdf"/>
        </SubView>
    // </div>
}