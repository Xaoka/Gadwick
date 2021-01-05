import React from 'react';
import { IProduct, SubscriptionTier} from './Subscription';
import PackageCard, { IPackageCardData } from './PackageCard';
import SubscriptionData from './SubscriptionData.json';

interface ISubscriptionCards
{
    onCardSelected: (tier: SubscriptionTier) => void;
    // products: IProduct[];
    selectedTier: SubscriptionTier;
}

export default function SubscriptionsCards(props: ISubscriptionCards)
{
    // TODO: Push all this data into the backend
    return <div style={{ display: "flex", justifyContent: "space-around"}}>
        <PackageCard
            data={SubscriptionData.free as IPackageCardData}
            selected={props.selectedTier === SubscriptionTier.Free}
            onClick={() => props.onCardSelected(SubscriptionTier.Free)}/>
        <PackageCard
            data={SubscriptionData.standard as IPackageCardData}
            selected={props.selectedTier === SubscriptionTier.Standard}
            onClick={() => props.onCardSelected(SubscriptionTier.Standard)}/>
        <PackageCard
            data={SubscriptionData.premium as IPackageCardData}
            selected={props.selectedTier === SubscriptionTier.Premium}
            onClick={() => props.onCardSelected(SubscriptionTier.Premium)}/>
    </div>
}