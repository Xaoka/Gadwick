import React, { CSSProperties, useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FeatureImport from './FeatureImport';
import TestResultImport from './TestResultImport';

const optionCSS: CSSProperties =
{
    width: 100,
    height: 100,
    borderRadius: 15,
    borderColor: "transparent",
    color: "white",
    backgroundColor: "var(--theme-primary)",
    textAlign: "center",
    alignContent: "center",
    display: "inline-block"
}

export default function QuickSetup()
{
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [featureDialogOpen, setFeatureDialogOpen] = useState(false)

    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;


    return <>
        <h2>Quick Setup</h2>
        <button onClick={() => setImportDialogOpen(true)}>
            Import Features
            {chevron}
        </button>
        <button onClick={() => setFeatureDialogOpen(true)}>
            Import Test Results
            {chevron}
        </button>
        <FeatureImport open={importDialogOpen} onClose={() => setImportDialogOpen(false)}/>
        <TestResultImport open={featureDialogOpen} onClose={() => setFeatureDialogOpen(false)}/>
    </>
}