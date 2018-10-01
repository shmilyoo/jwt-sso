import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';

const RenderInputSelectField = ({
  input,
  label,
  data, //[{label,value},...]
  meta: { touched, error },
  ...rest
}) => {
  return (
    <TextField
      select
      label={label}
      fullWidth
      error={!!(touched && error)}
      helperText={touched && error ? error : ' '}
      {...input}
      {...rest}
    >
      {data.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default RenderInputSelectField;
