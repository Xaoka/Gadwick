import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap, TextField } from '@material-ui/core';

export enum VerificationState { Verified, Failed, Pending }

interface IVerifiedInput
{
    label: string;
    verification: (text: string) => VerificationState;
    // onVerificationStateChanged?: (state: VerificationState) => void;
    onTextChanged?: (text: string) => void;
}

export default function VerifiedInput(props: IVerifiedInput)
{
    const [text, setText] = useState<string>("");
    const [VerificationIcon, setVerificationIcon] = useState<OverridableComponent<SvgIconTypeMap>>(RadioButtonUncheckedIcon);

    useEffect(() => {
        const state = props.verification(text);
        switch (state)
        {
            case VerificationState.Pending:
                setVerificationIcon(RadioButtonUncheckedIcon);
                break;
            case VerificationState.Failed:
                setVerificationIcon(HighlightOffIcon);
                break;
            case VerificationState.Verified:
                setVerificationIcon(CheckCircleIcon);
                break;
        }
        // if (props.onVerificationStateChanged)
        // {
        //     props.onVerificationStateChanged(state);
        // }
        if (props.onTextChanged)
        {
            props.onTextChanged(text);
        }
    }, [text])
    
    return <>
        <TextField label={props.label} style={{ marginLeft: 10 }} onChange={(evt) => setText(evt.target.value)}/>
        <VerificationIcon fontSize="small" style={{ marginRight: 10, verticalAlign: "bottom", paddingBottom: 5 }}/>
    </>
}