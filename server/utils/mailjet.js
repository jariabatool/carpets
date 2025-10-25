import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
  '3a63bcd1862689d472120645f25945a0', // Your API Key
  '7b301e79eefb8816fc9c07dbe5fafc82'  // Your Secret Key
);

// Function to send email to customer
export const sendOrderConfirmationEmail = async (order, customerEmail, customerName) => {
  try {
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com", // Replace with your email
              Name: "Carpets & Rugs Store"
            },
            To: [
              {
                Email: customerEmail,
                Name: customerName
              }
            ],
            Subject: `Order Confirmation - #${order._id.slice(-6).toUpperCase()}`,
            HTMLPart: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
                  .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #667eea; }
                  .product-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                  .total { font-weight: bold; font-size: 1.1em; color: #2c3e50; }
                  .footer { text-align: center; margin-top: 20px; padding: 20px; background: #2c3e50; color: white; border-radius: 5px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 Order Confirmed!</h1>
                    <p>Thank you for shopping with Carpets & Rugs Store</p>
                  </div>
                  <div class="content">
                    <p>Dear <strong>${customerName}</strong>,</p>
                    <p>Your order has been successfully placed and is being processed.</p>
                    
                    <div class="order-details">
                      <h3>Order Details</h3>
                      <p><strong>Order ID:</strong> ${order._id.slice(-6).toUpperCase()}</p>
                      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                      <p><strong>Status:</strong> ${order.status}</p>
                    </div>

                    <div class="order-details">
                      <h3>Shipping Address</h3>
                      <p>${order.buyer.address}</p>
                      <p>${order.buyer.city}, ${order.buyer.postalCode}</p>
                      <p>${order.buyer.country}</p>
                    </div>

                    <div class="order-details">
                      <h3>Order Items</h3>
                      ${order.products.map(product => `
                        <div class="product-item">
                          <div>
                            <strong>${product.name}</strong>
                            ${product.variant ? `<br><small>Variant: ${product.variant.color}, ${product.variant.size}</small>` : ''}
                            <br>Quantity: ${product.quantity}
                          </div>
                          <div>$${(product.price * product.quantity).toFixed(2)}</div>
                        </div>
                      `).join('')}
                      
                      <div class="product-item">
                        <div><strong>Delivery Charges</strong></div>
                        <div>$${order.deliveryCharges?.toFixed(2) || '0.00'}</div>
                      </div>
                      
                      <div class="product-item total">
                        <div><strong>Total Amount</strong></div>
                        <div>$${order.totalAmount?.toFixed(2)}</div>
                      </div>
                    </div>

                    <p>We'll notify you once your order ships. You can track your order status in your account.</p>
                    
                    <p>If you have any questions, please contact our support team.</p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br>Carpets & Rugs Store Team</p>
                    <p>📞 +1 (555) 123-4567 | ✉️ support@CarpetsRugsStore.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('Order confirmation email sent to customer:', customerEmail);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Function to send email to seller
export const sendNewOrderNotificationToSeller = async (order, sellerEmail, sellerName) => {
  try {
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com", // Replace with your email
              Name: "Carpets & Rugs Store - Orders"
            },
            To: [
              {
                Email: sellerEmail,
                Name: sellerName
              }
            ],
            Subject: `New Order Received - #${order._id.slice(-6).toUpperCase()}`,
            HTMLPart: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
                  .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #28a745; }
                  .product-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                  .total { font-weight: bold; font-size: 1.1em; color: #2c3e50; }
                  .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 10px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🛍️ New Order Received!</h1>
                    <p>You have a new order that requires your attention</p>
                  </div>
                  <div class="content">
                    <div class="urgent">
                      <strong>Action Required:</strong> Please review and process this order within 24 hours.
                    </div>
                    
                    <div class="order-details">
                      <h3>Order Information</h3>
                      <p><strong>Order ID:</strong> ${order._id.slice(-6).toUpperCase()}</p>
                      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                      <p><strong>Customer:</strong> ${order.buyer.name}</p>
                      <p><strong>Customer Email:</strong> ${order.buyer.email}</p>
                      <p><strong>Customer Phone:</strong> ${order.buyer.mobile}</p>
                      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                      <p><strong>Payment Status:</strong> ${order.paid ? 'Paid' : 'Pending'}</p>
                    </div>

                    <div class="order-details">
                      <h3>Shipping Address</h3>
                      <p>${order.buyer.address}</p>
                      <p>${order.buyer.city}, ${order.buyer.postalCode}</p>
                      <p>${order.buyer.country}</p>
                    </div>

                    <div class="order-details">
                      <h3>Order Items From Your Store</h3>
                      ${order.products.filter(product => product.sellerId === sellerEmail).map(product => `
                        <div class="product-item">
                          <div>
                            <strong>${product.name}</strong>
                            ${product.variant ? `<br><small>Variant: ${product.variant.color}, ${product.variant.size}</small>` : ''}
                            <br>Quantity: ${product.quantity}
                            <br>Price: $${product.price} each
                          </div>
                          <div>$${(product.price * product.quantity).toFixed(2)}</div>
                        </div>
                      `).join('')}
                      
                      <div class="product-item total">
                        <div><strong>Subtotal (Your Products)</strong></div>
                        <div>$${order.products
                          .filter(product => product.sellerId === sellerEmail)
                          .reduce((sum, product) => sum + (product.price * product.quantity), 0)
                          .toFixed(2)}</div>
                      </div>
                    </div>

                    <p><strong>Next Steps:</strong></p>
                    <ul>
                      <li>Review the order details</li>
                      <li>Prepare the items for shipping</li>
                      <li>Update order status in your dashboard</li>
                      <li>Contact customer if any issues</li>
                    </ul>

                    <p>Login to your seller dashboard to manage this order: <a href="http://localhost:5173/manage-products">Seller Dashboard</a></p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding: 20px; background: #e9ecef; border-radius: 5px;">
                    <p>Best regards,<br>Carpets & Rugs Store Team</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('New order notification sent to seller:', sellerEmail);
    return result;
  } catch (error) {
    console.error('Error sending new order notification to seller:', error);
    throw error;
  }
};

// Main function to send all order emails
export const sendOrderEmails = async (order) => {
  try {
    // Send email to customer
    await sendOrderConfirmationEmail(order, order.buyer.email, order.buyer.name);
    
    // Get unique sellers from the order
    const uniqueSellers = [...new Set(order.products.map(product => product.sellerId))];
    
    // Send email to each seller (you'll need to get seller emails from your database)
    for (const sellerId of uniqueSellers) {
      // In a real application, you'd fetch seller details from database
      // For now, we'll use a placeholder - you'll need to implement this
      const seller = await getSellerById(sellerId);
      if (seller && seller.email) {
        await sendNewOrderNotificationToSeller(order, seller.email, seller.name || 'Seller');
      }
    }
    
    console.log('All order emails sent successfully');
  } catch (error) {
    console.error('Error sending order emails:', error);
    // Don't throw error here to prevent order creation from failing
  }
};

// Helper function to get seller by ID (you need to implement this based on your database)
const getSellerById = async (sellerId) => {
  try {
    // This is a placeholder - implement based on your User model
    const User = await import('../models/User.js');
    const seller = await User.default.findById(sellerId);
    return seller;
  } catch (error) {
    console.error('Error fetching seller:', error);
    return null;
  }
};