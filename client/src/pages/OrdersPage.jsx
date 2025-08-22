// src/pages/OrdersPage.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./OrdersPage.css";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "newest",
  });
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders?buyerEmail=${user.email}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) return <div className="orders-container"><div className="loading-spinner">📦</div></div>;
  if (error) return <div className="orders-container error-message">Error: {error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-content">
          <h1>📦 Your Orders</h1>
          <p>Manage and track your purchases</p>
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label>Filter by status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Order Overview */}
              <div 
                className="order-overview"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <div className="overview-left">
                  <div className="order-icon">{getStatusIcon(order.status)}</div>
                  <div className="order-basic-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                <div className="overview-right">
                  <div 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(order.status),
                      color: 'white'
                    }}
                  >
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </div>
                  <div className="order-total-overview">
                    {formatCurrency(order.totalAmount)}
                  </div>
                  <div className={`expand-icon ${expandedOrder === order._id ? 'expanded' : ''}`}>
                    ▼
                  </div>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order._id && (
                <div className="order-details-expanded">
                  <div className="details-grid">
                    <div className="detail-section shipping-info">
                      <h4>📦 Shipping Information</h4>
                      <div className="detail-content">
                        <p><strong>Name:</strong> {order.buyer.name}</p>
                        <p><strong>Email:</strong> {order.buyer.email}</p>
                        <p><strong>Phone:</strong> {order.buyer.mobile}</p>
                        <p><strong>Address:</strong> {order.buyer.address}</p>
                      </div>
                    </div>

                    <div className="detail-section payment-info">
                      <h4>💳 Payment Details</h4>
                      <div className="detail-content">
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        <p><strong>Status:</strong> 
                          <span className={`payment-status ${order.paid ? 'paid' : 'pending'}`}>
                            {order.paid ? 'Paid ✅' : 'Pending ⏳'}
                          </span>
                        </p>
                        <p><strong>Order Total:</strong> {formatCurrency(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="products-section">
                    <h4>🛍️ Products ({order.products.length})</h4>
                    <div className="products-list">
                      {order.products.map((product, index) => (
                        <div key={index} className="product-card">
                          <div className="product-image">
                            {product.productId?.images?.[0] ? (
                              <img src={product.productId.images[0]} alt={product.name} />
                            ) : (
                              <div className="image-placeholder">📦</div>
                            )}
                          </div>
                          <div className="product-info">
                            <h5>{product.name}</h5>
                            <p className="product-price">{formatCurrency(product.price)} × {product.quantity}</p>
                            {product.variant && (
                              <p className="product-variant">
                                Variant: {product.variant.color}, {product.variant.size}
                              </p>
                            )}
                            <p className="product-subtotal">
                              Subtotal: {formatCurrency(product.price * product.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Items Total:</span>
                      <span>{formatCurrency(order.totalAmount - order.deliveryCharges)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Fee:</span>
                      <span>{formatCurrency(order.deliveryCharges)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Grand Total:</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}