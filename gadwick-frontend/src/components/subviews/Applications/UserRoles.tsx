import React, { useEffect, useState } from 'react';
import { IConfiguredApplication } from './AppView';
import serverAPI, { API, HTTP } from '../../../apis/api';
import UserTable, { IAppUser } from './UserTable';
import InviteDialog from './InviteDialog';
import DeleteDialog from '../../DeleteDialog';
import getUserID, { IUser } from '../../../apis/user';
import { useAuth0 } from '@auth0/auth0-react';

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
    const { user } = useAuth0();
    
    const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
    const [invites, setInvites] = useState<IAppUser[]>([])
    const [users, setUsers] = useState<IAppUser[]>([])
    const [owner, setOwner] = useState<IUser>({ name: "", id: "", auth_id: "", auth_service: "", email: "" })
    const [currentUser, setCurrentUser] = useState<string|null>(null);
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [userRoleToDelete, setUserRoleToDelete] = useState<IAppUser|null>(null);

    useEffect(() => {
        refreshInvites();
        getUserID(user.sub).then(setCurrentUser);
        serverAPI<IUser>(API.Users, HTTP.READ, props.app.user_id).then(setOwner);
        serverAPI<IAppUser[]>(API.AppRoles, HTTP.READ, props.app.id).then(setUsers);
    }, [])

    function getCurrentPermissionLevel(): Roles
    {
        let asInvitedUser = invites.filter((i) => i.user_id === owner.id);
        if (asInvitedUser.length > 0)
        {
            return asInvitedUser[0].role;
        }
        else if (currentUser === owner.id)
        {
            return Roles.Admin;
        }
        else
        {
            return Roles.Guest;
        }
    }

    function promptDeleteRole(user: IAppUser)
    {
        setUserRoleToDelete(user);
        setDeleteDialogOpen(true);
    }

    async function deleteRole()
    {
        setDeleteDialogOpen(false);
        await serverAPI(API.Roles, HTTP.DELETE, userRoleToDelete!.id);
        if (userRoleToDelete?.invite_status === "Invited")
        {
            refreshInvites();
        }
        else
        {
            serverAPI<IAppUser[]>(API.AppRoles, HTTP.READ, props.app.id).then(setUsers);
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
        <UserTable appUsers={[ { ...owner, invite_email: owner.email, app_id: props.app.id, role: Roles.Admin, invite_status: "Accepted", user_id: owner.id }, ...users ]} onAppUserDeleted={promptDeleteRole} showUsername={true} permissionLevel={getCurrentPermissionLevel()}/>
        <p>You can add users to this Application by sending them an invite.</p>
        <h4>Pending Invites</h4>
        <UserTable appUsers={invites} onAppUserDeleted={promptDeleteRole} permissionLevel={getCurrentPermissionLevel()}/>
        <button onClick={() => setInviteDialogOpen(true)} style={{ display: "inline", float: "right" }}>Invite</button>
        <InviteDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} app={props.app} onSubmit={refreshInvites}/>
        <DeleteDialog open={deleteDialogOpen} targetType={userRoleToDelete?.invite_status === "Invited" ? "Invite" : "Permissions"} deleteTargetText={userRoleToDelete?.invite_status === "Invited" ? "their invite to join this app." : "their access permissions to this app."} onClose={() => setDeleteDialogOpen(false)} onSubmit={deleteRole}/>
    </>
}