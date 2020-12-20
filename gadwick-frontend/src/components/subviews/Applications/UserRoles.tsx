import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, IconButton, SvgIconTypeMap, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import { IConfiguredApplication } from './AppView';
import serverAPI, { API, HTTP } from '../../../apis/api';
import UserTable, { IAppUser } from './UserTable';
import InviteDialog from './InviteDialog';
import DeleteDialog from '../../DeleteDialog';

interface IUserRoles
{
    app: IConfiguredApplication;
}

export enum Roles
{
    Admin = "Admin",
    Maintainer = "Maintainer",
    Tester = "Tester",
    Guest = "Guest"
}

export default function UserRoles(props: IUserRoles)
{
    const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
    const [invites, setInvites] = useState<IAppUser[]>([])
    const [users, setUsers] = useState<IAppUser[]>([])
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [userRoleToDelete, setUserRoleToDelete] = useState<IAppUser|null>(null);

    useEffect(() => {
        refreshInvites();
        serverAPI<IAppUser[]>(API.UserRoles, HTTP.READ, props.app.id).then(setUsers);
    }, [])

    function promptDeleteRole(user: IAppUser)
    {
        setUserRoleToDelete(user);
        setDeleteDialogOpen(true);
    }

    async function deleteRole()
    {
        setDeleteDialogOpen(false);
        await serverAPI(API.UserRoles, HTTP.DELETE, userRoleToDelete!.id);
        if (userRoleToDelete?.invite_status === "Invited")
        {
            refreshInvites();
        }
        else
        {
            serverAPI<IAppUser[]>(API.UserRoles, HTTP.READ, props.app.id).then(setUsers);
        }
    }

    function refreshInvites()
    {
        serverAPI<IAppUser[]>(API.Invites, HTTP.READ, props.app.id).then(setInvites);
        setInviteDialogOpen(false);
    }

    return <>
        <h3>Users</h3>
        <p>Manage which users have visibility of this application and what they have access to.</p>
        <UserTable appUsers={users} onAppUserDeleted={promptDeleteRole} showUsername={true}/>
        <p>You can add users to this Application by sending them an invite.</p>
        <button onClick={() => setInviteDialogOpen(true)} style={{ display: "inline" }}>Invite</button>
        <InviteDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} app={props.app} onSubmit={refreshInvites}/>
        <h4>Pending Invites</h4>
        <UserTable appUsers={invites} onAppUserDeleted={promptDeleteRole}/>
        <DeleteDialog open={deleteDialogOpen} targetType={userRoleToDelete?.invite_status === "Invited" ? "Invite" : "Permissions"} deleteTargetText={userRoleToDelete?.invite_status === "Invited" ? "their invite to join this app." : "their access permissions to this app."} onClose={() => setDeleteDialogOpen(false)} onSubmit={deleteRole}/>
    </>
}