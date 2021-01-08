import { Dialog, DialogTitle, IconButton } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close'
import { IProduct } from './Subscription';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { useAuth0 } from '@auth0/auth0-react';
import getUserID from '../../../apis/user';
import SubscriptionData from './SubscriptionData.json';

interface IFreeTierDialog
{
    open: boolean;
    onClose: () => void;
}

// https://stripe.com/docs/billing/subscriptions/checkout

export default function PurchaseDialog(props: IFreeTierDialog)
{
    const { user } = useAuth0();
    async function onPurchase()
    {
        // Cancel subscriptions
        const user_id = await getUserID(user.sub);
        if (!user_id) { return; }
        serverAPI(API.CancelSubscription, HTTP.UPDATE, user_id);
        props.onClose();
    }

    return <Dialog open={props.open} maxWidth="xs" fullWidth={false} onClose={props.onClose} id="new_app_dialog">
        <DialogTitle style={{ padding: 40, paddingBottom: 0, paddingTop: 0 }}>
            <h3>
                Free
                <IconButton style={{float: "right"}} onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
            </h3>
        </DialogTitle>
        <div style={{ padding: 40, paddingTop: 0}}>
            <img src={`/tiers/free_tier.png`} width={180} height={180} style={{ marginLeft: "calc(50% - 90px)" }}/>
            <p>You will no longer be charged a subscription fee, but you'll still get:</p>
            <ul>
                {SubscriptionData.free.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div style={{ textAlign: "center" }}>
                <button style={{ margin: "auto"}} className="success" onClick={onPurchase}>
                    End Subscription
                </button>
            </div>
        </div>
    </Dialog>
}