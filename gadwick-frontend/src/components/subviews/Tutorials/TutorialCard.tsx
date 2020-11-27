import { Card, CardActionArea, CardMedia, CardContent, Typography, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
root: {
    maxWidth: 345,
    display: "inline-block",
    margin: 10
},
media: {
    height: 140,
},
});

interface ITutorialCard
{
    title: string;
    summary: string;
}

export default function TutorialCard(props: ITutorialCard)
{
    const classes = useStyles();
    return  <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="/tutorials/code.png"
          title="Code"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions> */}
    </Card>
}