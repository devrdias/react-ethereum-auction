import React, { Component } from 'react'
import { Table, Button, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'

import Initial from '../../initialstate.json'

import * as CommonAction from 'components/common/CommonAction'
import { bindActionCreators } from 'redux'
class Orders extends Component {
  constructor(props) {
    super(props)

    this.state = {};
    if(this.props.store.user.data.myID){
      console.log("this.props.store.user.data.myID ", this.props.store.user.data.myID);
    }
  }

  render() {
    return(
      <main className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>Orders</h1>
            <Table celled structured>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell rowSpan='2'>No</Table.HeaderCell>
                  <Table.HeaderCell colSpan='3'>Product Info</Table.HeaderCell>
                  <Table.HeaderCell colSpan='8'>Escrow Info</Table.HeaderCell>
                  
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>

                  <Table.HeaderCell>Buyer</Table.HeaderCell>
                  <Table.HeaderCell>Arbiter</Table.HeaderCell>
                  <Table.HeaderCell>Seller</Table.HeaderCell>
                  <Table.HeaderCell>Escrow amount</Table.HeaderCell>
                  <Table.HeaderCell>Release count</Table.HeaderCell>
                  <Table.HeaderCell>Refund count</Table.HeaderCell>
                  <Table.HeaderCell>Funds disbursed</Table.HeaderCell>
                  <Table.HeaderCell>Escrow Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
              {this.props.common.escrowData.map((item, index) => {
                if( index > 0
                  && ((this.props.store.user.data.userType === "Buyer" && item.buyer_id == this.props.common.myID)
                      || (this.props.store.user.data.userType === "Seller" && item.seller_id == this.props.common.myID)
                      || (this.props.store.user.data.userType === "Arbiter" && item.arbiter_id == this.props.common.myID))
                  /*&& (item.fundsDisbursed == false)*/)
                //if(item.buyer_id == this.props.common.myID /*&& item.fundsDisbursed == false */)
                  //return ( <Table.Row key={item.id}>
                  return ( <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>

                            <Table.Cell>{this.props.common.productData[item.product_id].name}</Table.Cell>
                            <Table.Cell>{this.props.common.productData[item.product_id].price}</Table.Cell>
                            <Table.Cell>{this.props.common.productData[item.product_id].productState}</Table.Cell>
                            
                            <Table.Cell>{this.props.common.userData[item.buyer_id].name}</Table.Cell>
                            <Table.Cell>{this.props.common.userData[item.arbiter_id].name}</Table.Cell>
                            <Table.Cell>{this.props.common.userData[item.seller_id].name}</Table.Cell>
                            <Table.Cell>{item.amount}</Table.Cell>
                            <Table.Cell>{item.releaseCount}</Table.Cell>
                            <Table.Cell>{item.refundCount}</Table.Cell>
                            <Table.Cell>{item.fundsDisbursed? "Yes" : "No"}</Table.Cell>
                            <Table.Cell>
                              {!item.fundsDisbursed && <Button positive onClick={() => this.props.onClickRelease(item)}>Release</Button>}
                              {!item.fundsDisbursed && <Button color='orange' onClick={() => this.props.onClickRefund(item)}>Refund</Button>}
                              {(item.fundsDisbursed &&
                                item.amount > 0 &&
                                ((item.refundCount == 2 && this.props.store.user.data.userType === "Buyer") ||
                                (item.releaseCount == 2 && this.props.store.user.data.userType === "Seller"))) &&
                                <Button positive onClick={() => this.props.onClickWithdraw(item)}>Withdraw</Button>}
                            </Table.Cell>
                          </Table.Row> )})
              }
              </Table.Body>
            </Table>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = state => ({
  store: state,
  common: state.common.data
  //common: Initial
})

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(CommonAction, dispatch),
  // onClickRelease: (event) => {
  //   event.preventDefault();
  //   CommonAction.releaseEscrow()
  // }
  onClickRelease (item){
    console.log("release: ", item);
    dispatch(CommonAction.releaseEscrow(item));
  },
  onClickRefund (item){
    console.log("refund: ", item);
    dispatch(CommonAction.refundEscrow(item));
  },
  onClickWithdraw (item){
    console.log("withdraw: ", item);
    dispatch(CommonAction.withdrawEscrow(item));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Orders)
