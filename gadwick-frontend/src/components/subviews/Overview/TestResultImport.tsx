import { Dialog, DialogTitle } from '@material-ui/core';
import React from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

interface ITestResultImport
{
    open: boolean;
    onClose: () => void;
}

export default function TestResultImport(props: ITestResultImport)
{

    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;
    return <Dialog open={props.open} maxWidth="sm" fullWidth onClose={props.onClose}>
            <DialogTitle>Import Test Results</DialogTitle>
            <div style={{ padding: 25, paddingTop: 0 }}>
                <div>You can import test results from other popular QA software.</div>
                <button>TestRail</button>
            </div>
        </Dialog>
}