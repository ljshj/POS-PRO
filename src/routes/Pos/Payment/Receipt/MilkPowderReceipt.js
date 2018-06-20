import React, { PureComponent } from 'react';
import { Card, Table, Row, Col } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'components/DescriptionList';
import styles from './index.less';


const { Description } = DescriptionList;

@connect(state => ({
  order: state.commodity.orders.filter(item => item.key === state.commodity.activeTabKey)[0],
  ID: state.commodity.orders.filter(item => item.key === state.commodity.activeTabKey)[0].ID,
}))

export default class Receipt extends PureComponent {
  calcTotalCount = () => {
    const { order } = this.props;
    const { selectedList = [] } = order;
    return selectedList.reduce((prev, current, index) => {
      if (index === 1) {
        return prev.Count || 0 + current.Count || 0;
      } else {
        return prev + current.Count || 0;
      }
    }, 0);
  }
  columns = [{
    title: '商品名',
    dataIndex: 'EN',
  }, {
    title: 'SKU',
    dataIndex: 'Sku',
  }, {
    title: '数量',
    dataIndex: 'Count',
  }, {
    title: '运单号',
    dataIndex: 'InvoiceNo',
  }]
  render() {
    const { order, milkPowderData } = this.props;
    const {
      SenderName,
      SenderPhoneNumber,
      ReceiverName,
      ReceiverPhoneNumber,
      ReceiverIDNumber,
      ReceiverAddress = {},
      ReceiverDetailedAddress,
    } = milkPowderData;
    const { City, District, Province } = ReceiverAddress;
    const { ID, createTime } = order;
    const { waybill = [] } = milkPowderData;
    const info = (
      <div>
        <div className={styles.subTitle}>订单信息</div>
        <Row className={styles.content}>
          <Col span={24}>
            <div className={styles.item}>
              <span>
                订单号
              </span>
              <span>
                {ID}
              </span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.item}>
              <span>
                下单时间
              </span>
              <span>
                {createTime}
              </span>
            </div>
          </Col>
        </Row>
        <div className={styles.subTitle}>商品信息</div>
        <Table
          size="small"
          columns={this.columns}
          dataSource={waybill}
          rowKey={record => record.Key}
          pagination={false}
        />
        <div className={styles.subTitle}>收件人信息</div>
        <Row className={styles.content}>
          <Col span={12}>
            <div className={styles.item}>
              <span>
          收件人
              </span>
              <span>
                {ReceiverName}
              </span>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.item}>
              <span>
          收件人电话
              </span>
              <span>
                {ReceiverPhoneNumber}
              </span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.item}>
              <span>
          收件人地址
              </span>
              <span>
                { City } { District } { Province } - { ReceiverDetailedAddress }
              </span>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.item}>
              <span>
          收件人身份证号
              </span>
              <span>
                {ReceiverIDNumber} (必须是收件人本人身份证)
              </span>
            </div>
          </Col>
        </Row>
        <div className={styles.subTitle}>寄件人信息</div>
        <Row className={styles.content}>
          <Col span={12}>
            <div className={styles.item}>
              <span>
          寄件人姓名
              </span>
              <span>
                {SenderName}
              </span>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.item}>
              <span>
          寄件人电话
              </span>
              <span>
                {SenderPhoneNumber}
              </span>
            </div>
          </Col>
        </Row>
      </div>
    );
    return (
      <div className={styles.milkPowderReceiptWrapper}>
        <div className={styles.title}>奶粉下单</div>
        <div className={styles.panel}>
          { info }
        </div>
        <div className={styles.panel}>
          { info }
          <div className={styles.subTitle}>请确认以上信息无误并签字</div>
          <Row className={styles.content}>
            <Col span={12} className={styles.item}>
              <span>
          客户签字
              </span>
              <span className={styles.underline} />
            </Col>
            <Col span={12} className={styles.item}>
              <span>
          日期
              </span>
              <span className={styles.underline} />
            </Col>
          </Row>
        </div>
        <div>
          <Row className={styles.content}>
            <Col span={12} className={styles.item}>
              <span>
          店铺编码
              </span>
              <span className={styles.underline} />
            </Col>
            <Col span={12} className={styles.item}>
              <span>
          信息录入人
              </span>
              <span className={styles.underline} />
            </Col>
            <Col span={12} className={styles.item}>
              <span>
          签名
              </span>
              <span className={styles.underline} />
            </Col>
            <Col span={12} className={styles.item}>
              <span>
          日期
              </span>
              <span className={styles.underline} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}