import React from 'react';

interface IWidgetContainer
{
    title?: string;
    /** Container size, defaults to "md" */
    size?: "sm"|"md"|"lg"
}

export default function WidgetContainer(props: React.PropsWithChildren<IWidgetContainer>)
{
    let width = 500;
    let height = 300;
    if (props.size === "sm")
    {
        width = 300;
        height = 225;
    }
    else if (props.size === "lg")
    {
        width = 800;
        height = 600;
    }
    return <div style={{ display: "inline-block", margin: 15, verticalAlign: "top" }}>
        <div style={{ padding: 35, paddingTop: 5, width, height }} className="box-shadow">
            <h3>{props.title}</h3>
            {props.children}
        </div>
    </div>
}