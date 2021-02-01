import { List, ListItem, ListItemIcon, ListItemText, DialogTitle, Dialog, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import { ITag } from '../../Features/FeatureConfig';
import { Roles } from './UserRoles'

interface ITagsManager
{
    appID?: string;
    permissionLevel: Roles;
}

export default function TagsManager(props: ITagsManager)
{
    const [tags, setTags] = useState<ITag[]>([])
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [newTagName, setNewTagName] = useState<string>("");
    const [editingTag, setEditingTag] = useState<ITag|null>(null);

    useEffect(() => {
        serverAPI<ITag[]>(API.AppTags, HTTP.READ, props.appID).then(setTags);
    }, [])

    async function saveTag()
    {
        if (editingTag)
        {
            await serverAPI<ITag>(API.Tags, HTTP.UPDATE, editingTag.id, { name: newTagName });
        }
        else
        {
            await serverAPI<ITag>(API.Tags, HTTP.CREATE, undefined, { app_id: props.appID, name: newTagName });
        }
        serverAPI<ITag[]>(API.AppTags, HTTP.READ, props.appID).then(setTags);
        setDialogOpen(false);
        setEditingTag(null);
        setNewTagName("");
    }

    function newTag()
    {
        setDialogOpen(true);
        setEditingTag(null);
        setNewTagName("");
    }

    async function deleteTag()
    {
        if (!editingTag) { return; }
        await serverAPI<ITag>(API.Tags, HTTP.DELETE, editingTag.id);
        serverAPI<ITag[]>(API.AppTags, HTTP.READ, props.appID).then(setTags);
        setDialogOpen(false);
        setEditingTag(null);
        setNewTagName("");
    }

    function setEditing(tag: ITag)
    {
        if (props.permissionLevel === Roles.Guest) { return; }
        if (props.permissionLevel === Roles.Tester) { return; }
        setEditingTag(tag);
        setNewTagName(tag.name);
        setDialogOpen(true);
    }

    return <>
        <h3>Tags</h3>
        <p>You can create and manage tags for your application to categorize features.</p>
        <List component="nav" aria-label="application tags">
            {tags.length === 0 && <p>This application doesn't have any tags yet.</p>}
            {tags.map((tag) =>
                <ListItem button onClick={() => setEditing(tag)} key={tag.id}>
                    <ListItemText primary={tag.name} />
                    {((props.permissionLevel === Roles.Maintainer) || (props.permissionLevel === Roles.Admin)) &&<ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>}
                </ListItem>)}
        </List>
        <button className="success" onClick={newTag}>New Tag</button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth={true} maxWidth="xs">
            <div style={{ padding: 40, paddingTop: 0 }}>
                <DialogTitle>{editingTag ? "Editing Tag" : "New Tag"}</DialogTitle>
                <TextField label="Name" onChange={(evt) => setNewTagName(evt.target.value)} defaultValue={editingTag?.name}/>
                <div>
                    {editingTag && <button className="danger" onClick={deleteTag}>Delete</button>}
                    <button className="success" disabled={newTagName.length === 0} onClick={saveTag}>Save</button>
                </div>
            </div>
        </Dialog>
    </>
}