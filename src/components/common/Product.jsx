import React, { Component } from 'react'
import { Grid, Menu, Segment, Header, Pagination } from 'semantic-ui-react'
import PItem from 'components/common/Item'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

var style = {
  overflowY: "scroll",
  maxHeight: "490px",
}

class Product extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      activeItem: '',
      products: [],
    }
  }

  componentDidMount() {
    console.log('track_componentDidMount')
    this.props.store.common.data.productData.forEach((item, index) => {
      //console.log(['asdfasd',item])
      if(index == 0)  return false;
      const cat = item.category
      if(cat === undefined){}
      else if(this.state.categories.indexOf(cat) > -1) {}
      else {
        this.state.categories.push(cat)
      }
    })
    this.setState({activeItem: this.state.categories[0]})
    
    this.setState({products: this.props.store.common.data.productData.filter((item, index) =>{
      if(index == 0)  return false;
      if(item.category === this.state.categories[0]) return true;
      else return false
    })})
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    this.setState({products: this.props.store.common.data.productData.filter((item, index) =>{
      if(index == 0)  return false;
      if(item.category === name ) return true;
      else return false
    })})
  }

  FilterProductData() {
    
  }

  render() {
    console.log('track_90')
    console.log(this.props)
    console.log(this.state)
    const { activeItem } = this.state

    return (
      <Grid className="product">
        <Grid.Column width={4}>
          <Header as='h3'>Categories</Header>
          <Menu fluid vertical tabular>
            {this.state.categories.map((item, index) => {
                return(
                  <Menu.Item key={index} name={item} active={activeItem === item} onClick={this.handleItemClick}/>
                )
            })}
          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={12} style={style}>
          <Segment>
            <Header as='h3'>Products</Header>
            <PItem products={this.state.products}/>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  store: state
})

const mapDispatchToProps = dispatch => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(Product)