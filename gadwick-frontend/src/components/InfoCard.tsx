import { Card, CardActionArea, CardMedia, CardContent, Typography, makeStyles, Button, CardActions, Tooltip } from '@material-ui/core';
import React from 'react';
import NotAvailable, { NotAvailableReason } from './subviews/NotAvailable';
import { SubscriptionTier } from './subviews/Subscription/Subscription';
import TierIcon from './TierIcon';

const mediumStyles = makeStyles({
root: {
    maxWidth: 345,
    width: 300, height: 260,
    display: "inline-block",
    margin: 10,
    boxShadow: "grey 3px 3px 11px -4px"
},
media: {
    height: 140,
}
});
const smallStyles = makeStyles({
root: {
    maxWidth: 145,
    width: 120, height: 100,
    display: "inline-block",
    margin: 5,
    boxShadow: "grey 3px 3px 11px -4px"
},
media: {
    height: 60,
}
});

export enum MediaType { Code, Application, Testing, AvailableSoon, TAU, Cypress, Postman, Tagged, Searching }

interface IInfoCard
{
    title: string;
    summary: string;
    image: MediaType;
    // size?: "sm"|"md";
    onClick?: () => void;
    actions?: ICardActions[];
    subscription?: SubscriptionTier;
    disabled?: boolean;
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
    const styleClassname = classes.media;
    switch (props.image)
    {
      case MediaType.Code:
        return <CardMedia
          className={styleClassname}
          image="/tutorials/tutorial_blur.png"
          title="Code"
        />
      case MediaType.Cypress:
        return <CardMedia
          className={styleClassname}
          image="/tutorials/cypress.png"
          title="Cypress"
        />
      case MediaType.Application:
        return <Tooltip title={"Business vector created by freepik - www.freepik.com"}>
          <CardMedia
            className={styleClassname}
            image="/tutorials/app_laptop.png"
          />
        </Tooltip>
      case MediaType.Testing:
        return <Tooltip title={"Business vector created by jcomp - www.freepik.com"}>
          <CardMedia
            className={styleClassname}
            image="/tutorials/test_type.png"
          />
        </Tooltip>
      case MediaType.Tagged:
        return <CardMedia
          className={styleClassname}
          image="/tutorials/test_tagged.jpg"
        />
      case MediaType.AvailableSoon:
        return <NotAvailable reason={NotAvailableReason.ComingSoon} size="sm"/>
      case MediaType.TAU:
        return <CardMedia
          className={styleClassname}
          image="/tutorials/tau_logo.png"
          title="Test Automation University"
          />
      case MediaType.Postman:
        return <CardMedia
          className={styleClassname}
          image="/tutorials/postman.png"
          title="Postman"
        />
      case MediaType.Searching:
        return <CardMedia
          className={styleClassname}
          image="/tutorials/searching.jpg"
          title="Searching"
        />
    }
  }

    const maxDescLength = 80;
    // const size = props.size || "md";
    const classes = mediumStyles();
    return  <Card className={classes.root}>
      <CardActionArea onClick={props.onClick}>
        <div style={{position: "relative"}}>
          {getImage()}
          {props.subscription && <TierIcon tier={props.subscription}/>}
        </div>
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