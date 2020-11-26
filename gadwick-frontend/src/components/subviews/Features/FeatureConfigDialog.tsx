import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import FeatureConfig from './FeatureConfig';
import { IFeature } from './Features';
import { Skeleton } from '@material-ui/lab';
import { DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'

interface IFeatureConfigDialog
{
    feature: IFeature|null;
    onClose: () => void;
}

export default function FeatureConfigDialog(props: IFeatureConfigDialog)
{
    return <Dialog open={props.feature !== null} maxWidth="md" onClose={props.onClose} id="feature_config_dialog">
            <DialogTitle style={{ padding: 40, paddingBottom: 0 }}>
                <span className="heading">Feature Configuration</span>
                <IconButton style={{float: "right"}} onClick={props.onClose}><CloseIcon/></IconButton>
            </DialogTitle>
            {props.feature ? <FeatureConfig feature={props.feature} style={{ padding: 40 }}/> : <Skeleton></Skeleton>}
        </Dialog>
}