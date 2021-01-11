import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { IUser } from '../../../apis/user';

export default function Users()
{
    
    const [users, setUsers] = useState<IUser[]>([]);
    const [page, setPage] = React.useState(0);
    useEffect(() => {
        serverAPI<IUser[]>(API.Users, HTTP.READ).then(setUsers);
    }, [])
    // TODO: Generic Paginated table
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };
    return <>
        <h2>Manage Users</h2>
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.slice(page * 10, page * 10 + 10).map((user, index) => <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                </TableRow>)}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[10]}
                        colSpan={7}
                        count={users.length}
                        rowsPerPage={10}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                        }}
                        onChangePage={handleChangePage}
                        ActionsComponent={TablePaginationActions}
                        />
                </TableRow>
            </TableFooter>
        </Table>
    </>
}