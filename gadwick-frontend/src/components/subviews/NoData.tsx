import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

export default function NoData()
{
    return <div style={{ color: "grey", margin: "auto", fontSize: 130, width: "100%", textAlign: "center" }}>
        <SearchIcon color="inherit" fontSize="inherit" style={{ marginBottom: -50, marginTop: -50 }} />
        <p style={{ textAlign: "center", fontSize: "initial" }}>Not enough data found.</p>
    </div>
}