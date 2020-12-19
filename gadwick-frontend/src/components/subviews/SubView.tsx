import React from 'react';

export default function SubView(props: React.PropsWithChildren<{title: string}>)
{
    return <>
        <h1>{props.title}</h1>
        {/** TODO: not sure why -200 other than the header. Find a nicer way! */}
        <div style={{ height: "calc(100% - 200px)", overflowY: "scroll", padding: 40 }}>
            {props.children}
        </div>
    </>
}