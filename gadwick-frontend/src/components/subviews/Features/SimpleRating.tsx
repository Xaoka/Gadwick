import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box, Tooltip } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { CSSProperties } from 'material-ui/styles/withStyles';

export interface ISimpleRating
{
  title: string;
  initialValue: number;
  toolTip: string;
  disabled?: boolean;
  onChanged?: (value: number) => void;
  style?: CSSProperties;
}

export default function SimpleRating(props: ISimpleRating)
{
    // const [value, setValue] = React.useState<number | null>(props.initialValue);

    return <Tooltip title={props.toolTip}>
        <Box component="fieldset" mb={3} borderColor="transparent" style={{display: "inline", ...props.style}}>
        <Typography component="legend">{props.title}</Typography>
        <Rating
          name={`simple-controlled-${props.title}`}
          value={props.initialValue}
          disabled={props.disabled}
          onChange={(event, newValue) => {
            if (props.disabled || newValue == null) { return; }
            // setValue(newValue);
            if (props.onChanged)
            {
              // setValue(newValue);
              props.onChanged(newValue);
            }
          }}
        />
    </Box>
  </Tooltip>
}