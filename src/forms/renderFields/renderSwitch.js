import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Switch } from '@material-ui/core';

const RenderSwitch = ({
  input: { value, ...inputRest },
  label,
  trueLabel,
  falseLabel,
  labelPlacement = 'end',
  ...rest
}) => {
  return (
    <FormControlLabel
      control={
        <Switch {...inputRest} {...rest} value="remember" checked={!!value} />
      }
      label={trueLabel && falseLabel ? (value ? trueLabel : falseLabel) : label}
      labelPlacement={labelPlacement}
    />
  );
};

RenderSwitch.propTypes = {
  label: PropTypes.string, // 不设置trueLabel和falseLabel时显示的文本
  trueLabel: PropTypes.string, // switch为true的时候显示的文本
  falseLabel: PropTypes.string
};

export default RenderSwitch;
