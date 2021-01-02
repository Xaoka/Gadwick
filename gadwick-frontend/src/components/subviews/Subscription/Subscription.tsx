import React, { useEffect, useState } from 'react';
// import serverAPI, { API, HTTP } from '../../../apis/api';
import SubView from '../SubView';
import PurchaseDialog from './PurchaseDialog';
import SubscriptionsCards from './SubscriptionsCards';

export interface IProduct
{
    price_in_pence: number;
    product_name: string;
    id: string;
}

// TODO: Should this just be what the DB stores?
export interface IRenderedProduct extends IProduct
{
    img: string;
    features: string[];
}

export enum SubscriptionTier { Free, Standard, Premium };

export default function Subscription()
{
    const [dialogTier, setDialogTier] = useState<SubscriptionTier|null>(null)

    useEffect(() => {
        // serverAPI<IProduct[]>(API.Subscriptions, HTTP.READ).then(setSubscriptionTiers)
    }, [])

    function getProduct(): IRenderedProduct
    {
        switch (dialogTier)
        {
            case null:
                return { product_name: "", price_in_pence: 0, id: "", img: "", features: [] }
            case SubscriptionTier.Free:
                return { product_name: "Free Tier", price_in_pence: 0, id: "", img: "tier_1", features: ["Access to all of Gadwick's features", "Up to two applications", "Up to one additional collaborator per application"] }
            case SubscriptionTier.Standard:
                return { product_name: "Standard Tier", price_in_pence: 1000, id: "", img: "free_tier", features: ["Access to all of Gadwick's features", "Up to ten applications", "Up to five additional collaborator per application"] }
            case SubscriptionTier.Premium:
                return { product_name: "Premium Tier", price_in_pence: 5000, id: "", img: "tier_2", features: ["Access to all of Gadwick's features", "Unlimited applications", "Unlimited collaborators per application"] }
        }
    }

    return <SubView title="Subscription">
        <SubscriptionsCards onCardSelected={setDialogTier} />
        <PurchaseDialog open={dialogTier!==null} onClose={() => setDialogTier(null)} product={getProduct()}/>
    </SubView>
}