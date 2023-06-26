import React, { useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios';
import { useRouter } from 'next/router';

const NewProduct = () => {

    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [price,setPrice] = useState('');

    // To navigat to products page after adding product
    const [goToProducts,setGoToProducts] = useState(false);
    const router = useRouter();

    async function createProduct(ev){
        ev.preventDefault();
        const data  = {title,description,price};
        await axios.post('/api/products',data);
        setGoToProducts(true);
    }

    if(goToProducts){
      router.push('/products')
    }

  return (
    <Layout>
        <form onSubmit={createProduct}>
            <h1><u>New Product</u></h1><br/>

            <label>Product Name</label>
            <input type="text" placeholder='Product Name'
            value={title} onChange={ev => setTitle(ev.target.value)}/>

            <label>Description</label>
            <textarea placeholder='Description'
            value={description} onChange={ev => setDescription(ev.target.va)}></textarea>

            <label>Price</label>
            <input type="number" placeholder='Price'
            value={price} onChange={ev => setPrice(ev.target.value)}/><br /><br />

            <button className='btn-primary' type='submit'>Save</button>
        </form>
    </Layout>
  )
}

export default NewProduct
