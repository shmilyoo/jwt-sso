import React from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';

const renderSwitch = ({ input, label, ...rest }) => {
  return (
    <FormControlLabel
      control={
        <Switch {...input} {...rest} value="remember" checked={input.value} />
      }
      label={label}
    />
  );
};

export default renderSwitch;
