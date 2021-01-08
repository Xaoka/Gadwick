import React from 'react';
import { Avatar, Tooltip } from '@material-ui/core';
import { SubscriptionTier } from './subviews/Subscription/Subscription';

interface ITierIcon
{
    tier: SubscriptionTier;
}

export default function TierIcon(props: ITierIcon)
{
    let src = "/tiers/free_tier.png";
    if (props.tier === SubscriptionTier.Standard) { src = "/tiers/tier_1.png"; }
    if (props.tier === SubscriptionTier.Premium) { src = "/tiers/tier_2.png"; }

    return <Tooltip title={`Available with a ${props.tier} subscription.`}>
        <Avatar alt={`${props.tier} Subscription Icon`} src={src} style={{ position: "absolute", top: 10, right: 10, height: 35, width: 35 }}/>
    </Tooltip>
}