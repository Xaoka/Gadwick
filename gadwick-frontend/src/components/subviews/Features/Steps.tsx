import React, { useEffect, useState } from 'react';
import { IconButton, Input, InputLabel } from '@material-ui/core';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import CloseIcon from '@material-ui/icons/Close';

interface ISteps
{
    steps: string[];
    onChanged: (steps: string[]) => void;
}

export default function Steps(props: ISteps)
{
    const [savedSteps, setSavedSteps] = useState<string[]>(props.steps);
    const [steps, setSteps] = useState<string[]>(props.steps);
    const [saveDisabled, setSaveDisabled] = useState<boolean>(true);

    function onKeyDown(evt: React.KeyboardEvent<HTMLTextAreaElement|HTMLInputElement>)
    {
        if (evt.key === "Enter")
        {
            setSteps([...steps, ""]);
        }
        // if (evt.key === "Backspace" && (evt.target as any).value.length === 0 && steps.length > 1)
        // {
        //     const newSteps = [...steps];
        //     newSteps.splice(newSteps.length -1, 1)
        //     setSteps(newSteps);
        // }
    }

    function adornment(lastStep: boolean, fieldIndex: number)
    {
        if(lastStep)
        {
            return <KeyboardReturnIcon style={{ color: "grey", fontSize: "small", paddingRight: 10 }}/>
        }
        else
        {
            return <IconButton onClick={() => { const newSteps = [...steps]; newSteps.splice(fieldIndex, 1); setSteps(newSteps); }}>
                <CloseIcon style={{ color: "grey", fontSize: "0.5em" }}/>
            </IconButton>
        }
    }

    function step(text: string|undefined, index: number)
    {
        const lastStep = index === steps.length -1;
        return <div>
            <span style={{ paddingRight: 20 }}>
                {index + 1}.
            </span>
            {/* <InputLabel htmlFor="step-0">Step 0</InputLabel> */}
            <Input id={`step-${index}`} defaultValue={text} style={{ width: "60%", paddingBottom: 10, paddingTop: 10 }}
                endAdornment={adornment(lastStep, index)} onKeyDown={onKeyDown} autoFocus={lastStep}
                onChange={(v) => { const newSteps = [...steps]; newSteps[index] = v.target.value; setSteps(newSteps); }}/>
        </div>
    }

    useEffect(() => {
        setSaveDisabled(JSON.stringify(steps.filter((s) => s.length > 0)) === JSON.stringify(savedSteps))
    }, [steps, savedSteps])

    function onSaved()
    {
        const newSteps = steps.filter((s) => s.length > 0);
        setSavedSteps(newSteps);
        props.onChanged(newSteps);
    }

    return <>
        {steps.map(step)}
        <div style={{ marginRight: "10%" }}>
            <button disabled={saveDisabled} style={{ float: "right"}} onClick={onSaved}>
                Save
            </button>
        </div>
    </>;
}