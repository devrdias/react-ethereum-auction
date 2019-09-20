import React, { Component } from 'react'
import { Table, Button, Grid } from 'semantic-ui-react'
import OrderDetailedModal from './OrderDetailedModal'

class Orders extends Component {
  constructor(props) {
    super(props)

    this.state = {};
    this.state.datas = [{
      id: 100,
      order: {
        name: 'aaa',
        price: 100,
        condition: 'condition sjakdflsdf',
        seller: 'James',
        status: 'Pending'
      },
      escrow: {
        arbiter: 'arbigfdg',
        releaseAmount: 100,
        refundAmount: 98,
        fundsDisbursed: 'dsfsdfdsf',
        state: 'Pending'
      }
    }];
  }

  render() {
    return(
      <main className="container">
        <div className="row">
          <div className="col-md-12">
            <h3>Orders</h3>
            <Table celled structured>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell rowSpan='2'>No</Table.HeaderCell>
                  <Table.HeaderCell colSpan='5'>Order Info</Table.HeaderCell>
                  <Table.HeaderCell colSpan='5'>Escrow Info</Table.HeaderCell>
                  
                  <Table.HeaderCell rowSpan='2'></Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell>Product Name</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Condition</Table.HeaderCell>
                  <Table.HeaderCell>Seller</Table.HeaderCell>
                  <Table.HeaderCell>Order Status</Table.HeaderCell>

                  <Table.HeaderCell>Arbiter</Table.HeaderCell>
                  <Table.HeaderCell>Release amount</Table.HeaderCell>
                  <Table.HeaderCell>Refund amount</Table.HeaderCell>
                  <Table.HeaderCell>Funds disbursed</Table.HeaderCell>
                  <Table.HeaderCell>Escrow state</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
              {this.state.datas.map((item, index) => {
                return ( <Table.Row key={item.id}>
                          <Table.Cell>{index + 1}</Table.Cell>

                          <Table.Cell>{item.order.name}</Table.Cell>
                          <Table.Cell>{item.order.price}</Table.Cell>
                          <Table.Cell>{item.order.condition}</Table.Cell>
                          <Table.Cell>{item.order.seller}</Table.Cell>
                          <Table.Cell>{item.order.status}</Table.Cell>
                          
                          <Table.Cell>{item.escrow.arbiter}</Table.Cell>
                          <Table.Cell>{item.escrow.releaseAmount}</Table.Cell>
                          <Table.Cell>{item.escrow.refundAmount}</Table.Cell>
                          <Table.Cell>{item.escrow.fundsDisbursed}</Table.Cell>
                          <Table.Cell>{item.escrow.state}</Table.Cell>

                          <Table.Cell><OrderDetailedModal info={item}/></Table.Cell>
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

export default Orders
