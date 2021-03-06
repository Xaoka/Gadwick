import { useAuth0 } from '@auth0/auth0-react';
import { List, ListItem, SvgIconTypeMap, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { IFeature } from '../Features/Features';
import { ISession, ISessionResponse } from './Overview';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Status } from './Overview';
import { ITestResult } from '../Features/Results';
import SubmitResultsDialog from './SubmitResultsDialog';
import Loading from '../../Loading';
import { TestType } from './NewSession';
import ExploratorySession from './SessionTypes/Exploratory'

interface ISessionView
{
    onAbandon: () => void;
}

export default function SessionView(props: ISessionView)
{
    let { path } = useRouteMatch();
    const history = useHistory();
    let match = useRouteMatch<{sessionID: string}>({
      path: `${path}/:sessionID`
    })
    const [session, setSession] = useState<ISession|null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)
    const [linkedTicketsToSubmit, setLinkedTicketsToSubmit] = useState<IFeature[]>([])
    const [features, setFeatures] = useState<IFeature[]>([])
    const [results, setResults] = useState<boolean[]>([])
    const [featureIndex, setFeatureIndex] = useState<number>(0);
    const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false)
    const [reason, setReason] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(loadSession, [])

    function loadSession()
    {
        if (!match) { return; }
        setIsLoading(true);
        serverAPI<ISessionResponse[]>(API.Sessions, HTTP.READ, match?.params.sessionID).then((s) =>
        {
            const feature_ids: string[] = JSON.parse(s[0].feature_ids);
            const sessionData: ISession =
            {
                ...s[0],
                feature_ids
            }
            setSession(sessionData);
        }).catch((e) =>
        {
            setNotFound(true);
        });
    }

    useEffect(() => {
        if (!session?.feature_ids || session?.feature_ids.length == 0)
        {
            setIsLoading(false);
            return;
        }
        serverAPI<IFeature[]>(API.Features, HTTP.READ, `?ids=${session?.feature_ids.join(",")}`).then((features) =>
        {
            features.forEach((f) => f.steps = JSON.parse(f.steps as any));
            setFeatures(features)
            setFeatureIndex(0);
            setIsLoading(false);
        });
    }, [session])

    useEffect(() => {
        if (features.length === 0) { return; }
        serverAPI<ITestResult[]>(API.SessionResults, HTTP.READ, match?.params.sessionID).then((sessionResults) =>
        {
            let resultsPassed: boolean[] = [];
            let trueFeatureIndex = 0;
            for (const result of sessionResults)
            {
                const index = session!.feature_ids.indexOf(result.feature_id);
                if (index >= 0)
                {
                    resultsPassed[index] = result.passed === "1";
                    trueFeatureIndex = Math.max(index + 1, trueFeatureIndex);
                }
            }
            setResults(resultsPassed);
            setFeatureIndex(trueFeatureIndex);
        })
    }, [features])
    
    async function onAbandon()
    {
        await serverAPI<ISession>(API.Sessions, HTTP.UPDATE, match?.params.sessionID, { status: Status.ABANDONED })
        props.onAbandon();
    }

    function checklistItem(step: string, index: number)
    {
        let className = "inactive";
        // if (index === featureIndex) { className = "list-selected"; }
        if (results[index] === true) { className = "success"; }
        if (results[index] === false) { className = "danger"; }
        // const onClick = (index === featureIndex) ? () => setFeatureIndex(featureIndex+1) : undefined;

        let Icon: OverridableComponent<SvgIconTypeMap>;
        if (results[index] === undefined)
        {
            Icon = RadioButtonUncheckedIcon;
        }
        else
        {
            Icon = CheckCircleIcon;
        }

        return <ListItem button={false} style={{ padding: 15 }} className={className} key={index}>
            <span style={{width: "100%"}}>
                {index===featureIndex && <ChevronRightIcon style={{verticalAlign: "bottom"}} fontSize="small"/>}
                {step}
                <Icon style={{ float: "right" }} id="icon"/>
            </span>
        </ListItem>
    }

    async function onResult(passed: boolean)
    {
        if (featureIndex + 1 === features.length)
        {
            onComplete();
        }
        else if (featureIndex === 0)
        {
            serverAPI<ISession>(API.Sessions, HTTP.UPDATE, match?.params.sessionID, { status: Status.INCOMPLETE })
        }
        serverAPI<ISession>(API.TestResults, HTTP.CREATE, undefined, { feature_id: features[featureIndex].id, passed, version: session?.app_version, session_id: session?.id, automated: "FALSE", reason })

        setReason("");
        const newResults = [...results];
        newResults[featureIndex] = passed;
        setFeatureIndex(featureIndex + 1);
        setResults(newResults);
    }

    function onComplete()
    {
        serverAPI<ISession>(API.Sessions, HTTP.UPDATE, match?.params.sessionID, { status: Status.COMPLETE })
        if (session != null)
        {
            setSession({...session, status: Status.COMPLETE });
        }
        // TODO: Open report dialog
    }

    useEffect(() => 
    {
        let linkedTickets: IFeature[] = [];
        if (session?.submitted !== 1)
        {
            linkedTickets = features.filter((f, i) => !!f.thirdparty_id && !results[i]);
        }
        setLinkedTicketsToSubmit(linkedTickets);
    }, [results])

    function newSession()
    {
        history.push(`/dashboard/test_session/new`);
    }

    function renderFeatureDetails()
    {
        if (features.length === 0)
        {
            if (isLoading)
            {
                return <Loading/>
            }
            else
            {
                return <p>No details found.</p>
            }
        }
        if (featureIndex === features.length)
        {
            return <>
                <p>Testing session complete!</p>
                {linkedTicketsToSubmit.length > 0 && <p>Would you like to submit bug tickets for the failed features to their original boards?</p>}
                {linkedTicketsToSubmit.length > 0 && <button onClick={() => setSubmitDialogOpen(true)}>Submit</button>}
                {session?.submitted === 1 && <p>Bug tickets have been submitted to third party apps for this session.</p>}
                <p>Click below to start another test session.</p>
                <button onClick={newSession}>New Session</button>
            </>
        }
        else
        {
            return <div style={{ backgroundColor: "#e0e0e0", padding: 15 }}>
                <h4>{features[featureIndex].name}</h4>
                {features[featureIndex].steps && <>
                    <p className="info">{features[featureIndex].description}</p>
                    Follow the test steps detailed below, then mark the test as failed or completed.
                    {features[featureIndex].steps.map((step) => <div>{step}</div>)}
                </>}
                {!features[featureIndex].steps && <>
                    <p>There aren't any steps available for this feature.</p>
                </>}
                <TextField label="Reason (Optional)" multiline={true} style={{ display: "block" }} fullWidth={true} onChange={(evt) => setReason(evt.target.value)} value={reason}/>
                <button className="danger" onClick={() => onResult(false)}>Failed</button>
                <button className="success" onClick={() => onResult(true)}>Passed</button>
            </div>
        }
    }

    function onDialogClosed()
    {
        loadSession();
        setSubmitDialogOpen(false);
    }

    if (notFound)
    {
        return <p>Uh oh, we couldn't find that session.</p>
    }

    function renderSession()
    {
        if (!session) { return null; }
        if (session.type == TestType.Exploratory)
        {
            return <ExploratorySession session={session} onComplete={onComplete}/>
        }
        else
        {
            return <div style={{ display: "grid", gridTemplateColumns: "30% calc(70% - 35px)"}}>
                <span>
                    <h3>Features</h3>
                    <div className="info">{session.type}</div>
                    <List>
                        {!isLoading && features.map((f,i) => checklistItem(f.name, i))}
                        {!isLoading && features.length === 0 && <p>No features found for session.</p>}
                        {isLoading && <Loading/>}
                    </List>
                </span>
                <span style={{ marginLeft: 20 }}>
                    <h3>Details</h3>
                    {renderFeatureDetails()}
                </span>
            </div>
        }
    }

    return <>
        <p>This is your active session for {session?.app_name}.</p>
        {featureIndex<features.length && <button onClick={onAbandon}>Abandon</button>}
        {renderSession()}
        {session && <SubmitResultsDialog open={submitDialogOpen && linkedTicketsToSubmit.length > 0} onClose={onDialogClosed} features={linkedTicketsToSubmit} session={session}/>}
    </>
}