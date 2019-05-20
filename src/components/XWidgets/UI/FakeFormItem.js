import React from 'react';
import classNames from 'classnames';
import Animate from 'rc-animate';
import { Icon } from 'antd';

export const FIELD_META_PROP = 'data-__meta';
export const FIELD_DATA_PROP = 'data-__field';
const prefixClass = 'ant-form';

function intersperseSpace(list) {
  return list.reduce((current, item) => [...current, ' ', item], []).slice(1);
}

/**
 * renders form item status like the antd's FormItem.
 */
export default class FakeFormItem extends React.PureComponent {
  getField() {
    return this.getChildProp(FIELD_DATA_PROP);
  }

  getHelpMessage() {
    const { help } = this.props;
    if (help === undefined && this.getOnlyControl()) {
      const { errors } = this.getField();
      if (errors) {
        return intersperseSpace(
          errors.map((e, index) => {
            let node = null;

            if (React.isValidElement(e)) {
              node = e;
            } else if (React.isValidElement(e.message)) {
              node = e.message;
            }

            return node ? React.cloneElement(node, { key: index }) : e.message;
          })
        );
      }
      return '';
    }
    return help;
  }

  getOnlyControl() {
    const child = this.getControls(this.props.children, false)[0];
    return child !== undefined ? child : null;
  }

  getControls(children, recursively) {
    let controls = [];
    const childrenArray = React.Children.toArray(children);
    for (let i = 0; i < childrenArray.length; i++) {
      if (!recursively && controls.length > 0) {
        break;
      }

      const child = childrenArray[i];
      if (
        child.type &&
        (child.type === FakeFormItem || child.type.displayName === 'FakeFormItem')
      ) {
        continue; // eslint-disable-line
      }
      if (!child.props) {
        continue; // eslint-disable-line
      }
      if (FIELD_META_PROP in child.props) {
        // And means FIELD_DATA_PROP in child.props, too.
        controls.push(child);
      } else if (child.props.children) {
        controls = controls.concat(this.getControls(child.props.children, recursively));
      }
    }
    return controls;
  }

  renderValidateWrapper(prefixCls, c1, c2, c3) {
    const { props } = this;
    const onlyControl = this.getOnlyControl;
    const validateStatus =
      props.validateStatus === undefined && onlyControl
        ? this.getValidateStatus()
        : props.validateStatus;

    let classes = `${prefixCls}-item-control`;
    if (validateStatus) {
      classes = classNames(`${prefixCls}-item-control`, {
        'has-feedback': props.hasFeedback || validateStatus === 'validating',
        'has-success': validateStatus === 'success',
        'has-warning': validateStatus === 'warning',
        'has-error': validateStatus === 'error',
        'is-validating': validateStatus === 'validating',
      });
    }

    let iconType = '';
    switch (validateStatus) {
      case 'success':
        iconType = 'check-circle';
        break;
      case 'warning':
        iconType = 'exclamation-circle';
        break;
      case 'error':
        iconType = 'close-circle';
        break;
      case 'validating':
        iconType = 'loading';
        break;
      default:
        iconType = '';
        break;
    }

    const icon =
      props.hasFeedback && iconType ? (
        <span className={`${prefixCls}-item-children-icon`}>
          <Icon type={iconType} theme={iconType === 'loading' ? 'outlined' : 'filled'} />
        </span>
      ) : null;

    return (
      <div className={classes}>
        <span className={`${prefixCls}-item-children`}>
          {c1}
          {icon}
        </span>
        {c2}
        {c3}
      </div>
    );
  }

  renderHelp(prefixCls) {
    const help = this.getHelpMessage();
    const children = help ? (
      <div className={`${prefixCls}-explain`} key="help">
        {help}
      </div>
    ) : null;
    if (children) {
      this.helpShow = !!children;
    }
    return (
      <Animate
        transitionName="show-help"
        component=""
        transitionAppear
        key="help"
        onEnd={this.onHelpAnimEnd}
      >
        {children}
      </Animate>
    );
  }

  renderExtra(prefixCls) {
    const { extra } = this.props;
    return extra ? <div className={`${prefixCls}-extra`}>{extra}</div> : null;
  }

  render() {
    const { children } = this.props;
    return this.renderValidateWrapper(
      prefixClass,
      children,
      this.renderHelp(prefixClass),
      this.renderExtra(prefixClass)
    );
  }
}
