import React from 'react';
import {
  makeStyles,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    padding: 15,
  },
  content: {
    padding: '16px 16px 0',
  },
  actions: {
    justifyContent: 'flex-end',
  },
  title: {
    fontWeight: 600,
  },
}));

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Card>
        <CardContent className={classes.content}>
          <Typography className={classes.title}>Add New Document</Typography>
          <Typography>
            Create or upload a new document/document template
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button variant="contained" color="primary">
            Create
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
