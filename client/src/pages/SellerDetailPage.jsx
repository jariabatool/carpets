// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import './AdminDetailPages.css';

// export default function SellerDetailPage() {
//   const { id } = useParams();
//   const [seller, setSeller] = useState(null);
//   const [activeTab, setActiveTab] = useState('products');
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     name: '',
//     email: '',
//     companyName: '',
//     businessStreet: '',
//     businessCity: '',
//     businessState: '',
//     businessZipCode: '',
//     businessCountry: '',
//     taxId: '',
//     businessPhone: '',
//     businessEmail: '',
//     isApproved: false
//   });

//   useEffect(() => {
//     fetchSellerDetails();
//   }, [id]);

//   const fetchSellerDetails = async () => {
//     try {
//       const [sellerRes, productsRes, ordersRes] = await Promise.all([
//         fetch(`/api/admin/sellers/${id}`),
//         fetch(`/api/admin/sellers/${id}/products`),
//         fetch(`/api/admin/sellers/${id}/orders`)
//       ]);

//       if (sellerRes.ok) {
//         const sellerData = await sellerRes.json();
//         setSeller(sellerData);
//         setEditFormData({
//           name: sellerData.name || '',
//           email: sellerData.email || '',
//           companyName: sellerData.companyName || '',
//           businessStreet: sellerData.businessAddress?.street || '',
//           businessCity: sellerData.businessAddress?.city || '',
//           businessState: sellerData.businessAddress?.state || '',
//           businessZipCode: sellerData.businessAddress?.zipCode || '',
//           businessCountry: sellerData.businessAddress?.country || '',
//           taxId: sellerData.taxId || '',
//           businessPhone: sellerData.businessPhone || '',
//           businessEmail: sellerData.businessEmail || '',
//           isApproved: sellerData.isApproved || false
//         });
//       }
//       if (productsRes.ok) setProducts(await productsRes.json());
//       if (ordersRes.ok) setOrders(await ordersRes.json());
//     } catch (error) {
//       console.error('Error fetching seller details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = () => {
//     setEditing(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEditFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await fetch(`/api/admin/sellers/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...editFormData,
//           businessAddress: {
//             street: editFormData.businessStreet,
//             city: editFormData.businessCity,
//             state: editFormData.businessState,
//             zipCode: editFormData.businessZipCode,
//             country: editFormData.businessCountry
//           }
//         }),
//       });

//       if (response.ok) {
//         const updatedSeller = await response.json();
//         setSeller(updatedSeller);
//         setEditing(false);
//         alert('Seller updated successfully');
//       } else {
//         const errorData = await response.json();
//         alert(errorData.message || 'Failed to update seller');
//       }
//     } catch (error) {
//       console.error('Error updating seller:', error);
//       alert('Error updating seller');
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditing(false);
//     // Reset form data to original values
//     if (seller) {
//       setEditFormData({
//         name: seller.name || '',
//         email: seller.email || '',
//         companyName: seller.companyName || '',
//         businessStreet: seller.businessAddress?.street || '',
//         businessCity: seller.businessAddress?.city || '',
//         businessState: seller.businessAddress?.state || '',
//         businessZipCode: seller.businessAddress?.zipCode || '',
//         businessCountry: seller.businessAddress?.country || '',
//         taxId: seller.taxId || '',
//         businessPhone: seller.businessPhone || '',
//         businessEmail: seller.businessEmail || '',
//         isApproved: seller.isApproved || false
//       });
//     }
//   };

//   const handleDeleteSeller = async () => {
//     if (window.confirm('Are you sure you want to delete this seller?')) {
//       try {
//         const response = await fetch(`/api/admin/sellers/${id}`, {
//           method: 'DELETE'
//         });
        
//         if (response.ok) {
//           alert('Seller deleted successfully');
//           window.location.href = '/admin/dashboard';
//         }
//       } catch (error) {
//         console.error('Error deleting seller:', error);
//       }
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         const response = await fetch(`/api/products/${productId}`, {
//           method: 'DELETE'
//         });
        
//         if (response.ok) {
//           alert('Product deleted successfully');
//           setProducts(products.filter(p => p._id !== productId));
//         }
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     }
//   };

//   const handleUpdateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const response = await fetch(`/api/admin/orders/${orderId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: newStatus })
//       });
      
//       if (response.ok) {
//         alert('Order status updated successfully');
//         // Refresh orders
//         const ordersRes = await fetch(`/api/admin/sellers/${id}/orders`);
//         if (ordersRes.ok) setOrders(await ordersRes.json());
//       }
//     } catch (error) {
//       console.error('Error updating order status:', error);
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (!seller) return <div>Seller not found</div>;

//   return (
//     <div className="admin-detail-page">
//       <div className="detail-header">
//         <h1>Seller Details</h1>
//         <div className="header-actions">
//           {!editing ? (
//             <button className="edit-btn" onClick={handleEditClick}>
//               Edit Seller
//             </button>
//           ) : (
//             <>
//               <button className="cancel-btn" onClick={handleCancelEdit}>
//                 Cancel
//               </button>
//               <button className="save-btn" onClick={handleEditSubmit}>
//                 Save Changes
//               </button>
//             </>
//           )}
//           <button className="delete-btn" onClick={handleDeleteSeller}>
//             Delete Seller
//           </button>
//         </div>
//       </div>

//       {editing ? (
//         <div className="edit-form-container">
//           <h3>Edit Seller Information</h3>
//           <form className="edit-form">
//             <div className="form-section">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="edit-name">Full Name *</label>
//                   <input
//                     type="text"
//                     id="edit-name"
//                     name="name"
//                     value={editFormData.name}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="edit-email">Email Address *</label>
//                   <input
//                     type="email"
//                     id="edit-email"
//                     name="email"
//                     value={editFormData.email}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="form-section">
//               <h4>Business Information</h4>
//               <div className="form-group">
//                 <label htmlFor="edit-companyName">Company Name *</label>
//                 <input
//                   type="text"
//                   id="edit-companyName"
//                   name="companyName"
//                   value={editFormData.companyName}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="edit-businessStreet">Street Address *</label>
//                 <input
//                   type="text"
//                   id="edit-businessStreet"
//                   name="businessStreet"
//                   value={editFormData.businessStreet}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="edit-businessCity">City *</label>
//                   <input
//                     type="text"
//                     id="edit-businessCity"
//                     name="businessCity"
//                     value={editFormData.businessCity}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="edit-businessState">State *</label>
//                   <input
//                     type="text"
//                     id="edit-businessState"
//                     name="businessState"
//                     value={editFormData.businessState}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="edit-businessZipCode">ZIP Code *</label>
//                   <input
//                     type="text"
//                     id="edit-businessZipCode"
//                     name="businessZipCode"
//                     value={editFormData.businessZipCode}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="edit-businessCountry">Country *</label>
//                   <input
//                     type="text"
//                     id="edit-businessCountry"
//                     name="businessCountry"
//                     value={editFormData.businessCountry}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="edit-taxId">Tax ID *</label>
//                   <input
//                     type="text"
//                     id="edit-taxId"
//                     name="taxId"
//                     value={editFormData.taxId}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="edit-businessPhone">Business Phone *</label>
//                   <input
//                     type="tel"
//                     id="edit-businessPhone"
//                     name="businessPhone"
//                     value={editFormData.businessPhone}
//                     onChange={handleEditChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="edit-businessEmail">Business Email</label>
//                 <input
//                   type="email"
//                   id="edit-businessEmail"
//                   name="businessEmail"
//                   value={editFormData.businessEmail}
//                   onChange={handleEditChange}
//                 />
//               </div>
//             </div>

//             <div className="form-section">
//               <h4>Account Status</h4>
//               <div className="form-group checkbox-group">
//                 <label htmlFor="edit-isApproved">
//                   <input
//                     type="checkbox"
//                     id="edit-isApproved"
//                     name="isApproved"
//                     checked={editFormData.isApproved}
//                     onChange={handleEditChange}
//                   />
//                   Approved Account
//                 </label>
//               </div>
//             </div>
//           </form>
//         </div>
//       ) : (
//         <div className="user-info-card">
//           <h2>{seller.name}</h2>
//           <p><strong>Email:</strong> {seller.email}</p>
//           <p><strong>Company:</strong> {seller.companyName}</p>
//           <p><strong>Business Phone:</strong> {seller.businessPhone}</p>
//           <p><strong>Tax ID:</strong> {seller.taxId}</p>
//           <p><strong>Status:</strong> {seller.isApproved ? 'Approved' : 'Pending'}</p>
//           <p><strong>Address:</strong> {seller.businessAddress?.street}, {seller.businessAddress?.city}, {seller.businessAddress?.state} {seller.businessAddress?.zipCode}, {seller.businessAddress?.country}</p>
//         </div>
//       )}

//       {/* Rest of the component (tabs for products and orders) remains the same */}
//       <div className="detail-tabs">
//         <button 
//           className={activeTab === 'products' ? 'active' : ''}
//           onClick={() => setActiveTab('products')}
//         >
//           Products ({products.length})
//         </button>
//         <button 
//           className={activeTab === 'orders' ? 'active' : ''}
//           onClick={() => setActiveTab('orders')}
//         >
//           Orders ({orders.length})
//         </button>
//       </div>

//       <div className="tab-content">
//         {activeTab === 'products' && (
//           <div className="products-section">
//             <h3>Products by {seller.name}</h3>
//             <div className="items-list">
//               {products.map(product => (
//                 <div key={product._id} className="item-card">
//                   <div className="item-info">
//                     <h4>{product.name}</h4>
//                     <p>Price: ${product.price}</p>
//                     <p>Stock: {product.stock}</p>
//                     <p>Category: {product.category}</p>
//                   </div>
//                   <div className="item-actions">
//                     <Link to={`/edit-product/${product._id}`} className="edit-btn">
//                       Edit
//                     </Link>
//                     <button 
//                       className="delete-btn"
//                       onClick={() => handleDeleteProduct(product._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {activeTab === 'orders' && (
//           <div className="orders-section">
//             <h3>Orders for {seller.name}'s Products</h3>
//             <div className="items-list">
//               {orders.map(order => (
//                 <div key={order._id} className="item-card">
//                   <div className="item-info">
//                     <h4>Order #{order.orderNumber}</h4>
//                     <p>Customer: {order.customerName}</p>
//                     <p>Total: ${order.totalAmount}</p>
//                     <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                     <p>Status: {order.status}</p>
//                   </div>
//                   <div className="item-actions">
//                     <select 
//                       value={order.status}
//                       onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="shipped">Shipped</option>
//                       <option value="delivered">Delivered</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                     <Link to={`/order/${order._id}`} className="view-btn">
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the auth context
import './AdminDetailPages.css';

export default function SellerDetailPage() {
  const { id } = useParams();
  const { authFetch } = useAuth(); // Get the authFetch function
  const [seller, setSeller] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    businessStreet: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    businessCountry: '',
    taxId: '',
    businessPhone: '',
    businessEmail: '',
    isApproved: false
  });
 const params = useParams();
 console.log("Route params:", params);

  useEffect(() => {
    fetchSellerDetails();
  }, [id]);

  const fetchSellerDetails = async () => {
    try {
      const [sellerRes, productsRes, ordersRes] = await Promise.all([
        authFetch(`/api/admin/sellers/${id}`),
        authFetch(`/api/admin/sellers/${id}/products`),
        authFetch(`/api/admin/sellers/${id}/orders`)
      ]);

      if (sellerRes.ok) {
        const sellerData = await sellerRes.json();
        setSeller(sellerData);
        setEditFormData({
          name: sellerData.name || '',
          email: sellerData.email || '',
          companyName: sellerData.companyName || '',
          businessStreet: sellerData.businessAddress?.street || '',
          businessCity: sellerData.businessAddress?.city || '',
          businessState: sellerData.businessAddress?.state || '',
          businessZipCode: sellerData.businessAddress?.zipCode || '',
          businessCountry: sellerData.businessAddress?.country || '',
          taxId: sellerData.taxId || '',
          businessPhone: sellerData.businessPhone || '',
          businessEmail: sellerData.businessEmail || '',
          isApproved: sellerData.isApproved || false
        });
      } else {
        console.error('Failed to fetch seller:', await sellerRes.json());
      }
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      } else {
        console.error('Failed to fetch products:', await productsRes.json());
      }
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      } else {
        console.error('Failed to fetch orders:', await ordersRes.json());
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await authFetch(`/api/admin/sellers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editFormData,
          businessAddress: {
            street: editFormData.businessStreet,
            city: editFormData.businessCity,
            state: editFormData.businessState,
            zipCode: editFormData.businessZipCode,
            country: editFormData.businessCountry
          }
        }),
      });

      if (response.ok) {
        const updatedSeller = await response.json();
        setSeller(updatedSeller);
        setEditing(false);
        alert('Seller updated successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update seller');
      }
    } catch (error) {
      console.error('Error updating seller:', error);
      alert('Error updating seller');
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    // Reset form data to original values
    if (seller) {
      setEditFormData({
        name: seller.name || '',
        email: seller.email || '',
        companyName: seller.companyName || '',
        businessStreet: seller.businessAddress?.street || '',
        businessCity: seller.businessAddress?.city || '',
        businessState: seller.businessAddress?.state || '',
        businessZipCode: seller.businessAddress?.zipCode || '',
        businessCountry: seller.businessAddress?.country || '',
        taxId: seller.taxId || '',
        businessPhone: seller.businessPhone || '',
        businessEmail: seller.businessEmail || '',
        isApproved: seller.isApproved || false
      });
    }
  };

  const handleDeleteSeller = async () => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      try {
        const response = await authFetch(`/api/admin/sellers/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          alert('Seller deleted successfully');
          window.location.href = '/admin/dashboard';
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete seller');
        }
      } catch (error) {
        console.error('Error deleting seller:', error);
        alert('Error deleting seller');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await authFetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          alert('Product deleted successfully');
          setProducts(products.filter(p => p._id !== productId));
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await authFetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        alert('Order status updated successfully');
        // Refresh orders
        const ordersRes = await authFetch(`/api/admin/sellers/${id}/orders`);
        if (ordersRes.ok) setOrders(await ordersRes.json());
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!seller) return <div>Seller not found</div>;

  return (
    <div className="admin-detail-page">
      <div className="detail-header">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>Seller Details</h1>
        <div className="header-actions">
          {!editing ? (
            <button className="edit-btn" onClick={handleEditClick}>
              Edit Seller
            </button>
          ) : (
            <>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </>
          )}
          <button className="delete-btn" onClick={handleDeleteSeller}>
            Delete Seller
          </button>
        </div>
      </div>

      {editing ? (
        <div className="edit-form-container">
          <h3>Edit Seller Information</h3>
          <form className="edit-form">
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-name">Full Name *</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email Address *</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Business Information</h4>
              <div className="form-group">
                <label htmlFor="edit-companyName">Company Name *</label>
                <input
                    type="text"
                    id="edit-companyName"
                    name="companyName"
                    value={editFormData.companyName}
                    onChange={handleEditChange}
                    required
                  />
              </div>

              <div className="form-group">
                <label htmlFor="edit-businessStreet">Street Address *</label>
                <input
                  type="text"
                  id="edit-businessStreet"
                  name="businessStreet"
                  value={editFormData.businessStreet}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-businessCity">City *</label>
                  <input
                    type="text"
                    id="edit-businessCity"
                    name="businessCity"
                    value={editFormData.businessCity}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-businessState">State *</label>
                  <input
                    type="text"
                    id="edit-businessState"
                    name="businessState"
                    value={editFormData.businessState}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-businessZipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="edit-businessZipCode"
                    name="businessZipCode"
                    value={editFormData.businessZipCode}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-businessCountry">Country *</label>
                  <input
                    type="text"
                    id="edit-businessCountry"
                    name="businessCountry"
                    value={editFormData.businessCountry}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-taxId">Tax ID *</label>
                  <input
                    type="text"
                    id="edit-taxId"
                    name="taxId"
                    value={editFormData.taxId}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-businessPhone">Business Phone *</label>
                  <input
                    type="tel"
                    id="edit-businessPhone"
                    name="businessPhone"
                    value={editFormData.businessPhone}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-businessEmail">Business Email</label>
                <input
                  type="email"
                  id="edit-businessEmail"
                  name="businessEmail"
                  value={editFormData.businessEmail}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h4>Account Status</h4>
              <div className="form-group checkbox-group">
                <label htmlFor="edit-isApproved">
                  <input
                    type="checkbox"
                    id="edit-isApproved"
                    name="isApproved"
                    checked={editFormData.isApproved}
                    onChange={handleEditChange}
                  />
                  Approved Account
                </label>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="user-info-card">
          <h2>{seller.name}</h2>
          <p><strong>Email:</strong> {seller.email}</p>
          <p><strong>Company:</strong> {seller.companyName || 'N/A'}</p>
          <p><strong>Business Phone:</strong> {seller.businessPhone || 'N/A'}</p>
          <p><strong>Tax ID:</strong> {seller.taxId || 'N/A'}</p>
          <p><strong>Business Email:</strong> {seller.businessEmail || 'N/A'}</p>
          <p><strong>Status:</strong> 
            <span className={`status ${seller.isApproved ? 'approved' : 'pending'}`}>
              {seller.isApproved ? 'Approved' : 'Pending Approval'}
            </span>
          </p>
          <p><strong>Address:</strong> 
            {seller.businessAddress ? 
              `${seller.businessAddress.street || ''}, ${seller.businessAddress.city || ''}, ${seller.businessAddress.state || ''} ${seller.businessAddress.zipCode || ''}, ${seller.businessAddress.country || ''}` 
              : 'N/A'
            }
          </p>
        </div>
      )}

      <div className="detail-tabs">
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'products' && (
          <div className="products-section">
            <h3>Products by {seller.name}</h3>
            {products.length === 0 ? (
              <p>No products found</p>
            ) : (
              <div className="items-list">
                {products.map(product => (
                  <div key={product._id} className="item-card">
                    <div className="item-info">
                      <h4>{product.name}</h4>
                      <p>Type: {product.type}</p>
                      <p>Subcategory: {product.subcategory}</p>
                      <p>Variants: {product.variants?.length || 0}</p>
                      <p>Total Quantity: {product.totalQuantity || 0}</p>
                      <p>Available: {product.availableQuantity || 0}</p>
                    </div>
                    <div className="item-actions">
                      {/* <Link to={`/edit-product/${product._id}`} className="edit-btn">
                        Edit
                      </Link> */}
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h3>Orders for {seller.name}'s Products</h3>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <div className="items-list">
                {orders.map(order => (
                  <div key={order._id} className="item-card">
                    <div className="item-info">
                      <h4>Order #{order._id?.slice(-6) || 'N/A'}</h4>
                      <p>Customer: {order.buyer?.name || 'N/A'}</p>
                      <p>Email: {order.buyer?.email || 'N/A'}</p>
                      <p>Total: ${order.totalAmount || 0}</p>
                      <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                      <p>Status: 
                        <span className={`status ${order.status || 'pending'}`}>
                          {order.status || 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div className="item-actions">
                      <select 
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {/* <Link to={`/order/${order._id}`} className="view-btn">
                        View Details
                      </Link> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}