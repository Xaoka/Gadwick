import React from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { IconButton } from '@material-ui/core';
import copyToClipboard from '../utils/Clipboard';

interface ICopyButton
{
    textToCopy: string;
}

export default function CopyButton(props: ICopyButton)
{
    return <IconButton onClick={() => copyToClipboard(props.textToCopy)}>
        <FileCopyIcon/>
    </IconButton>
}