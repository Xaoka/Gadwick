import { Card, CardActionArea, CardMedia, CardContent, Typography, makeStyles, Button, CardActions } from '@material-ui/core';
import React from 'react';

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

export enum MediaType { Code, Application }

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
    }
  }

    const classes = useStyles();
    return  <Card className={classes.root} style={{ width: 240, height: 250 }}>
      <CardActionArea onClick={props.onClick}>
        {getImage()}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {!!props.summary && (props.summary.length > 50 ? `${props.summary.substring(0, 47)}...` : props.summary)}
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