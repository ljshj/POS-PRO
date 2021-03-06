import React, { PureComponent } from 'react';
import { Table, InputNumber, Icon, Popover, Divider } from 'antd';
import { formatToDecimals } from 'utils/utils';
import { calculateExpressOrShippingCost } from '../../../../utils/utils';
import SearchableSelect from './SearchableSelect';


export default class TableForm extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   const { totalWeight } = props;
  //   const dataSource = props.value.map(item => ({
  //     ...item,
  //     Weight: totalWeight,
  //     RealPrice: calculateExpressOrShippingCost(item.UnitPrice, totalWeight, item.WeightedWeight),
  //   })
  //   );
  //   this.state = {
  //     dataSource,
  //   };
  // }
  handleFieldChange = (e, fieldName, key) => {
    const data = this.props.value;
    const value = e && (e.target ? e.target.value : e);
    let newData = [];
    if (fieldName === 'Name') {
      const Name = { ID: value.ID, Name: value.Name };
      const UnitPrice = value.Price;
      newData = data.map((item) => {
        if (item.ID === key) {
          return { ...item, Name, UnitPrice };
        }
        return item;
      });
    } else {
      newData = data.map((item) => {
        if (item.ID === key) {
          return { ...item, [fieldName]: value };
        }
        return item;
      });
    }
    const shippingData = newData.map(item => ({
      ...item,
      RealPrice: calculateExpressOrShippingCost(item.UnitPrice, item.Weight, item.WeightedWeight, item.FreeWeight),
    }));
    this.props.dispatch({ type: 'commodity/changeShippingDataAndSumCost', payload: shippingData });
  }
  render() {
    const { express, value, dispatch } = this.props;
    const { expressList = [], loading } = express;
    const getCompany = () => dispatch({ type: 'express/getCompany' });
    const content = (
      <p style={{ width: 400 }}>
        包裹与商品的总重量不足 1kg 时，快递金额为该快递公司的单价，超过 1kg 时快递金额 = 总重量 * 快递单价
      </p>
    );
    const columns = [{
      title: '快递公司',
      dataIndex: 'Name',
      align: 'center',
      render: (text, record) => (
        <SearchableSelect
          fetchData={getCompany}
          onChange={e => this.handleFieldChange(e, 'Name', record.ID)}
          data={expressList}
          label="Name"
          value={text.ID}
          dispatch={dispatch}
          disabled={loading}
        />
      ),
    }, {
      title: '重量(kg)',
      dataIndex: 'Weight',
      align: 'center',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          precision={2}
          onChange={e => this.handleFieldChange(e, 'Weight', record.ID)}
        />
      ),
    }, {
      title: '加权重量(kg)',
      dataIndex: 'WeightedWeight',
      align: 'center',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          precision={2}
          onChange={e => this.handleFieldChange(e, 'WeightedWeight', record.ID)}
        />
      ),
    }, {
      title: '免邮重量',
      dataIndex: 'FreeWeight',
      align: 'center',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          precision={2}
          onChange={e => this.handleFieldChange(e, 'FreeWeight', record.ID)}
        />
      ),
    }, {
      title: '快递单价（元）',
      dataIndex: 'UnitPrice',
      align: 'center',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          precision={2}
          onChange={e => this.handleFieldChange(e, 'UnitPrice', record.ID)}
        />
      ),
    }, {
      title: (
        <span>
          包裹快递金额
          <Divider type="vertical" />
          <Popover
            title="包裹快递金额规则"
            content={content}
            trigger="hover"
            placement="top"
          >
            <Icon type="question-circle-o" />
          </Popover>
        </span>
      ),
      dataIndex: 'RealPrice',
      align: 'center',
      render: text => (
        <span>
          {
            formatToDecimals(text, 2)
          }
        </span>
      ),
    }];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={value}
          pagination={false}
          rowKey={record => record.ID}
          size="small"
        />
      </div>
    );
  }
}
