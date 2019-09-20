import React from 'react'
import { Button, Header, Image, Modal, Grid } from 'semantic-ui-react'
import ItemImage from 'images/image.png'

class OrderDetailedModal extends React.Component {
  render() {
    return (
        <Modal className="productmodal" trigger={<Button positive>Details</Button>} centered={false}>
            <Modal.Header>OrderInfo</Modal.Header>
            <Modal.Content image>
                <Grid>
                    <Grid.Column width={4}>
                        <Image wrapped size='massive' src={ItemImage}/>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Modal.Description>
                            <Header>Order details</Header>
                            <p as='h5'>Product Name: {this.props.info.order.name}</p>
                            <p as='h5'>Price: {this.props.info.order.price} ETH</p>
                            <p as='h5'>Seller: {this.props.info.order.seller}</p>

                            <p as='h5'>Arbiter: {this.props.info.escrow.arbiter}</p>
                            <p as='h5'>Release amount: {this.props.info.escrow.releaseAmount}</p>
                            <p as='h5'>Refund amount: {this.props.info.escrow.refundAmount}</p>
                            <p as='h5'>Funds disbursed: {this.props.info.escrow.fundsDisbursed}</p>
                            <p as='h5'>Escrow state: {this.props.info.escrow.state}</p>
                        </Modal.Description>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button positive icon='checkmark' labelPosition='right' content='Buy' />
            </Modal.Actions>
        </Modal>
    );
  }
}

export default OrderDetailedModal;