import React from 'react';
import { Dialog, DialogTitle, IconButton, SvgIconTypeMap, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import { Roles } from './UserRoles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export interface IAppUser
{
    id: string;
    role: Roles;
    name: string;
    app_id: string;
    invite_email: string;
    invite_status: "Invited"|"Accepted";
}

interface IUserTable
{
    appUsers: IAppUser[];
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
                    <TableRow>
                        {props.showUsername && <TableCell>{user.name}</TableCell>}
                        <TableCell>{user.invite_email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            <IconButton onClick={() => onDelete(user)}>
                                <DeleteForeverIcon className="danger"/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
}