import React from 'react'
import { Button, Header, Image, Modal, Grid } from 'semantic-ui-react'
import ItemImage from 'images/image.png'

class UserDetailedModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            open:false
        };
    }

  close = () => this.setState({ open: false })
  onopen = () => this.setState({ open: true })
  render() {
    const { open } = this.state
    return (
        <Modal open={open} onClose={this.close} className="productmodal" trigger={<Button onClick={() => this.onopen()} positive>Details</Button>} centered={false}>
            <Modal.Header>UserInfo</Modal.Header>
            <Modal.Content image>
                <Grid>
                    <Grid.Column width={4}>
                        <Image wrapped size='massive' src={ItemImage} className="col-md-4"/>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Modal.Description className="col-md-8">
                            <Header>User details</Header>
                            <p as='h5'>Name: {this.props.info.name}</p>
                            <p as='h5'>Email: {this.props.info.email}</p>
                            <p as='h5'>Address: {this.props.info.address}</p>
                            <p as='h5'>User Type: {this.props.info.userType}</p>
                            <p as='h5'>User State: {this.props.info.userState}</p>
                        </Modal.Description>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button positive icon='checkmark' labelPosition='right' content='Close' onClick={() => this.close()}/>
            </Modal.Actions>
        </Modal>
    );
  }
}

export default UserDetailedModal;