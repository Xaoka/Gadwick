import React from 'react';
import LockIcon from '@material-ui/icons/Lock';

export enum NotAvailableReason { ComingSoon, Price, Requirement }

interface INotAvailable
{
    /** Defaults to "100%" */
    width?: string|number;
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
    return <div style={{ width }}>
        <div style={{ margin: "auto", color: "grey", fontSize: 130, textAlign: "center" }}>
            <LockIcon color="inherit" fontSize="inherit" style={{ marginBottom: -50, marginTop: -50 }} />
            <p style={{ textAlign: "center", fontSize: "initial" }}>
                {getReasonText()}
            </p>
        </div>
    </div>
}