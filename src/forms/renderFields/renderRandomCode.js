import React from 'react';
import Proptypes from 'prop-types';
import randomize from 'randomatic';
import Sync from '@material-ui/icons/Sync';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';

/**
 * 用来生成随机密码，使用randomatic库
 */
const RenderRandomCode = ({
  input: { onChange, ...restInput },
  label,
  codeLength,
  codePattern,
  readOnly, // 模式：只读为readOnly
  meta: { touched, error },
  ...rest
}) => {
  return (
    <TextField
      label={label}
      error={!!(touched && error)}
      helperText={touched && error ? error : ' '}
      fullWidth
      InputProps={{
        readOnly,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              title="刷新"
              disabled={readOnly}
              onClick={() => {
                onChange(randomize(codePattern, codeLength));
              }}
            >
              <Sync />
            </IconButton>
          </InputAdornment>
        )
      }}
      {...restInput}
      {...rest}
    />
  );
};

RenderRandomCode.propTypes = {
  readOnly: Proptypes.bool,
  codeLength: Proptypes.number,
  codePattern: Proptypes.string
};

RenderRandomCode.defaultProps = {
  readOnly: true,
  codeLength: 10,
  codePattern: '*'
};

export default RenderRandomCode;
