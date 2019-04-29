import React from 'react';
import Check from '@material-ui/icons/Check';
import blue from '@material-ui/core/colors/blue';
import { CircularProgress, TextField, InputAdornment } from '@material-ui/core';

/**
 * textfiled表单，label:提示文本，asyncCheckFlag:用于username表单异步验证特定用途
 * 普通输入表单asyncCheckFlag不设置即可
 */
const RenderTextField = ({
  input,
  label,
  asyncCheckFlag,
  readOnly, // 模式：只读为readOnly
  meta: { touched, error, valid, asyncValidating },
  ...rest
}) => {
  if (asyncCheckFlag) {
    // 专为注册异步验证用户名、部门代号等unique值是否重复设计
    return (
      <TextField
        label={label}
        error={!!(touched && error)}
        helperText={touched && error ? error : ' '}
        fullWidth
        {...input}
        {...rest}
        // touched && valid && !asyncValidating 代表正在异步验证
        InputProps={{
          readOnly,
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
      InputProps={{ readOnly }}
      fullWidth
      {...input}
      {...rest}
    />
  );
};

export default RenderTextField;
