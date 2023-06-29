import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){
    const [name,setName] = useState('');
    const [parentCategory,setParentCategory] = useState('');
    const [categories,setCategories] = useState([]);
    const [editedCategory,setEditedCategory] = useState(null);
    const [properties,setProperties] = useState([]);
    
    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    async function saveCategory(ev){
        ev.preventDefault();
        const data = {name,
            parentCategory,
            properties: properties.map(p => ({
                name:p.name,
                values:p.values.split(','),
            }))
        };
        // Edit Category
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories',data);
            // To create new categories again
            setEditedCategory(null);
        }else{
            // New Category
            await axios.post('/api/categories',data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    useEffect(() => {
        fetchCategories();
    },[])

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
          }))
          );
    }

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
          }).then(async result => {
            if (result.isConfirmed) {
              const {_id} = category;
              await axios.delete('/api/categories?_id='+_id);
              fetchCategories();
            }
          });
    }

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'',values:''}];
        })
    }

    function handlePropertyName(index,property,newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValues(index,property,newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            })
        })
    }
    
    return (
        <Layout>

            <h1>Categories</h1>
            <label>
                {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}
            </label>
            
            <form onSubmit={saveCategory}>
                
                <div className="flex gap-1">
                    <input type="text" placeholder="Category name" value={name} onChange={ev => setName(ev.target.value)}/>
                    <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                        <option value="0">No parent category</option>
                        {categories.length>0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button type="button" 
                    className="btn-default text-sm mt-0.5 mb-0.5"
                    onClick={addProperty}>
                        Add new property
                    </button>
                    {properties.length>0 && properties.map((property,index) => (
                        <div className="flex gap-1 mt-2">
                            
                            <input type="text" 
                            className="mb-0"
                            value={property.name}
                            onChange={(ev) => handlePropertyName(index,property,ev.target.value)}
                            placeholder="Property name (Ex : color)"/>
                            
                            <input type="text"
                            className="mb-0"
                            onChange={(ev) => handlePropertyValues(index,property,ev.target.value)} 
                            value={property.values}
                            placeholder="Values, comma seperated"/>

                            <button 
                            type="button"
                            onClick={() => removeProperty(index)}
                            className="btn-default mb-0">
                                Remove
                            </button>

                        </div>
                    ))}
                </div>

                <div className="flex gap-1">
                    {editedCategory && (
                        <button 
                        type="button"
                        onClick={() => {setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                        }
                        }
                        className="btn-default">Cancel</button>
                    )}
                </div>
                
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>

            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td> 
                        <td>Parent Category</td>
                        <td></td> 
                    </tr>
                </thead>

                <tbody>
                    {categories.length>0 && categories.map(category => (
                        <tr>
                          <td>{category.name}</td>  
                          <td>{category?.parent?.name}</td>
                          <td className="flex-row items-right">
                                <button 
                                onClick={() => editCategory(category)} 
                                className="btn-primary mr-1">
                                    Edit
                                </button>
                                <button 
                                onClick={() => deleteCategory(category)}
                                className="btn-primary mr-1">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            
        </Layout>
    )
} 


export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
  )); 
