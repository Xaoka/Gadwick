import { useAuth0 } from '@auth0/auth0-react';
import { Tooltip } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import { IConfiguredApplication } from '../Applications/AppView';
import { IFeature } from '../Features/Features';
import { Providers, Stages } from './FeatureImport';

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
    provider: Providers;
    importedFeatures: IImport;
    setStage: (stage: Stages) => void;
}

export default function FeatureSelect(props: IFeatureSelect)
{
    const { user } = useAuth0();

    const [importButtonDisabled, setImportButtonDisabled] = useState<boolean>(true);
    // Features imported from third party apps
    const [featuresSelected, setFeaturesSelected] = useState<{ [featureName: string]: IImportedFeature & { selected: boolean }}>({});
    // Target app selection, to avoid import duplication
    const [apps, setApps] = useState<IConfiguredApplication[]>([]);
    const [appSelected, setAppSelected] = useState<string>("");
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
        console.log(`APP: ${appSelected}`)
        let requests = [];
        for (const feature of Object.keys(featuresSelected))
        {
            if (featuresSelected[feature])
            {
                const payload =
                {
                    app_id: appSelected,
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
        props.setStage(Stages.Importing);
        await Promise.all(requests);
        props.setStage(Stages.Success);
    }

    useEffect(() => {
        getUserID(user.sub).then((id) =>
        {
            serverAPI<IConfiguredApplication[]>(API.Applications, HTTP.READ, id).then((apps) =>
            {
                setApps(apps);
                setAppSelected(apps[0].id);
            });
        });
    }, [])

    useEffect(() => {
        setImportButtonDisabled(Object.values(featuresSelected).filter((v) => v && v.selected === true).length === 0);
    }, [featuresSelected])

    useEffect(() => {
        serverAPI<IFeature[]>(API.Features, HTTP.READ, appSelected).then(setFeaturesForApp);
    }, [appSelected])

    function selectAll(boardName: string, checked: boolean)
    {
        
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
            <select name="app" onChange={(evt) => setAppSelected(evt.target.value)}>
                {apps.map((app) => <option value={app.id}>{app.name}</option>)}
            </select>
        </div>
        <button onClick={() => props.setStage(Stages.Provider)}>Back</button>
        <button onClick={createFeatures} disabled={importButtonDisabled}>Import</button>
    </>
}