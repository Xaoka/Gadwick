import React, { useEffect, useState } from 'react';
import { IBoard, IBoardColumn, IBoardWithColumns } from '../../../apis/thirdParty/IThirdparty';
import { TableCell } from '@material-ui/core';

interface ILinkedDropDown
{
    boards: IBoardWithColumns[];
    onColumnChanged?: (board: IBoard, column: IBoardColumn) => void;
}

// TODO: Make this more generic?
export default function LinkedDropDown(props: ILinkedDropDown)
{
    const [boardSelected, setBoardSelected] = useState(0);

    useEffect(() => {
        if (props.onColumnChanged)
        {
            props.onColumnChanged(props.boards[0], props.boards[0].columns[0]);
        }
    }, [])

    function onBoardSelected(evt: React.ChangeEvent<HTMLSelectElement>)
    {
        const index = parseInt(evt.target.value);
        setBoardSelected(index);
        if (props.onColumnChanged)
        {
            props.onColumnChanged(props.boards[index], props.boards[index].columns[0]);
        }
    }
    
    function onColumnSelected(evt: React.ChangeEvent<HTMLSelectElement>)
    {
        const index = parseInt(evt.target.value);
        if (props.onColumnChanged)
        {
            props.onColumnChanged(props.boards[boardSelected], props.boards[boardSelected].columns[index]);
        }
    }

    return <>
        <TableCell>
            <select onChange={onBoardSelected}>
                {!props.boards && <option value={0}>Loading...</option>}
                {props.boards && props.boards.map((board, index) =>
                    <option value={index}>{board.name}</option>
                )}
            </select>
        </TableCell>
        <TableCell>
            <select onChange={onColumnSelected}>
                {!props.boards && <option value="1">Default Column</option>}
                {props.boards && props.boards[boardSelected].columns.map((col, index) =>
                    <option value={index}>{col.name}</option>
                )}
            </select>
        </TableCell>
    </>
}