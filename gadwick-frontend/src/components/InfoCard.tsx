import { Card, CardActionArea, CardMedia, CardContent, Typography, makeStyles, Button, CardActions } from '@material-ui/core';
import React from 'react';
import NotAvailable, { NotAvailableReason } from './subviews/NotAvailable';

const useStyles = makeStyles({
root: {
    maxWidth: 345,
    display: "inline-block",
    margin: 10,
    boxShadow: "grey 3px 3px 11px -4px"
},
media: {
    height: 140,
},
});

export enum MediaType { Code, Application, Testing, AvailableSoon, TAU }

interface IInfoCard
{
    title: string;
    summary: string;
    image: MediaType;
    onClick?: () => void;
    actions?: ICardActions[]
}

export interface ICardActions
{
  text: string;
  onClick: () => void;
}

export default function InfoCard(props: IInfoCard)
{
  function getImage()
  {
    switch (props.image)
    {
      case MediaType.Code:
        return <CardMedia
          className={classes.media}
          image="/tutorials/code.png"
          title="Code"
        />
      case MediaType.Application:
        return <CardMedia
          className={classes.media}
          image="/tutorials/product.png"
          title="Application"
        />
      case MediaType.Testing:
        return <CardMedia
          className={classes.media}
          image="/tutorials/testing.png"
          title="Test"
        />
      case MediaType.AvailableSoon:
        return <NotAvailable reason={NotAvailableReason.ComingSoon} size="sm"/>
      case MediaType.TAU:
        return <CardMedia
          className={classes.media}
          image="/tutorials/tau_logo.png"
          title="Test Automation University"
          />
    }
  }

    const maxDescLength = 80;
    const classes = useStyles();
    return  <Card className={classes.root} style={{ width: 300, height: 260 }}>
      <CardActionArea onClick={props.onClick}>
        {getImage()}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {!!props.summary && (props.summary.length > maxDescLength ? `${props.summary.substring(0, maxDescLength-3)}...` : props.summary)}
          </Typography>
        </CardContent>
      </CardActionArea>
      {props.actions && <CardActions>
        {props.actions.map((action) =>
          <Button size="small" color="primary" onClick={action.onClick}>
            {action.text}
          </Button>)}
      </CardActions>}
    </Card>
}