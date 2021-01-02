import React from 'react';
import { SubscriptionTier} from './Subscription';
import PackageCard from './PackageCard';

interface ISubscriptionCards
{
    onCardSelected: (choice: SubscriptionTier) => void;
}

export default function SubscriptionsCards(props: ISubscriptionCards)
{
    return <div style={{ display: "flex", justifyContent: "space-around"}}>
        <PackageCard
            title="Free"
            img="tier_1"
            price="£0"
            summary="Try Gadwick for free, perfect for trying it out."
            features={["Access to all of Gadwick's features", "Up to two applications", "Up to one additional collaborator per application"]}
            backgroundColours={{ bottomColor: "#eee6ff", midColour: "#f4f0fb" }}
            selected={false}
            onClick={() => props.onCardSelected(SubscriptionTier.Free)}/>
        <PackageCard
            title="Standard"
            img="free_tier"
            price="£10"
            summary="The standard Gadwick package for professionals and small teams."
            features={["Access to all of Gadwick's features", "Up to ten applications", "Up to five additional collaborator per application"]}
            backgroundColours={{ bottomColor: "rgba(217,255,215,1)", midColour: "rgba(240,251,240,1)" }}
            selected={true}
            onClick={() => props.onCardSelected(SubscriptionTier.Standard)}/>
        <PackageCard
            title="Premium"
            img="tier_2"
            price="£50"
            summary="Ideal for companies with a range of products or a full QA team."
            features={["Access to all of Gadwick's features", "Unlimited applications", "Unlimited collaborators per application"]}
            backgroundColours={{ bottomColor: "#fff1d7", midColour: "#fbf8f0"}}
            selected={false}
            onClick={() => props.onCardSelected(SubscriptionTier.Premium)}/>
    </div>
}