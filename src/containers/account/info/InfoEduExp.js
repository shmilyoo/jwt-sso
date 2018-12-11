import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import EduExpForm from '../../../forms/account/EduExpForm';
import compose from 'recompose/compose';
import { actions as accountActions } from '../../../reducers/account';
import { syncCheckExpDate } from '../../../services/validate';
import { SubmissionError } from 'redux-form';

class InfoEduExp extends PureComponent {
  componentDidMount() {
    const { exps, dispatch } = this.props;
    if (!exps) {
      // store中的account info exp(work or education)还没有获取或者为空，在页面加载的时候获取一次
      dispatch(accountActions.getExpInfo('edu'));
    }
  }

  handleSubmit = values => {
    const validateResult = syncCheckExpDate(values);
    if (validateResult) {
      throw new SubmissionError(validateResult);
    }
    return new Promise(resolve => {
      this.props.dispatch(
        accountActions.setExpInfoRequest(resolve, 'edu', values.exps)
      );
    });
  };
  render() {
    const { exps } = this.props;
    return (
      <div>
        <EduExpForm
          form={'eduExpForm'}
          enableReinitialize
          onSubmit={this.handleSubmit}
          initialValues={{ exps }}
        />
      </div>
    );
  }
}

InfoEduExp.propTypes = {};

function mapStateToProps(state) {
  return {
    exps: state.account.eduExp
  };
}

export default compose(connect(mapStateToProps))(InfoEduExp);
