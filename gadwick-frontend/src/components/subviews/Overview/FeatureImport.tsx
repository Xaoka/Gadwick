import React, { useEffect, useState } from 'react';
import { IFeature } from '../Features/Features';
import { IConfiguredApplication } from '../Applications/AppView';
import { Dialog, DialogTitle, Tooltip } from '@material-ui/core';
import Axios from 'axios';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import { useAuth0 } from '@auth0/auth0-react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FeatureSelect, { IImport } from './FeatureSelect';
import TrelloAPI from '../../../apis/thirdParty/trello';
import AsanaAPI from '../../../apis/thirdParty/asana';
import { ThirdPartyProviders } from '../../../apis/thirdParty/providers';

export enum Stages { Provider, Connect, Authorizing, Import, Importing, Success }

interface IFeatureImport
{
    open: boolean;
    onClose: () => void;
}

export default function FeatureImport(props: IFeatureImport)
{
    const [stage, setStage] = useState<Stages>(Stages.Provider)
    const [appSelected, setAppSelected] = useState<IConfiguredApplication|null>(null)
    const [provider, setProvider] = useState<ThirdPartyProviders>(ThirdPartyProviders.None);
    const [importing, setImporting] = useState<boolean>(false);
    const [importedFeatures, setImportedFeatures] = useState<IImport>({});
    function onSelectProvider(prov: ThirdPartyProviders)
    {
        setProvider(prov);
        setStage(Stages.Connect);
    }

    function onClose()
    {
        setStage(Stages.Provider);
        props.onClose();
    }

    useEffect(() => {
        if (stage == Stages.Import)
        {
            importFeatures();
        }
    }, [stage])

    async function importFeatures()
    {   
        // TestRail: https://www.gurock.com/testrail/docs/api/getting-started/accessing
        // Doesn't seem to support OAuth or other indirect auth access
        setImporting(true);
        let features: IImport = {};
        // Do an API call to fetch
        if (provider == ThirdPartyProviders.Trello)
        {
            const boards = await TrelloAPI.getBoards();
            for (const board of boards)
            {
                const cards = await TrelloAPI.getCards(board.id);
                // console.log(cards.map((card: any) => card.name));
                for (const card of cards)
                {
                    features[board.name] = features[board.name] || [];
                    const feature = 
                    {
                        name: card.name,
                        board: board.name,
                        boardID: board.id,
                        ticketID: card.id,
                        link: card.link
                    }
                    features[board.name].push(feature);
                }
            }
        }
        else if (provider == ThirdPartyProviders.Asana)
        {
            const projects = await AsanaAPI.getBoards();
            for (const project of projects)
            {
                const cards = await AsanaAPI.getCards(project.id);
                for (const card of cards)
                {
                    features[project.name] = features[project.name] || [];
                    const feature = 
                    {
                        name: card.name,
                        board: project.name,
                        boardID: project.id,
                        ticketID: card.id,
                        link: card.link
                    }
                    features[project.name].push(feature);
                }
            }
        }
        else if (provider == ThirdPartyProviders.CucumberStudio)
        {
            // TODO: OAuth / credentials fetching - uid + client + apiID is way too much
            const config =
            {
                headers:
                {
                    Accept: `application/vnd.api+json; version=1`,
                    "access-token": `UXcygQ02RWArfjV9B3lN1g`,
                    client: `5t-UmsQqQWdQTvIhMbDV7A`,
                    uid: `rowan.powell@yoello.com`
                }
            };
            // For some reason this gives CORS when Postman doesn't ..
            const projects = (await Axios.get(`https://studio.cucumber.io/api/projects/`, config)).data.data;
            for (const project of projects)
            {
                const scenarios = (await Axios.get(`https://studio.cucumber.io/api/projects/${project.id}/scenarios`, config)).data.data;
                for (const scenario of scenarios)
                {
                    features[project.name] = features[project.name] || [];
                    const feature = 
                    {
                        name: scenario.attributes.name,
                        board: project.name,
                        boardID: project.id,
                        ticketID:scenario.attributes.id,
                        link: "TODO: Link"
                    }
                    features[project.name].push(feature);
                }
            }
        }
        setImportedFeatures(features);
        setImporting(false);
    }

    async function onConnectRequested()
    {
        // TODO: Authenticate with provider
        setStage(Stages.Authorizing);
        
        if (window.location.hostname == "localhost")
        {
            setStage(Stages.Import);
            return;
        }
        if (provider == ThirdPartyProviders.Trello)
        {
            // Does not work with localhost?
            (window as any).Trello.authorize({
                type: 'popup',
                name: 'Gadwick',
                scope: {
                    read: 'true' },
                expiration: 'never',
                success: () =>
                {
                    // Set TOKEN
                    setStage(Stages.Import);
                },
                error: () => console.log(`TRELLO: NOT AUTHORISED`)
            });
        }
    }
    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;
    return <Dialog open={props.open} maxWidth="sm" fullWidth onClose={onClose}>
            <DialogTitle>Import Features</DialogTitle>
            <div style={{ padding: 25, paddingTop: 0 }}>
                {stage == Stages.Provider ?
                    <>
                        <div>
                            Where would you like to import features from?
                        </div>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.Trello)}>Trello{chevron}</button>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.JIRA)} disabled={true}>JIRA{chevron}</button>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.Asana)}>Asana{chevron}</button>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.CucumberStudio)}>Cucumber Studio{chevron}</button>
                    </>
                : null }
                {stage == Stages.Connect ?
                    <>
                        <div>
                            Your {provider} account has not been connected yet, click below to connect it so we can import your features.
                        </div>
                        <button onClick={() => setStage(Stages.Provider)}>Back</button>
                        <button onClick={onConnectRequested}>Connect</button>
                    </>
                : null }
                { stage == Stages.Authorizing ? <>
                    <div>
                        An authorization request for your {provider} account has opened in a new window.
                    </div>
                </> : null}
                { importing ? <>
                    <div>
                        Importing features from your {provider} account, please wait.
                    </div>
                </> : null}
                {stage == Stages.Import && !importing ?
                    <>
                        {/** TODO: Should we make them select boards first? */}
                        <FeatureSelect importedFeatures={importedFeatures} provider={provider} setStage={setStage}/>
                    </>
                : null }
            </div>

        </Dialog>
}