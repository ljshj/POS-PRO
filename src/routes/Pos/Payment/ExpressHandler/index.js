import React, { PureComponent } from 'react';
import { Card, Form, Input, Row, Col, Cascader, Button, Icon, Popover, Table } from 'antd';
import { connect } from 'dva';
import { Receipt } from 'components/BaseComponents';
import TableForm from './TableForm';
import FooterToolbar from '../../../../components/FooterToolbar';
import { POS_PHASE } from '../../../../constant';
import styles from './index.less';
import Print from 'rc-print';


const fieldLabels = {
  expressData: '邮寄包裹信息',
};

const keyboardMapping = ['backspace', 'p', 'enter'];

@connect(state => ({
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeTabKey)[0],
  activeTabKey: state.commodity.activeTabKey,
  express: state.express,
  submitLoading: state.loading.effects['commodity/submitOrder'],
}))


@Form.create({
  onFieldsChange(props, changedFields) {
  },
  mapPropsToFields(props) {
    const { order } = props;
    const { expressData } = order || [];
    const newExpressData = {
      value: expressData,
    };
    return {
      expressData: Form.createFormField(newExpressData),
    };
  },
})

export default class ExpressHandler extends PureComponent {
  state = {
    printInfo: {},
  }
  componentDidMount() {
    Mousetrap.bind('backspace', () => this.prevHandler());
    Mousetrap.bind('p', () => this.printHandler());
    Mousetrap.bind('enter', () => this.validate());
  }
  componentWillUnmount() {
    keyboardMapping.forEach((item) => {
      Mousetrap.unbind(item);
    });
  }
  prevHandler = () => {
    const activeTabKey = this.props.activeTabKey;
    const lastPhase = POS_PHASE.PAY;
    const targetPhase = POS_PHASE.TABLE;
    this.props.dispatch({ type: 'commodity/changePosPhase', payload: { activeTabKey, lastPhase, targetPhase } });
  }
  printHandler = () => {
    const print = this.generatePrint();
    this.setState({ printInfo: print }, () => {
      this.refs.printForm.onPrint();
    });
  }
  checkExpressData = (rule, value, callback) => {
    const isValid = value.reduce((prev, current) => {
      const { Name, InvoiceNo } = current;
      return prev && Name.ID && InvoiceNo;
    }, true);
    if (isValid) {
      callback();
    } else {
      callback('快递公司和运单号是必填的');
    }
    // if (value[0]) {
    //   const { Name, InvoiceNo } = value[0];
    //   if (Name && InvoiceNo) {
    //     callback();
    //     return;
    //   }
    //   callback('快递公司和运单号是必填的');
    // } else {
    //   callback();
    // }
  }
  generatePrint = () => {
    const { order = {} } = this.props;
    const print = {
      ID: order.ID,
      createTime: order.createTime,
      shop: order.shop,
      selectedList: order.selectedList,
      totalPrice: order.totalPrice,
      expressCost: order.expressCost,
      shippingCost: order.shippingCost,
      expressData: order.expressData,
      shippingData: order.shippingData,
      paymentData: order.paymentData,
      type: order.type,
      saleType: order.saleType,
    };
    return print;
  }
  valueHandler = (values) => {
    const { order = {} } = this.props;
    const { ID } = order;
    const { selectedList, ...restOrder } = order;
    // 构造打印对象
    const print = this.generatePrint();
    const newValues = { ...values, ...restOrder, waybill: selectedList, print };
    const valuesJson = JSON.stringify(newValues);
    const payload = {
      orderID: ID,
      dataJson: valuesJson,
    };
    this.props.dispatch({ type: 'commodity/submitOrder', payload });
  }
  validate = () => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.valueHandler(values);
      }
    });
  }
  render() {
    const { printInfo } = this.state;
    const { form, order, dispatch, submitLoading } = this.props;
    const { getFieldDecorator, getFieldsError } = form;
    const { expressData, receiveMoney, totalPrice } = order || [];
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };


    return (
      <div>
        <Print
          ref="printForm"
          title="门店出口/邮寄/代发"
        >
          <div style={{ display: 'none' }}>
            <div>
              <Receipt order={printInfo} />
            </div>
          </div>
        </Print>
        <Card title="邮寄包裹管理" bordered={false} style={{ marginBottom: 24 }} >
          {getFieldDecorator('expressData', {
            rules: [{ validator: this.checkExpressData }],
          })(
            <TableForm
              activeTabKey={this.props.activeTabKey}
              dispatch={dispatch}
              express={this.props.express}
              setFieldsValueCallback={this.props.form.setFieldsValue}
            />
          )}
        </Card>
        <FooterToolbar style={{ width: '100%' }} >
          {getErrorInfo()}
          <Button onClick={this.prevHandler}>返回</Button>
          <Button
            onClick={this.printHandler}
            disabled={!!(totalPrice - receiveMoney > 0)}
          >
            打印
          </Button>
          <Button
            type="primary"
            onClick={this.validate}
            loading={submitLoading}
            disabled={!!(totalPrice - receiveMoney > 0)}
          >
            提交
          </Button>
        </FooterToolbar>
      </div>
    );
  }
}

// export default connect(({ global, loading }) => ({
// }))(Form.create()(MilkPowderHandler));
