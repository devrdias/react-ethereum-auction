import React, { Component } from 'react'
import { Item, Header } from 'semantic-ui-react'
import ItemImage from 'images/image.png'
import ItemModal from 'components/common/Modal'

class PItem extends Component {
    render() {
        console.log('track_pitem')
        console.log(this.props)
        return (
            <div>
                <Item.Group>
                    {
                        this.props.products.map((payload, index) => {
                            return(
                                <Item key={index}>
                                    <Item.Image size='small' src={ItemImage} />
                                    <Item.Content>
                                        <Item.Header><ItemModal product={payload}/></Item.Header>
                                        <Item.Description>
                                            <p as='h5'>Name: {payload.name}</p>
                                            <p as='h5'>Price: {payload.price} ETH</p>
                                            <p as='h5'>descLink: {payload.descLink}</p>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            )
                        })
                    }
                </Item.Group>
            </div>
        )
    }

}

export default PItem