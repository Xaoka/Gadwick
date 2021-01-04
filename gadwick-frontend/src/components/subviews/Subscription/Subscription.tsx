import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import SubView from '../SubView';
import PurchaseDialog from './PurchaseDialog';
import SubscriptionsCards from './SubscriptionsCards';

export interface IProduct
{
    price_in_pence: number;
    product_name: string;
    id: string;
    stripe_id: string;
    type: "SUBSCRIPTION";
    img: string;
    features: string[];
}

// export enum SubscriptionTier { Free, Standard, Premium };

export default function Subscription()
{
    const [selectedProduct, setSelectedProduct] = useState<IProduct|null>(null)
    const [products, setProducts] = useState<IProduct[]|null>(null);
    useEffect(() =>
    {
        serverAPI<IProduct[]>(API.Subscriptions, HTTP.READ).then((products) =>
        {
            setProducts(products.map((p) => { return { ...p, features: JSON.parse(p.features as any)} }))
        });
    }, []);

    // function getProduct(): IRenderedProduct
    // {
    //     switch (dialogTier)
    //     {
    //         case null:
    //             return { product_name: "", price_in_pence: 0, id: "", img: "", features: [], stripe_id: "", type: "SUBSCRIPTION" }
    //         case SubscriptionTier.Free:
    //             return { product_name: "Free Tier", price_in_pence: 0, id: "", img: "tier_1", features: ["Access to all of Gadwick's features", "Up to two applications", "Up to one additional collaborator per application"], stripe_id: "", type: "SUBSCRIPTION" }
    //         case SubscriptionTier.Standard:
    //             return { product_name: "Standard Tier", price_in_pence: 1000, id: "", img: "free_tier", features: ["Access to all of Gadwick's features", "Up to ten applications", "Up to five additional collaborator per application"], stripe_id: "", type: "SUBSCRIPTION" }
    //         case SubscriptionTier.Premium:
    //             return { product_name: "Premium Tier", price_in_pence: 5000, id: "", img: "tier_2", features: ["Access to all of Gadwick's features", "Unlimited applications", "Unlimited collaborators per application"], stripe_id: "", type: "SUBSCRIPTION" }
    //     }
    // }
    const dummyProduct: IProduct = { product_name: "", price_in_pence: 0, id: "", img: "", features: [], stripe_id: "", type: "SUBSCRIPTION" };
    return <SubView title="Subscription">
        <SubscriptionsCards onCardSelected={setSelectedProduct} products={products||[]}/>
        <PurchaseDialog open={selectedProduct!==null} onClose={() => setSelectedProduct(null)} product={selectedProduct||dummyProduct}/>
    </SubView>
}