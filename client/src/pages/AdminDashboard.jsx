// // client/src/pages/AdminDashboard.jsx
// import { useState, useEffect } from 'react';
// import './AdminDashboard.css';

// export default function AdminDashboard() {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchPendingApprovals();
//   }, []);

//   const fetchPendingApprovals = async () => {
//     try {
//       const response = await fetch('/api/pending-approvals');
//       const data = await response.json();
      
//       if (response.ok) {
//         setPendingUsers(data);
//       } else {
//         setMessage('Failed to fetch pending approvals');
//       }
//     } catch (error) {
//       setMessage('Error fetching pending approvals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (userId) => {
//     try {
//       const response = await fetch(`/api/approve-user/${userId}`, {
//         method: 'PATCH',
//       });
      
//       if (response.ok) {
//         setMessage('User approved successfully');
//         // Remove the approved user from the list
//         setPendingUsers(pendingUsers.filter(user => user._id !== userId));
//       } else {
//         setMessage('Failed to approve user');
//       }
//     } catch (error) {
//       setMessage('Error approving user');
//     }
//   };

//   const handleReject = async (userId) => {
//     try {
//       const response = await fetch(`/api/reject-user/${userId}`, {
//         method: 'DELETE',
//       });
      
//       if (response.ok) {
//         setMessage('User rejected successfully');
//         // Remove the rejected user from the list
//         setPendingUsers(pendingUsers.filter(user => user._id !== userId));
//       } else {
//         setMessage('Failed to reject user');
//       }
//     } catch (error) {
//       setMessage('Error rejecting user');
//     }
//   };

//   if (loading) {
//     return <div className="admin-container">Loading...</div>;
//   }

//   return (
//     <div className="admin-container">
//       <h1>Admin Dashboard - Pending Approvals</h1>
      
//       {message && <div className="message">{message}</div>}
      
//       {pendingUsers.length === 0 ? (
//         <p>No pending approvals</p>
//       ) : (
//         <div className="approvals-list">
//           {pendingUsers.map(user => (
//             <div key={user._id} className="approval-item">
//               <div className="user-info">
//                 <h3>{user.name}</h3>
//                 <p>Email: {user.email}</p>
//                 <p>Role: {user.role}</p>
//                 {user.role === 'seller' && (
//                   <div className="seller-details">
//                     <p>Company: {user.companyName}</p>
//                     <p>Tax ID: {user.taxId}</p>
//                     <p>Business Phone: {user.businessPhone}</p>
//                   </div>
//                 )}
//               </div>
//               <div className="approval-actions">
//                 <button 
//                   className="approve-btn"
//                   onClick={() => handleApprove(user._id)}
//                 >
//                   Approve
//                 </button>
//                 <button 
//                   className="reject-btn"
//                   onClick={() => handleReject(user._id)}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// client/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('approvals');

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'approvals' ? 'active' : ''}
          onClick={() => setActiveTab('approvals')}
        >
          Pending Approvals
        </button>
        <button 
          className={activeTab === 'sellers' ? 'active' : ''}
          onClick={() => setActiveTab('sellers')}
        >
          Sellers
        </button>
        <button 
          className={activeTab === 'buyers' ? 'active' : ''}
          onClick={() => setActiveTab('buyers')}
        >
          Buyers
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'approvals' && <PendingApprovals />}
        {activeTab === 'sellers' && <SellersList />}
        {activeTab === 'buyers' && <BuyersList />}
      </div>
    </div>
  );
}

// Pending Approvals Component
function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch('/api/pending-approvals');
      const data = await response.json();
      
      if (response.ok) {
        setPendingUsers(data);
      } else {
        setMessage('Failed to fetch pending approvals');
      }
    } catch (error) {
      setMessage('Error fetching pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`/api/approve-user/${userId}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setMessage('User approved successfully');
        // Remove the approved user from the list
        setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      } else {
        setMessage('Failed to approve user');
      }
    } catch (error) {
      setMessage('Error approving user');
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(`/api/reject-user/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessage('User rejected successfully');
        // Remove the rejected user from the list
        setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      } else {
        setMessage('Failed to reject user');
      }
    } catch (error) {
      setMessage('Error rejecting user');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-section">
      <h2>Pending Approvals</h2>
      
      {message && <div className="message">{message}</div>}
      
      {pendingUsers.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <div className="users-list">
          {pendingUsers.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                {user.role === 'seller' && (
                  <div className="seller-details">
                    <p>Company: {user.companyName}</p>
                    <p>Tax ID: {user.taxId}</p>
                    <p>Business Phone: {user.businessPhone}</p>
                  </div>
                )}
              </div>
              <div className="user-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(user._id)}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(user._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sellers List Component
function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/admin/sellers');
      const data = await response.json();
      if (response.ok) {
        setSellers(data);
      } else {
        setMessage('Failed to fetch sellers');
      }
    } catch (error) {
      setMessage('Error fetching sellers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading sellers...</div>;

  return (
    <div className="admin-section">
      <h2>All Sellers</h2>
      
      {message && <div className="message">{message}</div>}
      
      <div className="users-list">
        {sellers.map(seller => (
          <div key={seller._id} className="user-card">
            <div className="user-info">
              <h3>{seller.name}</h3>
              <p>Email: {seller.email}</p>
              <p>Company: {seller.companyName}</p>
              <p>Status: {seller.isApproved ? 'Approved' : 'Pending'}</p>
              <p>Joined: {new Date(seller.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="user-actions">
              <Link to={`/admin/seller/${seller._id}`} className="view-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Buyers List Component
function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await fetch('/api/admin/buyers');
      const data = await response.json();
      if (response.ok) {
        setBuyers(data);
      } else {
        setMessage('Failed to fetch buyers');
      }
    } catch (error) {
      setMessage('Error fetching buyers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading buyers...</div>;

  return (
    <div className="admin-section">
      <h2>All Buyers</h2>
      
      {message && <div className="message">{message}</div>}
      
      <div className="users-list">
        {buyers.map(buyer => (
          <div key={buyer._id} className="user-card">
            <div className="user-info">
              <h3>{buyer.name}</h3>
              <p>Email: {buyer.email}</p>
              <p>Status: {buyer.isApproved ? 'Approved' : 'Pending'}</p>
              <p>Joined: {new Date(buyer.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="user-actions">
              <Link to={`/admin/buyer/${buyer._id}`} className="view-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}