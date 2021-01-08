import serverAPI, { API, HTTP } from './api';
import getUserID from './user';
import { IProductPurchase, SubscriptionTier } from '../components/subviews/Subscription/Subscription';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export default function useSubscription()
{
    const [tier, setTier] = useState(SubscriptionTier.Free)
    const { user } = useAuth0();

    useEffect(() => { getTier(); }, []);

    async function getTier()
    {
        const user_id = await getUserID(user.sub);
        const subscriptions = await serverAPI<IProductPurchase[]>(API.UserSubscription, HTTP.READ, user_id!);
        // TODO: Do we need to check if it's expired?
        let userTier = SubscriptionTier.Free;
        for (const sub of subscriptions)
        {
            if (sub.product_name === "Premium")
            {
                userTier = SubscriptionTier.Premium;
            }
            else if (sub.product_name === "Standard" && tier !== SubscriptionTier.Premium)
            {
                userTier = SubscriptionTier.Standard;
            }
        }
        setTier(userTier);
    }
    return tier;
}