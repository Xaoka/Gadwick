import React from 'react';
import LockIcon from '@material-ui/icons/Lock';

export enum NotAvailableReason { ComingSoon, Price, Requirement }

interface INotAvailable
{
    /** Defaults to "100%" */
    width?: string|number;
    /** Defaults to "md" */
    size?: "sm"|"md";
    reason: NotAvailableReason;
}

export default function NotAvailable(props: INotAvailable)
{
    function getReasonText()
    {
        switch (props.reason)
        {
            case NotAvailableReason.ComingSoon:
                return "Coming soon.";
            case NotAvailableReason.Price:
                return "Not available on your subscription";
            case NotAvailableReason.Requirement:
                return "Requirements not complete."
        }
    }

    const width = (props.width !== undefined) ? props.width : "100%";
    const fontSize = props.size === "sm" ? 80 : 130;
    const margin = props.size === "sm" ? 30 : 50;
    return <div style={{ width }}>
        <div style={{ margin: "auto", color: "grey", fontSize, textAlign: "center" }}>
            <LockIcon color="inherit" fontSize="inherit" style={{ marginBottom: -margin, marginTop: -margin }} />
            <p style={{ textAlign: "center", fontSize: "initial" }}>
                {getReasonText()}
            </p>
        </div>
    </div>
}