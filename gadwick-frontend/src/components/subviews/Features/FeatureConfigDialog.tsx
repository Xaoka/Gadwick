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
    return <Dialog open={props.feature !== null} maxWidth="md" onClose={props.onClose} id="feature_config_dialog" style={{overflow: "hidden"}}>
            <DialogTitle>
                <h3>Feature Configuration<IconButton style={{float: "right"}} onClick={props.onClose}><CloseIcon/></IconButton></h3>
            </DialogTitle>
            {props.feature ? <FeatureConfig feature={props.feature} style={{ padding: 40, paddingTop: 0, overflow: "scroll" }} onDeleted={props.onClose}/> : <Skeleton></Skeleton>}
        </Dialog>
}