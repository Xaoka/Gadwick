import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { Stages } from './FeatureImport';
import AppSelector from './AppSelector';
import { IConfiguredApplication } from '../Applications/AppView';
import { useHistory } from 'react-router-dom';
import { appNameToURL } from '../../../utils/ToURL';
import Chevron from '../../Chevron';

interface IBulkImport
{
    setStage: (stage: Stages) => void;
}

export default function BulkImport(props: IBulkImport)
{
    const history = useHistory();
    const [featureText, setFeatureText] = useState<string>("");
    const [importEnabled, setImportEnabled] = useState<boolean>(false);
    const [appSelected, setAppSelected] = useState<IConfiguredApplication|null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setImportEnabled(featureText.length > 0 && appSelected != null);
    }, [featureText, appSelected])

    async function importFeatures()
    {
        // props.setStage(Stages.Importing);
        setIsImporting(true);
        
        const features = featureText.split("\n").map((fName) => {
            return {
                name: fName,
                app_id: appSelected?.id
            }
        })
        await serverAPI(API.BulkFeatures, HTTP.CREATE, undefined, features);

        setIsImporting(false);
        setIsFinished(true);
        // props.setStage(Stages.Success);
    }

    if (isImporting) {

    }

    if (!isImporting && isFinished) {
        
        return <>
            <div>
                We have added {featureText.split("\n").length} features as a bulk import.
            </div>
            <button onClick={() => history.push(`applications/${appNameToURL(appSelected?.name || "")}`)}>View App<Chevron/></button>
            <button onClick={() => props.setStage(Stages.Provider)}>Import More<Chevron/></button>
        </>
    }

    // TODO: Prevent duplicated features?
    return <>
        <AppSelector onSelectionChanged={setAppSelected}/>
        <p>List of features to bulk import, with each feature on a new line:</p>
        <TextField multiline={true} rows={10} style={{width: "100%"}} variant="outlined" onChange={(event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => setFeatureText(event.target.value)} autoFocus={true}/>
        <div>
            <button className="success" style={{float: "right"}} disabled={!importEnabled} onClick={importFeatures}>Import</button>
        </div>
    </>
}