import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, IconButton, Tooltip } from '@material-ui/core';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { IData } from '../../ExpandableTableRow'
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import FeatureConfigDialog from './FeatureConfigDialog';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FeaturePriority from './FeaturePriority';
import { Roles } from '../Applications/AppDetails/UserRoles';
import DeleteDialog from '../../DeleteDialog';
import { ITag } from './FeatureConfig';
import Search from '../../Search';

export interface IFeatureRatings
{
    app_id?: string;
    app_name?: string;
    passRate: number;
    distinctness: number;
    ease: number;
    fix_priority: number;
    problem_frequency: number;
    severity: number;
    similar_problem_frequency: number;
    use_frequency: number;
    time_cost: number;
}

export interface IFeature extends IFeatureRatings
{
    id: string;
    name: string;
    description: string;
    /** Third party app (e.g. Asana) that this feature is linked to */
    thirdparty_provider: string;
    /** ID of the board on a third party app this feature is linked to */
    thirdparty_board: string;
    /** card/ticket ID on a third party app that this feature is linked to */
    thirdparty_id: string;
    /** Link to ticket on third party app */
    thirdparty_link: string;
    /** Test / Repro steps */
    steps: string[];
    /** Calculated automation priority score */
    priority: number;
    /** Tag */
    tag?: string;
}

interface IFeatures
{
    style?: CSSProperties;
    appID?: string;
    permissionLevel: Roles;
}

export default function Features(props: IFeatures)
{
    const [dialogFeature, setDialogFeature] = useState<IFeature|null>(null);
    const [features, setFeatures] = useState<IFeature[]>([])
    const [featureToDelete, setFeatureToDelete] = useState<IFeature|null>(null);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<ITag[]>([]);

    useEffect(() => {
        serverAPI<ITag[]>(API.AppTags, HTTP.READ, props.appID).then((tags) =>
        {
            setTags(tags);
            updateList();
        });
    }, [])
    // const useStyles = makeStyles({
    //   table: {
    //     // minWidth: 650,
    //     // paddingLeft: 200,
    //     // paddingRight: 200
    //   },
    // });
    // const [features, setFeatures] = useState([{ name: "Feature 1", status: "NEW", passRate: 12}])

    function rowMapping(feature: IFeature): IData<any>[]
    {
        return [
            {
                name: "Name",
                value: feature.name
            },
            {
                name: "Description",
                value: feature.description
            },
            // {
            //     name: "Pass Rate",
            //     value: `${feature.passRate}%`
            // },
            {
                name: "Tag",
                value: tags.filter((t) => t.id == feature.tag)[0]?.name
            }
        ]
    }

    function updateList()
    {
        serverAPI<IFeature[]>(API.AppFeatures, HTTP.READ, props.appID).then((data) =>
        {
            setFeatures(data.map((f) =>
            {
                let steps = [""];
                try
                {
                    steps = JSON.parse(f.steps as any)
                }
                catch (err)
                {
                    console.warn(err);
                }
                return { ...f, steps } }));
            console.dir(data)
        });
    }

    async function openDelete(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, feature: IFeature)
    {
        setDeleteOpen(true);
        evt.preventDefault();
        evt.stopPropagation();
        setFeatureToDelete(feature);
    }

    async function onDelete()
    {
        setDeleteOpen(false);
        await serverAPI(API.Features, HTTP.DELETE, featureToDelete!.id);
        updateList();
    }

    async function createNew()
    {
        const newFeature = await serverAPI<IFeature>(API.Features, HTTP.CREATE, undefined, { name: "New Feature", description: "New Feature", app_id: props.appID });
        updateList();
        setDialogFeature(newFeature);
    }

    function openExternalLink(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, link: string)
    {
        evt.preventDefault();
        evt.stopPropagation();
        window.open(link);
    }

    function renderFeatureTable()
    {
        return <>
            {/* <Search/> */}
            <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Feature Name</TableCell>
                        {/* <TableCell align="right">Status</TableCell> */}
                        <TableCell align="left">Description</TableCell>
                        {/* <TableCell align="left">Pass Rate (%)</TableCell> */}
                        <TableCell align="left">Tag</TableCell>
                        <TableCell align="left">Ticket Link</TableCell>
                        <TableCell align="left">Priority</TableCell>
                        {(props.permissionLevel === Roles.Admin || props.permissionLevel === Roles.Maintainer) && <TableCell></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                {(features.length > 0) && features.map((feature) => (
                    <TableRow onClick={() => setDialogFeature(feature)} key={feature.id}>
                        {rowMapping(feature).map((datum) => <TableCell key={datum.name} align="left" >{datum.value}</TableCell>)}
                        
                        <TableCell>
                            <Tooltip title={feature.thirdparty_link ? `View this ticket on ${feature.thirdparty_provider}` : `This feature is not linked to any thirdparty apps.`}>
                                <span>
                                    <IconButton disabled={!feature.thirdparty_link} onClick={(evt) => openExternalLink(evt, feature.thirdparty_link)}>
                                        { feature.thirdparty_link ? <LinkIcon/> : <LinkOffIcon/>}
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <FeaturePriority priority={feature.priority}/>
                        </TableCell>
                        {(props.permissionLevel === Roles.Admin || props.permissionLevel === Roles.Maintainer) && <TableCell>
                            {/** TODO: Make this use a delete dialog! */}
                            <Tooltip title="Delete this feature.">
                                <IconButton onClick={(evt) => openDelete(evt, feature)}>
                                    <DeleteForeverIcon style={{ color: "darkred" }}/>
                                </IconButton>
                            </Tooltip>
                        </TableCell>}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <DeleteDialog open={deleteOpen} onSubmit={onDelete} onClose={() => setDeleteOpen(false)} targetType="Feature" deleteTargetText="this feature and any results associated with it."/>
        </>
    }

    return <>
        <span style={props.style}>
            <h3>
                Features
            </h3>
            {renderFeatureTable()}
            <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
        </span>
        <FeatureConfigDialog feature={dialogFeature} onClose={() =>
        {
            setDialogFeature(null)
            updateList()
        }}/>
    </>
}