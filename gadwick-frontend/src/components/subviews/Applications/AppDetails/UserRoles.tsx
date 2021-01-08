import React, { useEffect, useState } from 'react';
import { IConfiguredApplication } from '../AppView';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import UserTable, { IAppUser } from './UserTable';
import InviteDialog from './InviteDialog';
import DeleteDialog from '../../../DeleteDialog';
import getUserID, { IUser } from '../../../../apis/user';
import { useAuth0 } from '@auth0/auth0-react';
import useSubscription from '../../../../apis/subscription';
import { SubscriptionTier } from '../../Subscription/Subscription';
import { Alert } from '@material-ui/lab';
import getCurrentPermissionLevel from './permissionLevel';

interface IUserRoles
{
    app: IConfiguredApplication;
    setInvites: (invites: IAppUser[]) => void;
    setUsers: (roles: IAppUser[]) => void;
    users: IAppUser[];
    invites: IAppUser[];
    owner: IUser;
    permissionLevel: Roles;
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
    const tier = useSubscription();
    
    const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [userRoleToDelete, setUserRoleToDelete] = useState<IAppUser|null>(null);

    useEffect(() => {
        refreshInvites();
    }, [])

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
            serverAPI<IAppUser[]>(API.AppRoles, HTTP.READ, props.app.id).then(props.setUsers);
        }
    }

    function refreshInvites()
    {
        serverAPI<IAppUser[]>(API.Invites, HTTP.READ, props.app.id).then(props.setInvites);
        setInviteDialogOpen(false);
    }

    return <>
        <h3>Users</h3>
        {props.permissionLevel !== Roles.Admin && props.permissionLevel !== Roles.Maintainer && <Alert severity="warning">You are not able to add or remove users as a {props.permissionLevel}.</Alert>}
        <p>Manage which users have visibility of this application and what they have access to.</p>
        <UserTable appUsers={[ { ...props.owner, invite_email: props.owner.email, app_id: props.app.id, role: Roles.Admin, invite_status: "Accepted", user_id: props.owner.id }, ...props.users ]} onAppUserDeleted={promptDeleteRole} showUsername={true} permissionLevel={props.permissionLevel}/>
        <p>You can add users to this Application by sending them an invite.</p>
        <h3>Pending Invites</h3>
        {tier === SubscriptionTier.Free && <Alert severity="warning">You are not able to add additional users to this application on the Free tier, consider upgrading your subscription.</Alert>}
        <UserTable appUsers={props.invites} onAppUserDeleted={promptDeleteRole} permissionLevel={props.permissionLevel}/>
        <button onClick={() => setInviteDialogOpen(true)} style={{ display: "inline", float: "right" }} disabled={tier === SubscriptionTier.Free}>Invite</button>
        <InviteDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} app={props.app} onSubmit={refreshInvites}/>
        <DeleteDialog open={deleteDialogOpen} targetType={userRoleToDelete?.invite_status === "Invited" ? "Invite" : "Permissions"} deleteTargetText={userRoleToDelete?.invite_status === "Invited" ? "their invite to join this app." : "their access permissions to this app."} onClose={() => setDeleteDialogOpen(false)} onSubmit={deleteRole}/>
    </>
}