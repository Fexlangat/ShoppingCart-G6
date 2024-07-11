// import React from "react";

// function Dashboard() {
//   return (
//     <>
//       <form action="">
//         <input type="text" id="search-input" placeholder="search for images" />
//         <button id="search-button">Search...</button>
//       </form>

//       <h5>We deal with products of various varieties &#128515;</h5>

//       <div className="images">
//         <div className="image">
//           <img
//             className="img-fluid"
//             src="https://images.unsplash.com/photo-1557825835-b4527f242af7?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRhYmxldHxlbnwwfHwwfHx8MA%3D%3D"
//             alt="tab"
//           />
//           <p className="text-center text-primary">Tablets</p>
//         </div>

//         <div className="image">
//           <img
//             className="img-fluid"
//             src="https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBob25lc3xlbnwwfHwwfHx8MA%3D%3D"
//             alt="src2"
//           />
//           <p className="text-center text-primary">Phones</p>
//         </div>

//         <div className="image">
//           <img
//             className="img-fluid"
//             src="https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRhYmxldHxlbnwwfHwwfHx8MA%3D%3D"
//             alt="src"
//           />
//           <p className="text-center text-primary">Phones</p>
//         </div>

//         <div className="image">
//           <img
//             className="img-fluid"
//             src="https://images.unsplash.com/photo-1609252925148-b0f1b515e111?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBob25lc3xlbnwwfHwwfHx8MA%3D%3D"
//             alt="src3"
//           />
//           <p className="text-center text-primary">Phones</p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;








import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: null });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewProduct({ ...newProduct, [name]: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchProducts();
      setNewProduct({ name: '', price: '', image: null });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('price', editingProduct.price);
    if (editingProduct.image) {
      formData.append('image', editingProduct.image);
    }

    try {
      const response = await fetch(`http://localhost:5000/products/${editingProduct.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          accept="image/*"
        />
        <button type="submit">Add Product</button>
      </form>

      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id || product._id}>
              {editingProduct && editingProduct.id === product.id ? (
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    required
                  />
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => setEditingProduct({...editingProduct, image: e.target.files[0]})}
                    accept="image/*"
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  {product.name} - ${product.price}
                  {product.image && <img src={product.image} alt={product.name} style={{width: '50px', height: '50px'}} />}
                  <button onClick={() => setEditingProduct(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id || product._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
        #128515
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
