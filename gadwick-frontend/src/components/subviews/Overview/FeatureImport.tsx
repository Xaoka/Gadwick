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
import AsanaAPI, { IAsanaAuthResponse } from '../../../apis/thirdParty/asana';
import { ThirdPartyProviders } from '../../../apis/thirdParty/providers';
import { IBoard } from '../../../apis/thirdParty/IThirdparty';

export enum Stages { Provider, Connect, Authorizing, Import, Importing, Success }

interface IFeatureImport
{
    open: boolean;
    onClose: () => void;
}

export default function FeatureImport(props: IFeatureImport)
{
    const { user } = useAuth0();
    const [stage, setStage] = useState<Stages>(Stages.Provider)
    const [appSelected, setAppSelected] = useState<IConfiguredApplication|null>(null)
    const [provider, setProvider] = useState<ThirdPartyProviders>(ThirdPartyProviders.None);
    const [importing, setImporting] = useState<boolean>(false);
    const [userID, setUserID] = useState<string|null>(null);
    const [boards, setBoards] = useState<IBoard[]>([])
    const [importedFeatures, setImportedFeatures] = useState<IImport>({});

    useEffect(() => {
        getUserID(user.sub).then(setUserID);
        // if (window.location.pa)
    }, [])

    function onSelectProvider(prov: ThirdPartyProviders)
    {
        setProvider(prov);
        // Check if we're already authenticated with this provider
        if (prov === ThirdPartyProviders.Trello && window.localStorage.trello_token)
        {
            setStage(Stages.Import);
        }
        else if (prov === ThirdPartyProviders.Asana && window.localStorage.asana_access_token)
        {
            setStage(Stages.Import);
        }
        else
        {
            setStage(Stages.Connect);
        }
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

    async function onConnectRequested()
    {
        setStage(Stages.Authorizing);
        
        if (window.location.hostname == "localhost")
        {
            // TODO: Figure this out, no longer works
            setStage(Stages.Import);
            return;
        }
        if (provider == ThirdPartyProviders.Trello)
        {
            // Does not work with localhost
            (window as any).Trello.authorize({
                type: 'popup',
                name: 'Gadwick',
                scope: {
                    read: 'true', write: 'true' },
                expiration: 'never',
                success: () =>
                {
                    serverAPI(API.Authentication, HTTP.CREATE, undefined, { token: window.localStorage.trello_token, service: "trello", user_id: userID })
                    setStage(Stages.Import);
                },
                error: () => console.log(`TRELLO: NOT AUTHORISED`)
            });
        }
        else if (provider == ThirdPartyProviders.Asana)
        {
            const config =
            {
                client_id: "1198750591472151",
                redirect_uri: encodeURI(`${window.location.origin}/auth-redirect`),
                response_type: "code"
            }
            const params = Object.entries(config).map((value) => `${value[0]}=${value[1]}`).join("&");
            const newWindow = window.open(`https://app.asana.com/-/oauth_authorize?${params}`, "_blank", "height=600,width=600,left=50,top=50");
            if (newWindow)
            {
                window.addEventListener("message", (event: any) =>
                {
                    if (event.origin !== "https://gadwick.co.uk" &&  event.origin !== "https://d92df6qhdnhfk.cloudfront.net")
                    {
                        console.error(`An unauthorised window attempted to trigger the authentication callback: ${event.origin}`);
                        return;
                    }
                    else
                    {
                        console.dir(event);
                        serverAPI<IAsanaAuthResponse>(API.Asana, HTTP.CREATE, undefined, { code: event.data.code, redirect_uri: `${event.origin}/auth-redirect` }).then((response) =>
                        {
                            localStorage.setItem('asana_access_token', response.access_token);
                            localStorage.setItem('asana_expiry', `${Date.now() + response.expires_in}`);
                            localStorage.setItem('asana_refresh_token', response.refresh_token);
                            setStage(Stages.Import);
                        });
                    }
                }, { once: true });
            }
        }
    }

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
            setBoards(boards);
            // for (const board of boards)
            // {
            //     const cards = await TrelloAPI.getCards(board.id);
            //     // console.log(cards.map((card: any) => card.name));
            //     for (const card of cards)
            //     {
            //         features[board.name] = features[board.name] || [];
            //         const feature = 
            //         {
            //             name: card.name,
            //             board: board.name,
            //             boardID: board.id,
            //             ticketID: card.id,
            //             link: card.link
            //         }
            //         features[board.name].push(feature);
            //     }
            // }
        }
        else if (provider == ThirdPartyProviders.Asana)
        {
            const projects = await AsanaAPI.getBoards();
            console.log(`Asana Boards:`)
            console.dir(projects);
            
            setBoards(projects);
            // for (const project of projects)
            // {
            //     const cards = await AsanaAPI.getCards(project.id);
            //     for (const card of cards)
            //     {
            //         features[project.name] = features[project.name] || [];
            //         const feature = 
            //         {
            //             name: card.name,
            //             board: project.name,
            //             boardID: project.id,
            //             ticketID: card.id,
            //             link: card.link
            //         }
            //         features[project.name].push(feature);
            //     }
            // }
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

            // for (const project of projects)
            // {
            //     const scenarios = (await Axios.get(`https://studio.cucumber.io/api/projects/${project.id}/scenarios`, config)).data.data;
            //     for (const scenario of scenarios)
            //     {
            //         features[project.name] = features[project.name] || [];
            //         const feature = 
            //         {
            //             name: scenario.attributes.name,
            //             board: project.name,
            //             boardID: project.id,
            //             ticketID:scenario.attributes.id,
            //             link: "TODO: Link"
            //         }
            //         features[project.name].push(feature);
            //     }
            // }
        }
        setImportedFeatures(features);
        setImporting(false);
    }
    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;
    return <Dialog open={props.open} maxWidth="sm" fullWidth onClose={onClose}>
            <DialogTitle>Import Features</DialogTitle>
            <div style={{ padding: 25, paddingTop: 0 }}>
                {stage == Stages.Provider ?
                    <>
                        <p>Gadwick allows you to import features from other third party services, select which service you would like to connect:</p>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.Trello)}>Trello{chevron}</button>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.Asana)}>Asana{chevron}</button>
                        <p>More integrations are coming soon:</p>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.JIRA)} disabled={true}>JIRA{chevron}</button>
                        <button onClick={() => onSelectProvider(ThirdPartyProviders.CucumberStudio)} disabled={true}>Cucumber Studio{chevron}</button>
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
                        <FeatureSelect importedBoards={boards} provider={provider} setStage={setStage}/>
                    </>
                : null }
            </div>

        </Dialog>
}