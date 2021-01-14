import React from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Roles } from './UserRoles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export interface IAppUser
{
    id: string;
    role: Roles;
    name: string;
    app_id: string;
    user_id: string;
    invite_email: string;
    invite_status: "Invited"|"Accepted";
}

interface IUserTable
{
    appUsers: IAppUser[];
    permissionLevel: Roles;
    showUsername?: boolean;
    onAppUserDeleted?: (user: IAppUser) => void;
}

export default function UserTable(props: IUserTable)
{
    function onDelete(user: IAppUser)
    {
        if (props.onAppUserDeleted)
        {
            props.onAppUserDeleted(user);
        }
    }

    function permissionToDelete(user: IAppUser)
    {
        return (user.role !== Roles.Admin) && (props.permissionLevel === Roles.Admin || props.permissionLevel === Roles.Maintainer);
    }

    return <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    {props.showUsername && <TableCell>User</TableCell>}
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.appUsers.map((user) =>
                    <TableRow key={user.id}>
                        {props.showUsername && <TableCell>{user.name}</TableCell>}
                        <TableCell>{user.invite_email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            {permissionToDelete(user) && <IconButton onClick={() => onDelete(user)}>
                                <DeleteForeverIcon className="danger"/>
                            </IconButton>}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
}