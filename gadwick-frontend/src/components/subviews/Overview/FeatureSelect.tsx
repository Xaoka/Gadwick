import { useAuth0 } from '@auth0/auth0-react';
import { Tooltip } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import { IConfiguredApplication } from '../Applications/AppView';
import { IFeature } from '../Features/Features';
import { Stages } from './FeatureImport';
import { ThirdPartyProviders } from '../../../apis/thirdParty/providers';
import { appNameToURL } from '../../../utils/ToURL';
import { useRouteMatch, useHistory } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

/** TODO: Better name for this */
export interface IImport
{
    [board: string]: IImportedFeature[]
}

interface IImportedFeature
{
    name: string;
    board: string;
    boardID: string;
    ticketID: string;
    link: string;
}

interface IFeatureSelect
{
    provider: ThirdPartyProviders;
    importedFeatures: IImport;
    setStage: (stage: Stages) => void;
}

export default function FeatureSelect(props: IFeatureSelect)
{
    const { user } = useAuth0();
    const history = useHistory();

    const [importButtonDisabled, setImportButtonDisabled] = useState<boolean>(true);
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    // Features imported from third party apps
    const [featuresSelected, setFeaturesSelected] = useState<{ [featureName: string]: IImportedFeature & { selected: boolean }}>({});
    // Target app selection, to avoid import duplication
    const [apps, setApps] = useState<IConfiguredApplication[]>([]);
    const [appSelected, setAppSelected] = useState<IConfiguredApplication|null>(null);
    const [featuresForApp, setFeaturesForApp] = useState<IFeature[]>([]);
    

    function selectFeature(feature: IImportedFeature, selected: boolean)
    {
        const features = {...featuresSelected};
        features[feature.name] = { ...feature, selected };
        setFeaturesSelected(features);
    }

    async function createFeatures()
    {
        // TODO: Link the feature to the importing app
        console.log(`APP: ${appSelected?.id}`)
        let requests = [];
        for (const feature of Object.keys(featuresSelected))
        {
            if (featuresSelected[feature])
            {
                const payload =
                {
                    app_id: appSelected?.id,
                    name: feature,
                    description: "",
                    thirdparty_provider: props.provider,
                    thirdparty_board: featuresSelected[feature].boardID,
                    thirdparty_id: featuresSelected[feature].ticketID,
                    thirdparty_link: featuresSelected[feature].link
                }
                requests.push(serverAPI(API.Features, HTTP.CREATE, undefined, payload));
            }
        }
        console.log(`Importing`)
        // props.setStage(Stages.Importing); 
        setIsImporting(true);
        await Promise.all(requests);
        setIsImporting(false);
        setIsFinished(true);
        console.log(`Imported`)
        // props.setStage(Stages.Success);
    }

    useEffect(() => {
        getUserID(user.sub).then((id) =>
        {
            if (!id) { return; }
            serverAPI<IConfiguredApplication[]>(API.ApplicationsForUser, HTTP.READ, id).then((apps) =>
            {
                setApps(apps);
                setAppSelected(apps[0]);
            });
        });
    }, [])

    useEffect(() => {
        setImportButtonDisabled(Object.values(featuresSelected).filter((v) => v && v.selected === true).length === 0);
    }, [featuresSelected])

    useEffect(() => {
        if (!appSelected) { return; }
        serverAPI<IFeature[]>(API.Features, HTTP.READ, appSelected!.id).then(setFeaturesForApp);
    }, [appSelected])

    function selectAll(boardName: string, checked: boolean)
    {
        
    }
    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;


    if (isImporting)
    {
        return <div>
            Please wait while we import the selected features from your {props.provider} account.
        </div>
    }
    if (isFinished)
    {
        return <>
            <div>
                We have added {Object.keys(featuresSelected).filter((f) => featuresSelected[f].selected).length} features from your {props.provider} account.
            </div>
            <button onClick={() => history.push(`applications/${appNameToURL(appSelected?.name || "")}`)}>View App{chevron}</button>
            <button onClick={() => props.setStage(Stages.Provider)}>Import More{chevron}</button>
        </>
    }

    return <>
        <div>
            We found these features on your {props.provider} account, select which features you would like to import.
        </div>
        {Object.keys(props.importedFeatures).map((boardName: string) =>
        <>
            {/** TODO: Disable if all sub-features exist */}
            {/* <input type="checkbox"  onClick={(evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => selectAll(boardName, (evt.target as any).checked)} checked={false}/> */}
            <b>{boardName}</b>
            {props.importedFeatures[boardName].map((feature) =>
            {
                const exists = featuresForApp.filter((f) => f.name == feature.name).length > 0;
                const help = `This feature already exists on this app.`;
                if (exists)
                {
                    return <div style={{ padding: 5 }}>
                        <Tooltip title={help} aria-label={help} style={{verticalAlign: "bottom", display: "inline-block"}}>
                            <span>
                                <input type="checkbox" value={feature.name} name={feature.name} id={feature.name} onClick={(evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => selectFeature(feature, (evt.target as any).checked)} disabled={true} checked={false}/>
                                <label htmlFor={feature.name} style={{ textDecoration: "line-through"}}>{feature.name}</label>
                            </span>
                        </Tooltip>
                    </div>
                }
                else
                {
                    return <div style={{ padding: 5 }}>
                        <input type="checkbox" value={feature.name} name={feature.name} id={feature.name} onClick={(evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => selectFeature(feature, (evt.target as any).checked)}/>
                        <label htmlFor={feature.name}>{feature.name}</label>
                    </div>
                }
            })}
        </>)}
        <div>
            Import to application:
        </div>
        <div>
            <select name="app" onChange={(evt) => setAppSelected(apps[parseInt(evt.target.value)])}>
                {apps.map((app) => <option value={apps.indexOf(app)}>{app.name}</option>)}
            </select>
        </div>
        <button onClick={() => props.setStage(Stages.Provider)}>Back</button>
        <button onClick={createFeatures} disabled={importButtonDisabled}>Import</button>
    </>
}