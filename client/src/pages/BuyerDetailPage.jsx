// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './AdminDetailPages.css';

// export default function BuyerDetailPage() {
//   const { id } = useParams();
//   const [buyer, setBuyer] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     name: '',
//     email: '',
//     isApproved: false
//   });

//   useEffect(() => {
//     fetchBuyerDetails();
//   }, [id]);

//   const fetchBuyerDetails = async () => {
//     try {
//       const [buyerRes, ordersRes] = await Promise.all([
//         fetch(`/api/admin/buyers/${id}`),
//         fetch(`/api/admin/buyers/${id}/orders`)
//       ]);

//       if (buyerRes.ok) {
//         const buyerData = await buyerRes.json();
//         setBuyer(buyerData);
//         setEditFormData({
//           name: buyerData.name || '',
//           email: buyerData.email || '',
//           isApproved: buyerData.isApproved || false
//         });
//       }
//       if (ordersRes.ok) setOrders(await ordersRes.json());
//     } catch (error) {
//       console.error('Error fetching buyer details:', error);
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
//       const response = await fetch(`/api/admin/buyers/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editFormData),
//       });

//       if (response.ok) {
//         const updatedBuyer = await response.json();
//         setBuyer(updatedBuyer);
//         setEditing(false);
//         alert('Buyer updated successfully');
//       } else {
//         const errorData = await response.json();
//         alert(errorData.message || 'Failed to update buyer');
//       }
//     } catch (error) {
//       console.error('Error updating buyer:', error);
//       alert('Error updating buyer');
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditing(false);
//     // Reset form data to original values
//     if (buyer) {
//       setEditFormData({
//         name: buyer.name || '',
//         email: buyer.email || '',
//         isApproved: buyer.isApproved || false
//       });
//     }
//   };

//   const handleDeleteBuyer = async () => {
//     if (window.confirm('Are you sure you want to delete this buyer?')) {
//       try {
//         const response = await fetch(`/api/admin/buyers/${id}`, {
//           method: 'DELETE'
//         });
        
//         if (response.ok) {
//           alert('Buyer deleted successfully');
//           window.location.href = '/admin/dashboard';
//         }
//       } catch (error) {
//         console.error('Error deleting buyer:', error);
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
//         const ordersRes = await fetch(`/api/admin/buyers/${id}/orders`);
//         if (ordersRes.ok) setOrders(await ordersRes.json());
//       }
//     } catch (error) {
//       console.error('Error updating order status:', error);
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (!buyer) return <div>Buyer not found</div>;

//   return (
//     <div className="admin-detail-page">
//       <div className="detail-header">
//         <h1>Buyer Details</h1>
//         <div className="header-actions">
//           {!editing ? (
//             <button className="edit-btn" onClick={handleEditClick}>
//               Edit Buyer
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
//           <button className="delete-btn" onClick={handleDeleteBuyer}>
//             Delete Buyer
//           </button>
//         </div>
//       </div>

//       {editing ? (
//         <div className="edit-form-container">
//           <h3>Edit Buyer Information</h3>
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
//           <h2>{buyer.name}</h2>
//           <p><strong>Email:</strong> {buyer.email}</p>
//           <p><strong>Joined:</strong> {new Date(buyer.createdAt).toLocaleDateString()}</p>
//           <p><strong>Status:</strong> {buyer.isApproved ? 'Approved' : 'Pending'}</p>
//         </div>
//       )}

//       <div className="orders-section">
//         <h3>Orders by {buyer.name}</h3>
//         <div className="items-list">
//           {orders.map(order => (
//             <div key={order._id} className="item-card">
//               <div className="item-info">
//                 <h4>Order #{order.orderNumber}</h4>
//                 <p>Total: ${order.totalAmount}</p>
//                 <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                 <p>Status: {order.status}</p>
//                 <p>Items: {order.items.length} products</p>
//               </div>
//               <div className="item-actions">
//                 <select 
//                   value={order.status}
//                   onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//                 <button className="view-btn">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the auth context
import './AdminDetailPages.css';

export default function BuyerDetailPage() {
  const { id } = useParams();
  const { authFetch } = useAuth(); // Get the authFetch function
  const [buyer, setBuyer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    isApproved: false
  });

  useEffect(() => {
    fetchBuyerDetails();
  }, [id]);

  const fetchBuyerDetails = async () => {
    try {
      const [buyerRes, ordersRes] = await Promise.all([
        authFetch(`/api/admin/buyers/${id}`),
        authFetch(`/api/admin/buyers/${id}/orders`)
      ]);

      if (buyerRes.ok) {
        const buyerData = await buyerRes.json();
        setBuyer(buyerData);
        setEditFormData({
          name: buyerData.name || '',
          email: buyerData.email || '',
          isApproved: buyerData.isApproved || false
        });
      } else {
        console.error('Failed to fetch buyer:', await buyerRes.json());
      }
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      } else {
        console.error('Failed to fetch orders:', await ordersRes.json());
      }
    } catch (error) {
      console.error('Error fetching buyer details:', error);
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
      const response = await authFetch(`/api/admin/buyers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedBuyer = await response.json();
        setBuyer(updatedBuyer);
        setEditing(false);
        alert('Buyer updated successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update buyer');
      }
    } catch (error) {
      console.error('Error updating buyer:', error);
      alert('Error updating buyer');
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    // Reset form data to original values
    if (buyer) {
      setEditFormData({
        name: buyer.name || '',
        email: buyer.email || '',
        isApproved: buyer.isApproved || false
      });
    }
  };

  const handleDeleteBuyer = async () => {
    if (window.confirm('Are you sure you want to delete this buyer?')) {
      try {
        const response = await authFetch(`/api/admin/buyers/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          alert('Buyer deleted successfully');
          window.location.href = '/admin/dashboard';
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete buyer');
        }
      } catch (error) {
        console.error('Error deleting buyer:', error);
        alert('Error deleting buyer');
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
        const ordersRes = await authFetch(`/api/admin/buyers/${id}/orders`);
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

  if (loading) return <div className="admin-detail-page loading">Loading...</div>;
  if (!buyer) return <div className="admin-detail-page">Buyer not found</div>;

  return (
    <div className="admin-detail-page">
      <div className="detail-header">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>Buyer Details</h1>
        <div className="header-actions">
          {!editing ? (
            <button className="edit-btn" onClick={handleEditClick}>
              Edit Buyer
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
          <button className="delete-btn" onClick={handleDeleteBuyer}>
            Delete Buyer
          </button>
        </div>
      </div>

      {editing ? (
        <div className="edit-form-container">
          <h3>Edit Buyer Information</h3>
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
          <h2>{buyer.name}</h2>
          <p><strong>Email:</strong> {buyer.email}</p>
          <p><strong>Joined:</strong> {new Date(buyer.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> 
            <span className={`status ${buyer.isApproved ? 'approved' : 'pending'}`}>
              {buyer.isApproved ? 'Approved' : 'Pending Approval'}
            </span>
          </p>
        </div>
      )}

      <div className="orders-section">
        <h3>Orders by {buyer.name}</h3>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="items-list">
            {orders.map(order => (
              <div key={order._id} className="item-card">
                <div className="item-info">
                  <h4>Order #{order._id?.slice(-6) || 'N/A'}</h4>
                  <p>Total: ${order.totalAmount || 0}</p>
                  <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p>Status: 
                    <span className={`status ${order.status || 'pending'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </p>
                  <p>Items: {order.products?.length || 0} products</p>
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
                  <Link to={`/order/${order._id}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}