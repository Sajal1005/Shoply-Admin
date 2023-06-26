import Layout from "../../../components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit product</h1>
      
    </Layout>
  );
}