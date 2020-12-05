import React, { CSSProperties, useEffect, useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Dialog, DialogTitle, Fade, Tooltip } from '@material-ui/core';
import Axios from 'axios';
import { CheckBox } from '@material-ui/icons';
import { IConfiguredApplication } from '../Applications/AppView';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import { useAuth0 } from '@auth0/auth0-react';
import { IFeature } from '../Features/Features';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

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

enum Stages { Provider, Connect, Import, Importing, Success }

export default function QuickSetup()
{
    const { user } = useAuth0();
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [stage, setStage] = useState<Stages>(Stages.Provider)
    const [provider, setProvider] = useState<string>("");
    const [importing, setImporting] = useState<boolean>(false);
    const [importButtonDisabled, setImportButtonDisabled] = useState<boolean>(true);
    const [importedFeatures, setImportedFeatures] = useState<string[]>([]);
    const [featuresSelected, setFeaturesSelected] = useState<{ [featureName: string]: boolean}>({});
    const [apps, setApps] = useState<IConfiguredApplication[]>([]);
    const [appSelected, setAppSelected] = useState<string>("");
    const [featuresForApp, setFeaturesForApp] = useState<IFeature[]>([]);

    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;

    function onSelectProvider(prov: string)
    {
        setProvider(prov);
        setStage(Stages.Connect);
    }

    function onClose()
    {
        setStage(Stages.Provider);
        setImportDialogOpen(false);
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
        if (stage == Stages.Import)
        {
            importFeatures();
        }
    }, [stage])

    useEffect(() => {
        setImportButtonDisabled(Object.values(featuresSelected).filter((v) => v === true).length === 0);
    }, [featuresSelected])

    useEffect(() => {
        serverAPI<IFeature[]>(API.Features, HTTP.READ, appSelected).then(setFeaturesForApp);
    }, [appSelected])

    function selectFeature(featureName: string, checked: boolean)
    {
        const features = {...featuresSelected};
        features[featureName] = checked;
        setFeaturesSelected(features);
    }

    async function importFeatures()
    {   
        setImporting(true);
        let features: string[] = [];
        // Do an API call to fetch
        if (provider == "Trello")
        {
            // TODO: Once deployed, add webhooks: https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/
            const key = `482a04295a7abedf6df55c7538921b0f`
            const token = `ce5094cddd4bfd789d18616d7a18977e33f1e7fe59c59525857270347fb6c5f0`;
            const boards = (await Axios.get(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`)).data;
            for (const board of boards)
            {
                const cards = (await Axios.get(`https://api.trello.com/1/boards/${board.id}/cards?key=${key}&token=${token}`)).data;
                // console.log(cards.map((card: any) => card.name));
                for (const card of cards)
                {
                    features.push(card.name);
                }
            }
        }
        // TODO: Avoid creating duplicated features
        setImportedFeatures(features);
        setImporting(false);
    }

    async function createFeatures()
    {
        console.log(`APP: ${appSelected}`)
        let requests = [];
        for (const feature of Object.keys(featuresSelected))
        {
            if (featuresSelected[feature])
            {
                requests.push(serverAPI(API.Features, HTTP.CREATE, undefined, { app_id: appSelected, name: feature, description: "" }));
            }
        }
        setStage(Stages.Importing);
        await Promise.all(requests);
        setStage(Stages.Success);
    }

    return <>
        <h2>Quick Setup</h2>
        <button onClick={() => setImportDialogOpen(true)}>
            Import Features
            {chevron}
        </button>
        <button>
            Import Test Results
            {chevron}
        </button>
        <Dialog open={importDialogOpen} maxWidth="sm" fullWidth onClose={onClose}>
            <DialogTitle>Import Features</DialogTitle>
            <div style={{ padding: 25, paddingTop: 0 }}>
                {stage == Stages.Provider ?
                    <>
                        <div>
                            Where would you like to import features from?
                        </div>
                        <button onClick={() => onSelectProvider("Trello")}>Trello{chevron}</button>
                        <button onClick={() => onSelectProvider("JIRA")} disabled={true}>JIRA{chevron}</button>
                        <button onClick={() => onSelectProvider("Asana")} disabled={true}>Asana{chevron}</button>
                    </>
                : null }
                {stage == Stages.Connect ?
                    <>
                        <div>
                            Your {provider} account has not been connected yet, click below to connect it so we can import your features.
                        </div>
                        <button onClick={() => setStage(Stages.Provider)}>Back</button>
                        <button onClick={() => setStage(Stages.Import)}>Connect</button>
                    </>
                : null }
                { importing ? <>
                    <div>
                        Importing features from your {provider} account, please wait.
                    </div>
                </> : null}
                {stage == Stages.Import && !importing ?
                    <>
                        {/** TODO: Should we make them select boards first? */}
                        <>
                            <div>
                                We found these features on your {provider} account, select which features you would like to import.
                            </div>
                            {importedFeatures.map((feature) =>
                            {
                                const exists = featuresForApp.filter((f) => f.name == feature).length > 0;
                                const help = `This feature already exists on this app.`;
                                if (exists)
                                {
                                    return <Tooltip title={help} aria-label={help} style={{verticalAlign: "bottom"}}>
                                        <div style={{ padding: 5, display: "inline-block" }}>
                                            <input type="checkbox" value={feature} name={feature} id={feature} onClick={(evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => selectFeature(feature, (evt.target as any).checked)} disabled={true} checked={false}/>
                                            <label htmlFor={feature} style={{ textDecoration: "line-through"}}>{feature}</label>
                                        </div>
                                    </Tooltip>
                                }
                                else
                                {
                                    return <div style={{ padding: 5 }}>
                                        <input type="checkbox" value={feature} name={feature} id={feature} onClick={(evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => selectFeature(feature, (evt.target as any).checked)}/>
                                        <label htmlFor={feature}>{feature}</label>
                                    </div>
                                }
                            })}
                            <div>
                                Import to application:
                            </div>
                            <div>
                                <select name="app" onChange={(evt) => setAppSelected(evt.target.value)}>
                                    {apps.map((app) => <option value={app.id}>{app.name}</option>)}
                                </select>
                            </div>
                            <button onClick={() => setStage(Stages.Provider)}>Back</button>
                            <button onClick={createFeatures} disabled={importButtonDisabled}>Import</button>
                        </>
                    </>
                : null }
                {stage == Stages.Importing ?
                    <div>
                    Please wait while we import the selected features from your {provider} account.
                    </div>
                : null }
                {stage == Stages.Success ?
                    <div>
                    We have added {Object.keys(featuresSelected).filter((f) => featuresSelected[f] === true).length} features from your {provider} account.
                    </div>
                : null }
            </div>

        </Dialog>
    </>
}