import React, { Component } from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'react-datepicker/dist/react-datepicker.1.css';
// import TextField from '@material-ui/core/TextField';
import { withStyles, TextField } from '@material-ui/core';

const style = {
  custom: {
    fontSize: '2rem'
  }
};

class renderDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.initDate ? props.initDate : '1970-01-01'
    };
  }

  render() {
    const { label, time, input, meta, ...rest } = this.props;
    input.onChange(this.state.date);
    const dateInput = (
      <TextField
        label={label}
        InputProps={{ readOnly: true }}
        {...input}
        // value={this.state.date}
        {...meta}
        {...rest}
      />
    );
    return (
      <div style={style.custom}>
        fsafdsaf----
        <span>2222</span>
        <DayPickerSingleDateControllerWrapper
          onOutsideClick={action(
            'DayPickerSingleDateController::onOutsideClick'
          )}
          onPrevMonthClick={action(
            'DayPickerSingleDateController::onPrevMonthClick'
          )}
          onNextMonthClick={action(
            'DayPickerSingleDateController::onNextMonthClick'
          )}
          numberOfMonths={1}
          renderMonthElement={({ month, onMonthSelect, onYearSelect }) => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div>
                <select
                  value={month.month()}
                  onChange={e => {
                    onMonthSelect(month, e.target.value);
                  }}
                >
                  {moment.months().map((label, value) => (
                    <option value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={month.year()}
                  onChange={e => {
                    onYearSelect(month, e.target.value);
                  }}
                >
                  <option value={moment().year() - 1}>Last year</option>
                  <option value={moment().year()}>{moment().year()}</option>
                  <option value={moment().year() + 1}>Next year</option>
                </select>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}
withStyles;
export default withStyles(style)(renderDatePicker);
