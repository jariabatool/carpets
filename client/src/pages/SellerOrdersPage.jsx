// src/pages/SellerOrdersPage.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import "./SellerOrdersPage.css";

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "newest",
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchSellerOrders();
    
    if (socket && user) {
      socket.emit('join-seller-room', user._id);
      
      socket.on('new-order', (newOrder) => {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'new_order',
          order: newOrder,
          read: false,
          timestamp: new Date()
        }, ...prev]);
        
        if (newOrder.products.some(p => p.sellerId === user._id)) {
          setOrders(prev => [newOrder, ...prev]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('new-order');
      }
    };
  }, [socket, user]);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/seller/orders?sellerId=${user._id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching seller orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedOrder = await response.json();
      
      setOrders(prev => prev.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      
      setNotifications(prev => prev.map(notif => 
        notif.order?._id === orderId ? { ...notif, read: true } : notif
      ));

    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = orders
    .filter(order => {
      if (filters.status === "all") return true;
      return order.status === filters.status;
    })
    .sort((a, b) => {
      if (filters.sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#f59e0b";
      case "processing": return "#3b82f6";
      case "shipped": return "#06b6d4";
      case "delivered": return "#10b981";
      case "cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "⏳";
      case "processing": return "⚙️";
      case "shipped": return "🚚";
      case "delivered": return "✅";
      case "cancelled": return "❌";
      default: return "📦";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const unreadNotifications = notifications.filter(notif => !notif.read);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  if (loading) return <div className="seller-orders-container"><div className="loading-spinner">🏪</div></div>;
  if (error) return <div className="seller-orders-container error-message">Error: {error}</div>;

  return (
    <div className="seller-orders-container">
      {/* Header with Stats */}
      <div className="seller-header">
        <div className="header-content">
          <h1>🏪 Seller Dashboard</h1>
          <p>Manage your orders and track sales</p>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{pendingOrders}</h3>
              <p>Pending</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <h3>{unreadNotifications.length}</h3>
              <p>New Notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Bell */}
      <div className="notifications-wrapper">
        <div className="notifications-bell">
          <span className="bell-icon">🔔</span>
          {unreadNotifications.length > 0 && (
            <span className="notification-count">{unreadNotifications.length}</span>
          )}
          
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h4>Notifications</h4>
              {unreadNotifications.length > 0 && (
                <button 
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="mark-all-read"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications</p>
            ) : (
              <div className="notifications-list">
                {notifications.slice(0, 5).map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => {
                      viewOrderDetails(notification.order);
                      markNotificationAsRead(notification.id);
                    }}
                  >
                    <div className="notification-icon">📦</div>
                    <div className="notification-content">
                      <p><strong>New Order #{notification.order._id.slice(-8).toUpperCase()}</strong></p>
                      <p>{formatCurrency(notification.order.totalAmount)} • {formatDate(notification.timestamp)}</p>
                    </div>
                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending ({orders.filter(o => o.status === 'pending').length})</option>
            <option value="processing">Processing ({orders.filter(o => o.status === 'processing').length})</option>
            <option value="shipped">Shipped ({orders.filter(o => o.status === 'shipped').length})</option>
            <option value="delivered">Delivered ({orders.filter(o => o.status === 'delivered').length})</option>
            <option value="cancelled">Cancelled ({orders.filter(o => o.status === 'cancelled').length})</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <button onClick={fetchSellerOrders} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>You haven't received any orders yet.</p>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-overview">
                <div className="overview-left">
                  <div className="order-icon">{getStatusIcon(order.status)}</div>
                  <div className="order-basic-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                    <p className="buyer-info">Buyer: {order.buyer.name}</p>
                    <p className="order-total">Total: {formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
                
                <div className="overview-right">
                  <div className="status-controls">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                      style={{ backgroundColor: getStatusColor(order.status), color: 'white' }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="processing">⚙️ Processing</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="delivered">✅ Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => viewOrderDetails(order)}
                    className="view-details-btn"
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-modal" onClick={closeOrderDetails}>×</button>
            </div>
            
            <div className="order-details-modal">
              <div className="order-summary">
                <div className="summary-row">
                  <span>Order ID:</span>
                  <span>#{selectedOrder._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="summary-row">
                  <span>Order Date:</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="summary-row">
                  <span>Status:</span>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedOrder.status) }}>
                    {getStatusIcon(selectedOrder.status)} {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Payment Method:</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="summary-row">
                  <span>Payment Status:</span>
                  <span>{selectedOrder.paid ? 'Paid ✅' : 'Pending ⏳'}</span>
                </div>
              </div>

              <div className="customer-info">
                <h3>👤 Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Name:</strong> {selectedOrder.buyer.name}
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong> {selectedOrder.buyer.email}
                  </div>
                  <div className="info-item">
                    <strong>Phone:</strong> {selectedOrder.buyer.mobile}
                  </div>
                  <div className="info-item full-width">
                    <strong>Address:</strong> {selectedOrder.buyer.address}
                  </div>
                </div>
              </div>

              <div className="products-section">
                <h3>🛍️ Ordered Products ({selectedOrder.products.length})</h3>
                <div className="products-list">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="product-item-modal">
                      <div className="product-image">
                        {product.productId?.images?.[0] ? (
                          <img src={product.productId.images[0]} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">📦</div>
                        )}
                      </div>
                      <div className="product-details">
                        <h4>{product.name}</h4>
                        <p className="product-price">{formatCurrency(product.price)} × {product.quantity}</p>
                        {product.variant && (
                          <p className="product-variant">
                            <strong>Variant:</strong> {product.variant.color}, {product.variant.size}
                          </p>
                        )}
                        <p className="product-subtotal">
                          <strong>Subtotal:</strong> {formatCurrency(product.price * product.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-total-modal">
                <div className="total-row">
                  <span>Items Total:</span>
                  <span>{formatCurrency(selectedOrder.totalAmount - selectedOrder.deliveryCharges)}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Fee:</span>
                  <span>{formatCurrency(selectedOrder.deliveryCharges)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-primary" onClick={closeOrderDetails}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}