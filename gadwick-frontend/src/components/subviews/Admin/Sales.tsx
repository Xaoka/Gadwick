import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { IUser } from '../../../apis/user';
import { IPurchase } from '../Subscription/Subscription';

interface ISale extends IPurchase
{
    product_name: string;
    sold_at_price_pence: number;
    /** Purchasing user name */
    name: string;
    sold_at_time: string;
}

export default function Sales()
{
    
    const [sales, setSales] = useState<ISale[]>([]);
    const [page, setPage] = React.useState(0);
    useEffect(() => {
        serverAPI<ISale[]>(API.Purchase, HTTP.READ).then(setSales);
    }, [])
    // TODO: Generic Paginated table
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };
    return <>
        <h2>Review Sales</h2>
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Placed At</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sales.slice(page * 10, page * 10 + 10).map((sale, index) => <TableRow key={index}>
                    <TableCell>{sale.name}</TableCell>
                    <TableCell>{sale.product_name}</TableCell>
                    <TableCell>£{(sale.sold_at_price_pence/100).toFixed(2)}</TableCell>
                    <TableCell>{sale.status}</TableCell>
                    <TableCell>{(new Date(Date.parse(sale.sold_at_time))).toLocaleString()}</TableCell>
                </TableRow>)}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[10]}
                        colSpan={7}
                        count={sales.length}
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