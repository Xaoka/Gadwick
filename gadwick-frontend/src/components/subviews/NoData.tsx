import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

interface INoData
{
    /** Defaults to "100%" */
    width?: string|number;
}

export default function NoData(props: INoData)
{
    const width = (props.width !== undefined) ? props.width : "100%";
    return <div style={{ width }}>
        <div style={{ margin: "auto", color: "grey", fontSize: 130, textAlign: "center" }}>
            <SearchIcon color="inherit" fontSize="inherit" style={{ marginBottom: -50, marginTop: -50 }} />
            <p style={{ textAlign: "center", fontSize: "initial" }}>Not enough data found.</p>
        </div>
    </div>
}