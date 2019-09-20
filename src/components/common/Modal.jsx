import React from 'react'
import { Button, Header, Image, Modal, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ItemImage from 'images/image.png'
import * as CommonAction from 'components/common/CommonAction'

class ItemModal extends React.Component {
  constructor(props) {
    super(props)
  }

  renderButton() {
    // if(this.props.store.user.data.userType === ''){
    //   //alert('here')
    //   return (
    //     <Button positive labelPosition='right' content='Cancel'/>
    //   )
    // }

    //return <Button labelPosition='right' content='Buy'/>

    if(this.props.store.user.data.userType === 'Buyer')
    {
      //alert('here')
      //return <Button positive labelPosition='right' content='Buy'/>
      return <Button onClick={()=>this.buyProduct()} positive content="Buy"></Button>
    }
    
    // <Button onClick={this.close} positive content="Release"></Button>
    // <Button onClick={this.close} negative content="Redund"></Button>
    // <Button positive icon='checkmark' labelPosition='right' content='BUY' />
  }

  buyProduct(){
    // console.log(this.props.product);
    // alert(this.props.product);
    // let item = this.props.product;
    this.props.onClickBuy(this.props.product);
  }


  render() {
    console.log('track_modal')
    console.log(this.props)
    return (
      <div>
        <Modal className="productmodal" trigger={<Button className="productname">Show Details</Button>} centered={false}>
            <Modal.Header>Product details</Modal.Header>
            <Modal.Content image>
                <Image wrapped size='medium' src={ItemImage} />
                <Modal.Description>
                    <p as='h5'>Name: {this.props.product.name}</p>
                    <p as='h5'>Price: {this.props.product.price} ETH</p>
                    <p as='h5'>DescLink: {this.props.product.descLink}</p>
                    <p as='h5'>ProductCondition: {this.props.product.productCondition}</p>
                    <p as='h5'>ProductState: {this.props.product.productState}</p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              {
                this.renderButton()
              }
            </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state
})

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(CommonAction, dispatch),
  onClickBuy (item){
    console.log("to buy: ", item);
    if(item.productState != "ForSale")
      return alert("Already Purchased!");
    //alert(item);
    dispatch(CommonAction.buyProduct(item));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemModal)