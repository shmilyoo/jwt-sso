import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../../assets/css/datePicker.css';
import { withStyles, TextField } from '@material-ui/core';

class CustomInput extends React.PureComponent {
  render() {
    const {
      label,
      input, // 父组件datepicker传递过来的inputProps，为了实现touched变量
      meta: { touched, error },
      value, // datepicker传递的参数
      onClick // datepicker传递的参数
    } = this.props;
    return (
      <TextField
        label={label}
        {...input}
        fullWidth
        error={!!(touched && error)}
        helperText={touched && error ? error : ' '}
        value={value} // 和react-datepicker 的selected值关联，不是redux-form的value
        onClick={onClick}
      />
    );
  }
}

const RenderDatePicker = ({
  showTime,
  label,
  minDate,
  maxDate,
  input: { value, onChange, ...inputRest },
  meta
}) => {
  return (
    <div
      style={{
        fontSize: '1.8rem'
      }}
    >
      <DatePicker
        customInput={
          <CustomInput label={label} input={inputRest} meta={meta} />
        }
        showTimeSelect={showTime}
        timeFormat="HH:mm"
        dateFormat="YYYY-MM-DD"
        selected={value} // value是input.value
        onChange={onChange}
        showYearDropdown
        showMonthDropdown
        yearDropdownItemNumber={100} // 设置合适的数值，这个要不然得一个一个点，不方便
        minDate={minDate ? moment(minDate) : null}
        maxDate={maxDate ? moment(maxDate) : null}
        scrollableYearDropdown
      />
    </div>
  );
};

RenderDatePicker.propTypes = {
  showTime: PropTypes.bool,
  label: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string
};

export default RenderDatePicker;
