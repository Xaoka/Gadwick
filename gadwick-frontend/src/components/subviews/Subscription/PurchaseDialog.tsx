import { Dialog, DialogTitle, IconButton } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close'
import { IProduct } from './Subscription';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { useAuth0 } from '@auth0/auth0-react';
import getUserID from '../../../apis/user';
import deploymentConfig from '../../../config.json';

interface IPurchaseDialog
{
    open: boolean;
    onClose: () => void;
    product: IProduct;
}

// https://stripe.com/docs/billing/subscriptions/checkout


export default function PurchaseDialog(props: IPurchaseDialog)
{
    const { user } = useAuth0();
    async function onPurchase()
    {
        const user_id = await getUserID(user.sub);
        const { sessionId } = await serverAPI(API.CheckoutSession, HTTP.CREATE, undefined, { product_name: props.product.product_name, user_id })
        const stripe = (window as any).Stripe(deploymentConfig.STRIPE_KEY)
        const response = await stripe.redirectToCheckout({sessionId: sessionId});
    }

    return <Dialog open={props.open} maxWidth="xs" fullWidth={false} onClose={props.onClose} id="new_app_dialog">
        <DialogTitle style={{ padding: 40, paddingBottom: 0, paddingTop: 0 }}>
            <h3>
            {props.product.product_name}
                <IconButton style={{float: "right"}} onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
            </h3>
        </DialogTitle>
        <div style={{ padding: 40, paddingTop: 0}}>
            <img src={`/tiers/${props.product.img}.png`} width={180} height={180} style={{ marginLeft: "calc(50% - 90px)" }}/>
            <p>You'll retain any benefits that you've already paid for until they expire and in addition you'll get the following:</p>
            <ul>
                {props.product.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div style={{ textAlign: "center" }}>
                <button style={{ margin: "auto"}} className="success" onClick={onPurchase}>
                    Buy for £{(props.product.price_in_pence/100).toFixed(2)}
                </button>
            </div>
        </div>
    </Dialog>
}