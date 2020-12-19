import React, { Key, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import { IFeature } from '../Features/Features'
import Provider, { ThirdPartyProviders } from '../../../apis/thirdParty/providers';
import { IBoard, IBoardColumn, IBoardWithColumns } from '../../../apis/thirdParty/IThirdparty';
import LinkedDropDown from './LinkedDropdown';
import { ISession } from './Overview';
import serverAPI, { API, HTTP } from '../../../apis/api';

interface ISubmitResultsDialog
{
    open: boolean;
    onClose: () => void;
    features: IFeature[];
    session: ISession;
}

export default function SubmitResultsDialog(props: ISubmitResultsDialog)
{
    const [boards, setBoards] = useState<{ [provider: string]: IBoardWithColumns[]}>({})
    const [featureBoardTargets, setFeatureBoardTargets] = useState<{ [id: string]: { feature: IFeature, board: IBoard, column: IBoardColumn}}>({})
    useEffect(() =>
    {
        // Work out which providers are involved in these tickets
        const boardSet: { [provider: string]: IBoardWithColumns[] } = {};
        for (const feature of props.features)
        {
            boardSet[feature.thirdparty_provider] = [];
            console.log(`Found ${feature.thirdparty_provider}`)
        }
        // grab the data for them
        let providerPromises: Promise<void>[] = [];
        for (const providerName of Object.keys(boardSet))
        {
            const provider = Provider(providerName as ThirdPartyProviders);
            providerPromises.push(provider.getBoards().then(async (boards: IBoard[]) =>
            {
                console.log(`Got boards for ${providerName}, fetching columns`)
                let columnPromises: Promise<void>[] = [];
                let newBoards: IBoardWithColumns[] = [];
                for (const board of boards)
                {
                    columnPromises.push(provider.getColumns(board.id).then((cols: IBoardColumn[]) =>
                    {
                        newBoards.push({...board, columns: cols});
                    }))
                }
                boardSet[providerName] = newBoards;
            }));
        }
        // Once all the APIs have resolved in parallel, save the result
        Promise.all(providerPromises).then(() =>
        {
            setBoards(boardSet);
        })
    }, [props.features])

    function onFeatureColumnSet(feature: IFeature, board: IBoard, column: IBoardColumn)
    {
        const newTargets = { ...featureBoardTargets };
        newTargets[feature.id] = { feature, board, column };
        setFeatureBoardTargets(newTargets);
    }

    async function onSubmit()
    {
        for (const featureTarget of Object.values(featureBoardTargets))
        {
            const provider = Provider(featureTarget.feature.thirdparty_provider as ThirdPartyProviders);
            provider.createTicket(featureTarget.board.id, featureTarget.column.id, props.session, featureTarget.feature, { message: `Marked as failed by ${props.session.user_name}`});
        }
        await serverAPI(API.Sessions, HTTP.UPDATE, props.session.id, { submitted: 1 });
        props.onClose();
    }

    return <Dialog open={props.open} maxWidth="md" fullWidth={true}>
        <DialogTitle>
            <h3>Failed Tickets Submission<IconButton style={{float: "right"}} onClick={props.onClose}><CloseIcon/></IconButton></h3>
        </DialogTitle>
        <div style={{padding: 40, paddingTop: 0}}>
            <p>Not all features from your session will be shown here, only failed features that are linked to third party apps are shown.</p>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Feature</TableCell>
                            <TableCell>Third Party App</TableCell>
                            <TableCell>Board</TableCell>
                            <TableCell>Column</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.features.map((feature) =>
                            <TableRow id={feature.id}>
                                <TableCell>{feature.name}</TableCell>
                                <TableCell>{feature.thirdparty_provider}</TableCell>
                                <LinkedDropDown boards={boards[feature.thirdparty_provider]} onColumnChanged={(board, column) => onFeatureColumnSet(feature, board, column)}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>
                <button className="danger" onClick={props.onClose}>Cancel</button>
                <button className="success" onClick={onSubmit}>Submit</button>
            </div>
        </div>
    </Dialog>
}