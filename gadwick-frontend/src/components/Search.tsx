import React, { FormEvent, useState } from 'react';
import { TextField } from '@material-ui/core';
import TitleIcon from '@material-ui/icons/Title';
import SearchIcon from '@material-ui/icons/Search';

interface ISearchTerm
{
    value: string;
    field: string;
}

interface ISearch
{
    entries: object[];
    onFilterChanged: () => void;
}

export default function Search()
{
    const [searchTerms, setSearchTerms] = useState<ISearchTerm[]>([]);

    function onSearch(evt: { target: { value: string }})
    {
        // TODO: Support multiple field searches
        setSearchTerms([{ field: "name", value: evt.target.value }])
    }

    return <div>
        <TextField label="Search" InputProps={{ endAdornment: <SearchIcon color="inherit"/> }} onChange={onSearch}/>
        {/** https://material-ui.com/components/chips/ */}
        {/* <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
            }}
        ></Popover> */}
    </div>
}