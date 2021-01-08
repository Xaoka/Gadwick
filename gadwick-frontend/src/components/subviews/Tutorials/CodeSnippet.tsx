import { IconButton, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';

interface ICodeSnippet
{
    code: { [language: string]: string[] };
    language: string;
    onLanguageChanged: (lang: string) => void;
    title?: string;
}

export default function CodeSnippet(props: ICodeSnippet)
{
    // TODO: Allow a tab-indent config option?
    return <div style={{margin: 30}}>
        <div style={{ backgroundColor: "#363636", display: "grid", gridTemplateColumns: "50% 50%" }}>
            <div style={{ color: "lightgrey", textAlign: "left", padding: 12 }}>{props.title}</div>
            <div style={{ textAlign: "right" }}>
                <select name="language" id="language" value={props.language} onChange={(evt) => props.onLanguageChanged(evt.target.value)}>
                    {Object.keys(props.code).map((lang) => <option value={lang} key={lang}>{lang}</option>)}
                </select>
                <Tooltip title="Copy code to clipboard">
                    <IconButton style={{ color: "lightgrey" }}>
                        <FileCopyIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        </div>
        <code>
            {props.code[props.language] && props.code[props.language].map((c) => <pre>{c}</pre>)}
        </code>
    </div>
}