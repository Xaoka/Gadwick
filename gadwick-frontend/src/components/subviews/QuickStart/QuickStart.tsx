import { CircularProgress } from '@material-ui/core';
import React from 'react';
import InfoCard, { MediaType } from '../../InfoCard';
import { SubscriptionTier } from '../Subscription/Subscription';
import SubView from '../SubView';

export default function QuickStart()
{
    return <>
        <h2>Applications</h2>
        <InfoCard title="app" summary="apppppp" image={MediaType.Application}/>
    </>
}