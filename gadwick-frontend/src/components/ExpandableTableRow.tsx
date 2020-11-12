import React, { CSSProperties } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { IFeature } from './overview'
import EditableText from './EditableText';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

export interface IData<T>
{
  name: string,
  value: T,
  inputProperties?:
  {
    editable: true,
    onUpdate: (data: string) => void
  } | { editable: false }
}

export interface ICollapsableRow<T>
{
    data: IData<T>[];
    featureData: IFeature;
    onDelete: (data: IFeature) => void;
    style?: CSSProperties;
}

export default function ExpandableTableRow(props: React.PropsWithChildren<ICollapsableRow<any>>) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  function renderHeaderCell(datum: IData<any>)
  {
    if (datum.inputProperties && datum.inputProperties.editable && datum.inputProperties.onUpdate)
    {
      return <TableCell key={datum.name} align="left"><EditableText text={datum.value} onChanged={datum.inputProperties.onUpdate}/></TableCell>
    }
    return <TableCell key={datum.name} align="left">{datum.value}</TableCell>
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root} style={props.style}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {props.data.map((datum) => renderHeaderCell(datum))}
        <TableCell><button className="danger" onClick={() => props.onDelete(props.featureData)}><span role="img" aria-label="trash">🗑️</span></button></TableCell>
      </TableRow>
      {/* {"Collapsible content"} */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} style={{display: "flex", flexDirection: "row"}}>
              {props.children}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}