import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({_id,title:existingTitle
    ,description:existingDescription
    ,price:existingPrice,
    images:existingImages,
    category: existingCategory,
    properties:assignedProperties,
}){
    const [title,setTitle] = useState(existingTitle || '');
    const [description,setDescription] = useState(existingDescription || '');
    const [price,setPrice] = useState(existingPrice || '');
    const [images,setImages] = useState(existingImages || []);
    const [isUploading,setIsUploading] = useState(false);
    const [categories,setCategories] = useState([]);
    const [category,setCategory] = useState(existingCategory || '');
    const [productProperties,setProductProperties] = useState(assignedProperties || {});

    // Fetch categories
    useEffect(() => {
      axios.get('/api/categories').then(result => {
        setCategories(result.data);
      })
    },[])

    // To navigate to products page after adding product
    const [goToProducts,setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev){
        ev.preventDefault();
        const data  = {title,description,price,_id,images,category};
        if(_id){
          // UPDATE PRODUCT
          await fetch('/api/products',{method: 'PATCH',body: JSON.stringify(data)});
        }else{
          // ADD PRODUCT
          await axios.post('/api/products',data);
        }
        setGoToProducts(true);
    }

    if(goToProducts){
      router.push('/products')
    }
    const links=[]
    async function uploadImages(ev){
      const files = ev.target?.files;
      if(files?.length > 0){
        setIsUploading(true);
        const data  = new FormData();
        for(const file of files){
          data.append('file',file);
          data.append('upload_preset','oxb08z5s');
        }
        try {
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dnh8ucfqd/image/upload',
            data
          );
          const url = await response.data.url;
          links.push(url);
          setImages(oldImages => {
            return [...oldImages, ...links];
          })
          setIsUploading(false);
        } catch (error) {
          console.error(error);
        }
      }
    }

    function updateImagesOrder(){
      setImages(images);
    }

    function setProductProp(propName,value) {
      setProductProperties(prev => {
        const newProductProps = {...prev};
        newProductProps[propName] = value;
        return newProductProps;
      });
    }

    // Adding properties of Parent Category to Child Category
    const propertiesToFill =[];
    if(categories.length>0 && category){
      let catInfo = categories.find(({_id}) => _id === category);
      propertiesToFill.push(...catInfo.properties);
      while(catInfo?.parent?._id){
        const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
        propertiesToFill.push(...parentCat.properties);
        catInfo = parentCat;
      }
    }

  return (
        <form onSubmit={saveProduct}>
          
            <label>Product Name</label>
            <input type="text" placeholder='Product Name'
            value={title} onChange={ev => setTitle(ev.target.value)}/>

            <label>Category</label>
            <select value={category} 
            onChange={ev => setCategory(ev.target.value)}
            >
              <option value="">Uncategorized</option>
              {categories.length>0 && categories.map(c => (
                <option value={c._id}>{c.name}</option>
              ))}
            </select>

            {/* Adding properties of Parent Category to Child Category */}
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
              <div key={p.name} className="">
              <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
              <div>
                <select value={productProperties[p.name]}
                        onChange={ev =>
                          setProductProp(p.name,ev.target.value)
                        }
                >
                  {p.values.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            ))}

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
              
              <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
              {!!images?.length && images.map(link =>(
                <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                  <img src={link} alt="" className="rounded-lg max-xs max-w-xs"/>
                </div>
              ))}
              </ReactSortable>
              
              {isUploading && (
                <div className="h-24 flex items-center">
                  <Spinner />
                </div>
              )}
              <label className="cursor-pointer w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
              </svg>
              <div>Add Image</div>
              <input type="file" onChange={uploadImages} className="hidden"/>
              </label>
            </div>


            <label>Description</label>
            <textarea placeholder='Description'
            value={description} onChange={ev => setDescription(ev.target.value)}></textarea>

            <label>Price</label>
            <input type="number" placeholder='Price'
            value={price} onChange={ev => setPrice(ev.target.value)}/><br /><br />

            <button className='btn-primary' type='submit'>Save</button>
        </form>
  )
}