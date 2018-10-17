import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../../assets/css/datePicker.css';
import { TextField, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';

class CustomInput extends React.PureComponent {
  handleClearClick = () => {
    this.props.onInputChange(null);
  };
  render() {
    const {
      label,
      nullText,
      canClear,
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
        autoComplete="off"
        error={!!(touched && error)}
        helperText={touched && error ? error : ' '}
        value={value || nullText} // 和react-datepicker 的selected值关联，不是redux-form的value
        onClick={onClick}
        InputProps={
          canClear && value
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <Cancel
                      style={{ cursor: 'pointer' }}
                      onClick={this.handleClearClick}
                    />
                  </InputAdornment>
                )
              }
            : null
        }
      />
    );
  }
}

const RenderDatePicker = ({
  showTime,
  label,
  todayBtnText,
  canClear,
  nullText,
  minDate,
  maxDate,
  input: { value, onChange, ...inputRest }, // value为moment实例
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
          <CustomInput
            label={label}
            canClear={canClear}
            onInputChange={onChange}
            nullText={nullText}
            input={inputRest}
            meta={meta}
          />
        }
        showTimeSelect={showTime}
        todayButton={todayBtnText}
        timeFormat="HH:mm"
        dateFormat="YYYY-MM-DD"
        selected={value} // value是input.value
        onChange={onChange}
        showYearDropdown
        showMonthDropdown
        yearDropdownItemNumber={100} // 设置合适的数值，这个要不然得一个一个点，不方便
        minDate={minDate ? moment(minDate) : moment('1970-01-01')}
        maxDate={maxDate ? moment(maxDate) : moment()}
        scrollableYearDropdown
      />
    </div>
  );
};

RenderDatePicker.propTypes = {
  showTime: PropTypes.bool, // 是否可以选择时间
  todayBtnText: PropTypes.string, // ''表示不显示todaybtn，today要在min maxdate范围内
  nullText: PropTypes.string, // 当选择为空时，文本框显示的文字
  canClear: PropTypes.bool, // custom input 右侧在有时间的时候是否显示清除按钮
  label: PropTypes.string, // textfield显示的提示文字
  minDate: PropTypes.string, // 日期选择范围
  maxDate: PropTypes.string
};

RenderDatePicker.defaultProps = {
  nullText: '',
  todayBtnText: '',
  canClear: false
};

export default RenderDatePicker;
