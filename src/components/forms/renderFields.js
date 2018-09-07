import React from 'react';
import Check from '@material-ui/icons/Check';
import Refresh from '@material-ui/icons/Refresh';
import blue from '@material-ui/core/colors/blue';
import {
  FormControlLabel,
  Switch,
  CircularProgress,
  TextField,
  InputAdornment
} from '@material-ui/core';

/**
 * textfiled表单，label:提示文本，asyncCheckFlag:用于username表单异步验证特定用途
 * 普通输入表单asyncCheckFlag不设置即可
 */
export const RenderTextField = ({
  input,
  label,
  asyncCheckFlag,
  meta: { touched, error, valid, asyncValidating },
  ...rest
}) => {
  if (asyncCheckFlag) {
    return (
      <TextField
        label={label}
        error={!!(touched && error)}
        helperText={touched && error ? error : ' '}
        fullWidth
        {...rest}
        {...input}
        // touched && valid && !asyncValidating 代表正在异步验证
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {asyncValidating ? (
                <CircularProgress size={18} color="primary" />
              ) : touched && valid && !asyncValidating ? (
                <Check style={{ color: blue[500] }} />
              ) : (
                ''
              )}
            </InputAdornment>
          )
        }}
      />
    );
  }
  return (
    <TextField
      label={label}
      error={!!(touched && error)}
      helperText={touched && error ? error : ' '}
      fullWidth
      {...rest}
      {...input}
    />
  );
};

export const renderSwitch = ({ input, label, ...rest }) => {
  return (
    <FormControlLabel control={<Switch {...input} {...rest} />} label={label} />
  );
};
