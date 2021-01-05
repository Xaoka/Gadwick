import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import SubView from '../SubView';
import PurchaseDialog from './PurchaseDialog';
import SubscriptionsCards from './SubscriptionsCards';
import SubscriptionData from './SubscriptionData.json';
import getUserID from '../../../apis/user';
import { useAuth0 } from '@auth0/auth0-react';

export interface IProduct
{
    price_in_pence: number;
    product_name: string;
    id: string;
    stripe_id: string;
    type: string; // SUBSCRIPTION
    img: string;
    features: string[];
}

export enum SubscriptionTier { Free = "free", Standard = "standard", Premium = "premium" };

export default function Subscription()
{
    const { user } = useAuth0();
    const [selectedProduct, setSelectedProduct] = useState<SubscriptionTier|null>(null)
    const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SubscriptionTier.Free)
    // const [products, setProducts] = useState<IProduct[]|null>(null);
    useEffect(() =>
    {
        // serverAPI<IProduct[]>(API.Subscriptions, HTTP.READ).then((products) =>
        // {
        //     setProducts(products.map((p) => { return { ...p, features: JSON.parse(p.features as any)} }))
        // });
        getUserID(user.sub).then((user_id) =>
        {
            serverAPI<IProduct[]>(API.UserSubscription, HTTP.READ, user_id!).then(console.dir);
        })
    }, []);

    const dummyProduct: IProduct = { product_name: "", price_in_pence: 0, id: "", img: "", features: [], stripe_id: "", type: "SUBSCRIPTION" };
    // TODO: Dialog for free
    
    function onCardSelected(tier: SubscriptionTier)
    {
        // Prevent them from trying to buy their current subscription
        if (tier !== currentTier)
        {
            setSelectedProduct(tier);
        }
    }

    return <SubView title="Subscription">
        <SubscriptionsCards onCardSelected={onCardSelected} selectedTier={currentTier}/>
        <PurchaseDialog open={selectedProduct!==null && selectedProduct!==SubscriptionTier.Free} onClose={() => setSelectedProduct(null)} product={selectedProduct ? SubscriptionData[selectedProduct] : dummyProduct}/>
    </SubView>
}