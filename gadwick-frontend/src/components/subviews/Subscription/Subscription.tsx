import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import SubView from '../SubView';
import PackageCard from './PackageCard';
import PurchaseDialog from './PurchaseDialog';

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

enum SubscriptionTier { Free, Standard, Premium };

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
        <div style={{ display: "flex", justifyContent: "space-around"}}>
            <PackageCard
                title="Free"
                img="tier_1"
                price="£0"
                summary="Try Gadwick for free, perfect for trying it out."
                features={["Access to all of Gadwick's features", "Up to two applications", "Up to one additional collaborator per application"]}
                backgroundColours={{ bottomColor: "#eee6ff", midColour: "#f4f0fb" }}
                selected={false}
                onClick={() => setDialogTier(SubscriptionTier.Free)}/>
            <PackageCard
                title="Standard"
                img="free_tier"
                price="£10"
                summary="The standard Gadwick package for professionals and small teams."
                features={["Access to all of Gadwick's features", "Up to ten applications", "Up to five additional collaborator per application"]}
                backgroundColours={{ bottomColor: "rgba(217,255,215,1)", midColour: "rgba(240,251,240,1)" }}
                selected={true}
                onClick={() => setDialogTier(SubscriptionTier.Standard)}/>
            <PackageCard
                title="Premium"
                img="tier_2"
                price="£50"
                summary="Ideal for companies with a range of products or a full QA team."
                features={["Access to all of Gadwick's features", "Unlimited applications", "Unlimited collaborators per application"]}
                backgroundColours={{ bottomColor: "#fff1d7", midColour: "#fbf8f0"}}
                selected={false}
                onClick={() => setDialogTier(SubscriptionTier.Premium)}/>
        </div>
        <PurchaseDialog open={dialogTier!==null} onClose={() => setDialogTier(null)} product={getProduct()}/>
    </SubView>
}