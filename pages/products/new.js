import React from 'react'
import Layout from '../../components/Layout'

const NewProduct = () => {
  return (
    <Layout>
        <h1>New Product</h1>
        <input type="text" placeholder='Product Name'/>
        <textarea placeholder='Description'></textarea>
        <input type="number" placeholder='Price'/>
        <button className='btn-primary'>Save</button>
    </Layout>
  )
}

export default NewProduct
