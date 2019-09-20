import React, { Component } from 'react'
import { Grid, Segment, List, Header, Button, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import * as StoreAction from 'components/seller/StoreAction'
import { bindActionCreators } from 'redux'

var style = {
    overflowY: "scroll",
    maxHeight: "250px",
}

var styleproductcreate = {
    overflowY: "scroll",
    maxHeight: "400px",
}

var styleproductlist = {
    overflowY: "scroll",
    maxHeight: "800px",
}

class Store extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      name: '',
      email: '',
      storePicture: '',
      selectedman:'',
    }

    this.state.currentproduct = []

    this.state.product = {
        name: '',
        category: '',
        imageLink: '',
        descLink: '',
        startTime: '',
        price: '',
        ratioselected: {
            condition: '',
            state: ''
        },
        productCondition:['New' , 'Used'],
        productState: ['ForSale', 'Sold', 'Shipped', 'Received', 'Deleted'],
    }

    this.state.datas = []
  }

  componentDidMount() {
      var user = []
      this.props.common.data.userData.forEach((item, index) => {
        if(item.userType==="Arbiter"){
            user.push(item)
          }
      })
      this.setState({
          datas:user
      })
      var current_product = []
      this.props.common.data.productData.forEach((item, index) => {
            //if(item.store_id === this.props.common.data.myStoreID) 
            if(item.seller === this.props.user.data.myAddress) 
            {
                current_product.push(item)
            }
      })
      this.setState({
        currentproduct: current_product
      })
  }

  onInputChange(event) {
    let newState={};
    newState[event.target.id] = event.target.value;
    this.setState(newState)
  }

  onproductInputChange(event){
      const id = event.target.id;
      const value = event.target.value;
      let mem = this.state.product;
      mem[id] = value;
      this.setState({
          ...this.state.product,...mem
      })
  }

  onSelectChange(item, index) {
    this.setState({
        selectedman:item.address
    })
  }

  onRoleChange(event) {
    this.setState({
      userType: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.state.name.length < 2)
    {
      return alert('Please fill in your name.')
    }

    if(this.state.selectedman === ''){
        return alert('Please select admin')
    }

    // "id" : 1,
    // "storeAddress": "0xaaaaaaaaaaaaaaa",
    //// "name": "first store",
    //// "email": "fist@store.com",
    //// "arbiter": "0xbbbbbbbbbbb",
    //// "storeFrontImage": "storeFrontImage",
    // "balance": 5432.73,
    // "productCount": 2

    let data = {
        id: this.props.common.data.storeData.length,
        name: this.state.name,
        email: this.state.email,
        storeFrontImage: this.state.storePicture,
        arbiter  : this.state.selectedman
    };
    this.props.action.CreateStore(data)
  }

  handleSubmitProduct(event) {
        event.preventDefault()
        var _state = this.state.product.ratioselected.state;
        var s = 0;
        if(_state === "ForSale")            s = 0;
        else if(_state === "Sold")       s = 1;
        else if(_state === "Shipped")       s = 2;
        else if(_state === "Received")       s = 3;
        else if(_state === "Deleted")       s = 4;

        var _condition = this.state.product.ratioselected.condition;
        var c = 0;
        if(_state === "New")            c = 0;
        else if(_state === "Used")       c = 1;

        let data = {
            category: this.state.product.category,
            descLink: this.state.product.descLink,
            imageLink: this.state.product.imageLink,
            name: this.state.product.name,
            price: this.state.product.price,
            productCondition: c,
            productState: s,
            startTime: parseInt(this.state.product.startTime, 10),
        }
        let mem = this.state.currentproduct
        mem.push(data);
        this.setState({
            currentproduct: mem
        })
        this.props.action.CreateProduct(data)
  }

  onClickWithdraw(){
      alert('With Draw');
  }

  listrender(item, index){
    if(item.address === this.state.selectedman) {
        return (
            <List.Item active key={index} value='index' onClick={() => this.onSelectChange(item,index)}>
                <List.Content>
                    Name:{item.name}
                </List.Content>
                <List.Content>
                    Email:{item.email}
                </List.Content>
            </List.Item>
        )
    } else {
        return (
            <List.Item key={index} value='index' onClick={() => this.onSelectChange(item,index)}>
                <List.Content>
                    Name:{item.name}
                </List.Content>
                <List.Content>
                    Email:{item.email}
                </List.Content>
            </List.Item>
        )
    }
  }

  handleproductcondigionChange = (e, { value }) =>{
      if(e.target.name === 'productCondition') {
          let mem = this.state.product.ratioselected;
          mem.condition = value;
          this.setState({
            ...this.state.product.ratioselected,...mem
          })
      }
      if(e.target.name === 'productState'){
        let mem = this.state.product.ratioselected;
        mem.state = value;
        this.setState({
          ...this.state.product.ratioselected,...mem
        })
      }
  }

  productrender(item, indexa){
    if(item === 'productCondition') {
        return(
            <Form.Group inline key = {item}>
            <Header as='h5'>productCondition</Header>
            {this.state.product.productCondition.map((ritem, index) => {
                return(
                    <Form.Radio
                        key={index}
                        name={item}
                        id={ritem}
                        value={ritem}
                        label={ritem}
                        checked={ritem === this.state.product.ratioselected.condition}
                        onChange={this.handleproductcondigionChange}
                    />
                )
            })}
            </Form.Group>
        )      
    }
    if(item === 'productState') {
        return(
            <Form.Group inline key={item}>
            <Header as='h5'>productState</Header>
            {this.state.product.productState.map((ritem, index) => {
                return(
                    <Form.Radio
                        key={index}
                        name={item}
                        id={ritem}
                        value={ritem}
                        label={ritem}
                        checked={ritem === this.state.product.ratioselected.state}
                        onChange={this.handleproductcondigionChange}
                    />
                )
            })}
            </Form.Group>
        ) 
    }
    if(item === 'ratioselected') {
        return (<div key = {item}></div>)
    }
    return (
        <input key = {item} id={item} type="text" value={this.state.product[item]} onChange={this.onproductInputChange.bind(this)} placeholder={item} required/>
    )
  }

  render() {
      const pro = this.props.store.product
      if(this.props.common.data.myStoreID === 0){
        return(
        <main className="container" >
            <div className="row">
                <div className="col-md-12">
                    <Grid columns={3} divided>
                        <Grid.Row className="storeform">
                            <Grid.Column>
                            </Grid.Column>
                            <Grid.Column> 
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
                                            <fieldset>
                                                <input id="name" type="text" value={this.state.name} onChange={this.onInputChange.bind(this)} placeholder="Store Name" required/>
                                                <input id="email" type="email" value={this.state.email} onChange={this.onInputChange.bind(this)} placeholder="Email" required/>
                                                <input id="storePicture" type="text" value={this.state.storePicture} onChange={this.onInputChange.bind(this)} placeholder="front Image" required/>
                                                <br/>
                                                <button type="submit" className="pure-button pure-button-primary">Create Store</button>
                                            </fieldset>
                                        </form>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment className='storeseg'>
                                            <List divided style={style} selection>
                                                {this.state.datas.map((item, index) => {
                                                    return(
                                                        this.listrender(item, index)
                                                    )
                                                })}
                                            </List>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            </Grid.Column>
                            <Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        </main>
        )
    }
    else { 
        return(
            <main className="container" >
                <div className="row">
                    <div className="col-md-12 storestore">
                        <Grid>
                            <Grid.Column  width="3">
                            </Grid.Column>
                            <Grid.Column  width="3">
                                <Header as='h3'>Store Dashboard</Header>
                                <Segment className='storeseg' style={style}>
                                    <Header as='h5'>Name:{this.props.common.data.storeData[this.props.common.data.myStoreID].name}</Header>
                                    <Header as='h5'>Email:{this.props.common.data.storeData[this.props.common.data.myStoreID].email}</Header>
                                    <Header as='h5'>Picture:{this.props.common.data.storeData[this.props.common.data.myStoreID].storeFrontImage}</Header>
                                    <Header as='h5'>Arbiter:{this.props.common.data.storeData[this.props.common.data.myStoreID].arbiter}</Header>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column  width="3">
                                <Header as='h3'>Create Product</Header>
                                <Segment className='storeseg' style={styleproductcreate}>
                                    <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmitProduct.bind(this)}>
                                        <fieldset>
                                            {Object.keys(this.state.product).map((key, index) => {
                                                return(
                                                    this.productrender(key)
                                                )
                                            })}
                                            <br/>
                                            <button type="submit" className="pure-button pure-button-primary">Create Product</button>
                                        </fieldset>
                                    </form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column  width="3" className="storelist">
                                <Header as='h3'>Product List</Header>
                                <Segment className='storeseg' style={styleproductlist}>
                                    <List divided selection>
                                        {
                                            
                                        //     this.props.common.data.productData.forEach((item, index) => {
                                        //         if(item.store_id === this.props.common.data.myStoreID) {
                                        //             current_product.push(item)
                                        //         }
                                        //   })
                                          
                                          this.state.currentproduct.map((key, index) => {
                                            return(
                                                <List.Item active key={index}>
                                                    <List.Content>
                                                        Name:{key.name}
                                                    </List.Content>
                                                    <List.Content>
                                                        Price:{key.price} ETH
                                                    </List.Content>
                                                </List.Item>
                                            )
                                        })}
                                    </List>    
                                </Segment>
                            </Grid.Column>
                            <Grid.Column  width="3">
                            </Grid.Column>
                        </Grid>
                    </div>
                </div>
            </main>
        )
    }
  }
}

const mapStateToProps = state => ({
    store: state.store,
    common: state.common,
    user:state.user
})
  
const mapDispatchToProps = dispatch => ({
    action: bindActionCreators(StoreAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Store)

