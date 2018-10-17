import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ExperienceForm from '../../forms/account/ExperienceForm';
import compose from 'recompose/compose';
import { actions as accountActions } from '../../reducers/account';
import { syncCheckExpDate } from '../../services/validate';
import { SubmissionError } from 'redux-form';

class InfoExp extends PureComponent {
  componentDidMount() {
    const { exps, dispatch, type } = this.props;
    console.log('mount exp info ', type);
    if (!exps) {
      // store中的account info exp(work or education)还没有获取或者为空，在页面加载的时候获取一次
      dispatch(accountActions.getExpInfo(type));
    }
  }

  handleSubmit = values => {
    console.log(JSON.stringify(values));
    const validateResult = syncCheckExpDate(values);
    if (validateResult) {
      throw new SubmissionError(validateResult);
    }
    return new Promise(resolve => {
      this.props.dispatch(
        accountActions.setExpInfoRequest(resolve, this.props.type, values.exps)
      );
    });
  };
  render() {
    const { type, exps } = this.props;
    return (
      <div>
        <ExperienceForm
          form={`${type}ExpForm`}
          enableReinitialize
          onSubmit={this.handleSubmit}
          initialValues={{ exps }}
        />
      </div>
    );
  }
}

InfoExp.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    exps: state.account.info[ownProps.type]
  };
}

export default compose(connect(mapStateToProps))(InfoExp);
