import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../../assets/css/datePicker.css';
// import TextField from '@material-ui/core/TextField';
import { withStyles, TextField } from '@material-ui/core';

const style = {
  custom: {
    fontSize: '2rem'
  }
};

class CustomInput extends React.PureComponent {
  render() {
    const {
      label,
      value,
      input, // 父组件datepicker传递过来的inputProps，为了实现touched变量
      meta: { touched, error }
    } = this.props;
    return (
      <TextField
        label={label}
        {...input}
        fullWidth
        error={!!(touched && error)}
        helperText={touched && error ? error : ' '}
        onClick={this.props.onClick}
        value={value} // 和react-datepicker 的selected值关联，不是redux-form的value
      />
    );
  }
}

class RenderDatePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    let initValue = props.input.value;
    this.state = {
      // date根据用户初始赋值转换为moment实例或者null，初始值可以为string或者unix时间戳
      // 数据库中统一保存为unix时间戳
      date:
        initValue === 0 || !!initValue // unix时间戳的0也是有意义的时间
          ? Number.isInteger(initValue)
            ? moment.unix(initValue)
            : moment(initValue)
          : null
    };
  }
  render() {
    const {
      showTime,
      label,
      minDate,
      maxDate,
      input: { value, onChange, ...inputRest }, //此处value用不到，只是为了排除它
      meta
    } = this.props;
    return (
      <div style={style.custom}>
        <DatePicker
          customInput={
            <CustomInput label={label} input={inputRest} meta={meta} />
          }
          showTimeSelect={showTime}
          timeFormat="HH:mm"
          dateFormat="YYYY-MM-DD"
          selected={this.state.date}
          onChange={value => {
            console.log(value, value.unix());
            this.setState({ date: value }); // 只更新本地state，影响控件显示
            // 发送变化到form的value 数据库保存的是unix时间戳
            onChange(value.unix());
          }}
          showYearDropdown
          showMonthDropdown
          yearDropdownItemNumber={100} // 设置合适的数值，这个要不然得一个一个点，不方便
          minDate={minDate ? moment(minDate) : null}
          maxDate={maxDate ? moment(maxDate) : null}
          scrollableYearDropdown
        />
      </div>
    );
  }
}
RenderDatePicker.propTypes = {
  showTime: PropTypes.bool,
  label: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string
};

export default withStyles(style)(RenderDatePicker);
