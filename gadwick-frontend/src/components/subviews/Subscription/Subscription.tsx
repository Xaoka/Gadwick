import React, { useEffect, useState } from 'react';
import SubView from '../SubView';
import PurchaseDialog from './PurchaseDialog';
import SubscriptionsCards from './SubscriptionsCards';
import SubscriptionData from './SubscriptionData.json';
import useSubscription from '../../../apis/subscription';
import FreeTierDialog from './FreeTierDialog';

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

export interface IPurchase
{
    id: string;
    product_id: string;
    sold_at_price: number;
    user_id: string;
    intent_id: string;
    status: string;
}

export interface IProductPurchase extends IPurchase
{
    product_name: string;
}

export enum SubscriptionTier { Free = "free", Standard = "standard", Premium = "premium" };

export default function Subscription()
{
    const [selectedProduct, setSelectedProduct] = useState<SubscriptionTier|null>(null)
    const currentTier = useSubscription();
    // const [products, setProducts] = useState<IProduct[]|null>(null);

    const dummyProduct: IProduct = { product_name: "", price_in_pence: 0, id: "", img: "", features: [], stripe_id: "", type: "SUBSCRIPTION" };
    
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
        <FreeTierDialog open={selectedProduct===SubscriptionTier.Free} onClose={() => setSelectedProduct(null)}/>
        <PurchaseDialog open={selectedProduct!==null && selectedProduct!==SubscriptionTier.Free} onClose={() => setSelectedProduct(null)} product={selectedProduct ? SubscriptionData[selectedProduct] : dummyProduct}/>
    </SubView>
}