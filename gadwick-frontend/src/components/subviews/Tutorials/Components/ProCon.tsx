import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface IProCon
{
    pros: string[];
    cons: string[];
}

export default function ProCon(props: IProCon)
{
    // TODO: Generic the box?
    const boxStyle: CSSProperties =
    {
        backgroundColor: "#ebf6f7",
        paddingBottom: 15,
        paddingTop: 1,
        // borderLeftColor: `var(--theme-primary)`,
        // borderLeftWidth: 5,
        // borderLeftStyle: "solid",
        display: "grid",
        gridTemplateColumns: "50% 50%"
    }

    const iconStyle: CSSProperties =
    {
        verticalAlign: "middle",
        color: "var(--theme-primary)"
    }

    return <div style={boxStyle}>
        <div style={{ padding: 10 }}>
            <h4>Pros</h4>
            {props.pros.map((p) => <div><AddIcon style={iconStyle}/>{p}</div>)}
        </div>
        <div style={{ padding: 10 }}>
            <h4>Cons</h4>
            {props.cons.map((c) => <div><RemoveIcon style={iconStyle}/>{c}</div>)}
        </div>
    </div>
}