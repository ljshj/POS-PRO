import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import Cbutton from '../Cbutton';
import calculate from './logic/calculate';
import { POS_TAB_TYPE } from '../../../constant';
import Mousetrap from 'mousetrap';
import isNumber from '../isNumber';

import ReactDOM from 'react-dom';

// const numPad = [
//   {
//     key: '1',
//     label: '1',
//     keyboard: '1',
//   },
//   {
//     key: '2',
//     label: '2',
//     keyboard: '2',
//   },
//   {
//     key: '3',
//     label: '3',
//     keyboard: '3',
//   },
//   {
//     key: 'count',
//     label: '数量',
//     keyboard: 'q',
//   },
//   {
//     key: '4',
//     label: '4',
//     keyboard: '4',
//   },
//   {
//     key: '5',
//     label: '5',
//     keyboard: '5',
//   },
//   {
//     key: '6',
//     label: '6',
//     keyboard: '6',
//   },
//   {
//     key: 'discount',
//     label: '折扣',
//     keyboard: 'd',
//   },
//   {
//     key: '7',
//     label: '7',
//     keyboard: '7',
//   },
//   {
//     key: '8',
//     label: '8',
//     keyboard: '8',
//   },
//   {
//     key: '9',
//     label: '9',
//     keyboard: '9',
//   },
//   {
//     key: 'unitPrice',
//     label: '价格',
//     keyboard: 'p',
//   },
//   {
//     key: 'clear',
//     label: '清除',
//     keyboard: 'c',
//   },
//   {
//     key: '0',
//     label: '0',
//     keyboard: '0',
//   },
//   {
//     key: '.',
//     label: '.',
//     keyboard: '.',
//   },
//   {
//     key: 'del',
//     label: 'del',
//     keyboard: 'del',
//   },
// ]

// const actionPad = [
//   {
//     key: 'customer',
//     label: '客户',
//     keyboard: 'v',
//   },
//   {
//     key: 'payment',
//     label: '付款',
//     keyboard: 'enter',
//   }
// ]


class ChooseCalculator extends PureComponent {
  state = {
    numPad: [
      {
        key: '1',
        label: '1',
        keyboard: '1',
      },
      {
        key: '2',
        label: '2',
        keyboard: '2',
      },
      {
        key: '3',
        label: '3',
        keyboard: '3',
      },
      {
        key: 'count',
        label: '数量',
        keyboard: 'q',
      },
      {
        key: '4',
        label: '4',
        keyboard: '4',
      },
      {
        key: '5',
        label: '5',
        keyboard: '5',
      },
      {
        key: '6',
        label: '6',
        keyboard: '6',
      },
      {
        key: 'discount',
        label: '折扣',
        keyboard: 'd',
      },
      {
        key: '7',
        label: '7',
        keyboard: '7',
      },
      {
        key: '8',
        label: '8',
        keyboard: '8',
      },
      {
        key: '9',
        label: '9',
        keyboard: '9',
      },
      {
        key: 'unitPrice',
        label: '价格',
        keyboard: 'p',
      },
      {
        key: 'clear',
        label: '清除',
        keyboard: 'c',
      },
      {
        key: '0',
        label: '0',
        keyboard: '0',
      },
      {
        key: '.',
        label: '.',
        keyboard: '.',
      },
      {
        key: 'del',
        label: 'del',
        keyboard: 'del',
      },
    ],
    actionPad: [

      {
        key: 'customer',
        label: '客户',
        keyboard: 'v',
      },
      {
        key: 'payment',
        label: '付款',
        keyboard: 'enter',
      }
    ]
  }
  button = []
  componentDidMount() {
    this.state.numPad.forEach(item => {
      Mousetrap.bind(item.keyboard, () => {
        // this.button[item.key].querySelector('button').blur()
        // this.button[item.key].querySelector('button').focus()
        // this.button[item.key].querySelector('button').click()
        this.clickHandler(item.key)
      })
    })
    this.state.actionPad.forEach(item => {
      Mousetrap.bind(item.keyboard, () => {
        this.button[item.key].querySelector('button').blur()
        this.button[item.key].querySelector('button').focus()
        this.button[item.key].querySelector('button').click()
      })
    })
  }
  componentWillUnmount() {
    this.state.numPad.forEach(item => {
      Mousetrap.unbind(item.keyboard)
    })
    this.state.actionPad.forEach(item => {
      Mousetrap.unbind(item.keyboard)
    })
  }
  clickHandler = (buttonName) => {
    const { numPad, actionPad } = this.state
    const newNumPad = numPad.map(item => {
      if (item.key === buttonName) {
        return { ...item, dataClicked: null }
      } else { return item}
    })
    this.setState({numPad: newNumPad})
    let time = setTimeout(() => {
    const newNumPad = numPad.map(item => {
      if (item.key === buttonName) {
        return { ...item, dataClicked: 'true' }
      } else { return item }
    })
    this.setState({numPad: newNumPad})
    },0)
    // window.clearTimeout(time)
    calculate(this.props.commodity, this.props.dispatch, buttonName);
  }
  createActionPad = (orderType) => {
    const { actionPad } = this.state
    switch (orderType) {
      case POS_TAB_TYPE.ALLOCATEANDTRANSFER:
        return (
          <div>
            <Cbutton name="warehouse" clickHandler={this.clickHandler}>仓库</Cbutton>
            <Cbutton name="allocateAndTransfer" clickHandler={this.clickHandler}>发起调拨</Cbutton>
          </div>
        );
      default:
        return (
          <div>
            {
              actionPad.map(item => (
                <Cbutton
                  key={item.key}
                  name={item.key}
                  clickHandler={this.clickHandler}
                  ref={node => (this.button[item.key] = ReactDOM.findDOMNode(node))}
                >
                  {item.label}
                </Cbutton>
              ))
            }
            {/* <Cbutton name="customer" clickHandler={this.clickHandler}>客户</Cbutton>
            <Cbutton name="payment" clickHandler={this.clickHandler}>付款</Cbutton> */}
          </div>
        );
    }
  }
  render() {
    const { orders, activeTabKey } = this.props;
    const { numPad, actionPad } = this.state
    const currentOrder = Array.isArray(orders) && orders.filter(item => (item.key === activeTabKey))[0] || {};
    const orderType = currentOrder.type;
    const { selectedList = [], activeSelectedKey } = currentOrder;
    const selectedItem = selectedList.filter(item => item.Key === activeSelectedKey)[0] || {};
    const calculateType = selectedItem.CalculateType;
    return (
      <div className={styles.calcWrapper}>
        <div className={styles.actionPad}>
          {
            this.createActionPad(orderType)
          }
        </div>
        <div className={styles.numPad}>
          {
            numPad.map(item => {
              if (isNumber(item.key)) {
                return <Cbutton
                  key={item.key}
                  name={item.key}
                  clickHandler={this.clickHandler}
                  ref={node => (this.button[item.key] = ReactDOM.findDOMNode(node))}
                  dataClicked={item.dataClicked}
                >
                  {item.label}
                </Cbutton>
              } else {
                return <Cbutton
                  key={item.key}
                  datatype="string"
                  name={item.key}
                  clickHandler={this.clickHandler}
                  className={calculateType === item.key ? styles.activeButton : null}
                  ref={node => (this.button[item.key] = ReactDOM.findDOMNode(node))}
                  dataClicked={item.dataClicked}
                >
                  {item.label}
                </Cbutton>
              }
            })
          }
        </div>
      </div>
    );
  }
}
export default connect(state => ({
  commodity: state.commodity,
  activeTabKey: state.commodity.activeTabKey,
  orders: state.commodity.orders,
}))(ChooseCalculator);
