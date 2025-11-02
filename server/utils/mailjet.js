import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
  '3a63bcd1862689d472120645f25945a0', // Your API Key
  '7b301e79eefb8816fc9c07dbe5fafc82'  // Your Secret Key
);

// Helper function to get seller by ID
// Helper function to get seller by ID - UPDATED FOR YOUR USER MODEL
const getSellerById = async (sellerId) => {
  try {
    console.log('🔍 Looking up seller with ID:', sellerId);
    console.log('🔍 Seller ID type:', typeof sellerId);
    
    // Handle different ID formats
    let validSellerId = sellerId;
    
    // If sellerId is an object with $oid (common in MongoDB)
    if (sellerId && typeof sellerId === 'object' && sellerId.$oid) {
      validSellerId = sellerId.$oid;
      console.log('🔍 Extracted $oid:', validSellerId);
    }
    
    // Import your User model
    const UserModule = await import('../models/User.js');
    const User = UserModule.default || UserModule;
    
    console.log('🔍 Final seller ID for lookup:', validSellerId);
    
    // Find seller by their MongoDB _id - SELECT ALL EMAIL FIELDS
    const seller = await User.findById(validSellerId).select('name email businessEmail companyName role isApproved');
    
    if (!seller) {
      console.log('❌ Seller not found for ID:', validSellerId);
      return null;
    }
    
    // ✅ CHECK: Make sure it's actually a seller
    if (seller.role !== 'seller') {
      console.log('❌ User found but not a seller. Role:', seller.role);
      return null;
    }
    
    // ✅ CHECK: Make sure seller is approved
    if (!seller.isApproved) {
      console.log('❌ Seller found but not approved:', seller.email);
      return null;
    }
    
    // ✅ PRIORITIZE businessEmail, fallback to email
    const sellerEmail = seller.businessEmail || seller.email;
    
    if (!sellerEmail) {
      console.log('❌ No email found for seller:', seller.name);
      return null;
    }
    
    console.log('✅ Found approved seller:', {
      id: seller._id,
      name: seller.name,
      role: seller.role,
      isApproved: seller.isApproved,
      personalEmail: seller.email,
      businessEmail: seller.businessEmail,
      finalEmailUsed: sellerEmail,
      companyName: seller.companyName
    });
    
    return {
      id: seller._id,
      email: sellerEmail,
      name: seller.name || 'Seller',
      companyName: seller.companyName || ''
    };
  } catch (error) {
    console.error('❌ Error fetching seller:', error);
    return null;
  }
};
// Function to send email to customer - UPDATED VERSION
export const sendOrderConfirmationEmail = async (order, customerEmail, customerName) => {
  try {
    console.log('📧 Sending confirmation email to:', customerEmail);
    
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com",
              Name: "Carpets and Rugs Store"
            },
            To: [
              {
                Email: customerEmail,
                Name: customerName
              }
            ],
            Subject: `Order Confirmation - #${order._id.toString().slice(-6).toUpperCase()}`,
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
                    <p>Thank you for shopping with Carpets and Rugs Store</p>
                  </div>
                  <div class="content">
                    <p>Dear <strong>${customerName}</strong>,</p>
                    <p>Your order has been successfully placed and is being processed.</p>
                    
                    <div class="order-details">
                      <h3>Order Details</h3>
                      <p><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
                      <p><strong>Order Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleDateString()}</p>
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
                        <div>$${(order.totalAmount + (order.deliveryCharges || 0)).toFixed(2)}</div>
                      </div>
                    </div>

                    <p>We'll notify you once your order ships. You can track your order status in your account.</p>
                    
                    <p>If you have any questions, please contact our support team.</p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br>The Carpets and Rugs Team</p>
                    <p>📞 +1 (555) 123-4567 | ✉️ browndoor668@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('✅ Order confirmation email sent to customer:', customerEmail);
    return result;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};
// Function to send email to seller
// export const sendNewOrderNotificationToSeller = async (order, sellerEmail, sellerName, companyName = '') => {
//   try {
//     const request = mailjetClient
//       .post('send', { version: 'v3.1' })
//       .request({
//         Messages: [
//           {
//             From: {
//               Email: "browndoor668@gmail.com", // Replace with your email
//               Name: "Carpets and Rugs Store - Orders"
//             },
//             To: [
//               {
//                 Email: sellerEmail,
//                 Name: sellerName
//               }
//             ],
//             Subject: `New Order Received${companyName ? ` - ${companyName}` : ''} - #${order._id.slice(-6).toUpperCase()}`,
//             HTMLPart: `
//               <!DOCTYPE html>
//               <html>
//               <head>
//                 <style>
//                   body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                   .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                   .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
//                   .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
//                   .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #28a745; }
//                   .product-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
//                   .total { font-weight: bold; font-size: 1.1em; color: #2c3e50; }
//                   .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 10px 0; }
//                 </style>
//               </head>
//               <body>
//                 <div class="container">
//                   <div class="header">
//                     <h1>🛍️ New Order Received${companyName ? ` for ${companyName}` : ''}!</h1>
//                     <p>You have a new order that requires your attention</p>
//                   </div>
//                   <div class="content">
//                     <div class="urgent">
//                       <strong>Action Required:</strong> Please review and process this order within 24 hours.
//                     </div>
                    
//                     <div class="order-details">
//                       <h3>Order Information</h3>
//                       <p><strong>Order ID:</strong> ${order._id.slice(-6).toUpperCase()}</p>
//                       <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
//                       <p><strong>Customer:</strong> ${order.buyer.name}</p>
//                       <p><strong>Customer Email:</strong> ${order.buyer.email}</p>
//                       <p><strong>Customer Phone:</strong> ${order.buyer.mobile}</p>
//                       <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
//                       <p><strong>Payment Status:</strong> ${order.paid ? 'Paid' : 'Pending'}</p>
//                     </div>

//                     <div class="order-details">
//                       <h3>Shipping Address</h3>
//                       <p>${order.buyer.address}</p>
//                       <p>${order.buyer.city}, ${order.buyer.postalCode}</p>
//                       <p>${order.buyer.country}</p>
//                     </div>

//                     <div class="order-details">
//                       <h3>Order Items From Your Store</h3>
//                       ${order.products.map(product => `
//                         <div class="product-item">
//                           <div>
//                             <strong>${product.name}</strong>
//                             ${product.variant ? `<br><small>Variant: ${product.variant.color}, ${product.variant.size}</small>` : ''}
//                             <br>Quantity: ${product.quantity}
//                             <br>Price: $${product.price} each
//                           </div>
//                           <div>$${(product.price * product.quantity).toFixed(2)}</div>
//                         </div>
//                       `).join('')}
                      
//                       <div class="product-item total">
//                         <div><strong>Subtotal (Your Products)</strong></div>
//                         <div>$${order.products
//                           .reduce((sum, product) => sum + (product.price * product.quantity), 0)
//                           .toFixed(2)}</div>
//                       </div>
//                     </div>

//                     <p><strong>Next Steps:</strong></p>
//                     <ul>
//                       <li>Review the order details</li>
//                       <li>Prepare the items for shipping</li>
//                       <li>Update order status in your dashboard</li>
//                       <li>Contact customer if any issues</li>
//                     </ul>

//                     <p>Login to your seller dashboard to manage this order: <a href="http://localhost:5173/manage-products">Seller Dashboard</a></p>
//                   </div>
                  
//                   <div style="text-align: center; margin-top: 20px; padding: 20px; background: #e9ecef; border-radius: 5px;">
//                     <p>Best regards,<br>Carpets and Rugs Team</p>
//                   </div>
//                 </div>
//               </body>
//               </html>
//             `
//           }
//         ]
//       });

//     const result = await request;
//     console.log('New order notification sent to seller:', sellerEmail);
//     return result;
//   } catch (error) {
//     console.error('Error sending new order notification to seller:', error);
//     throw error;
//   }
// };
// Function to send email to seller - UPDATED FOR YOUR USER MODEL
export const sendNewOrderNotificationToSeller = async (order, sellerEmail, sellerName, companyName = '') => {
  try {
    console.log('📧 Attempting to send seller notification to:', sellerEmail);
    console.log('📧 Seller name:', sellerName);
    console.log('📧 Company name:', companyName);
    
    // Validate email format
    if (!sellerEmail || !sellerEmail.includes('@')) {
      console.error('❌ Invalid seller email:', sellerEmail);
      throw new Error('Invalid seller email address');
    }
    
    // Filter products for THIS specific seller
    const sellerProducts = order.products.filter(product => {
      // We'll filter on the backend based on seller lookup
      return true; // All products in this call are for this seller
    });
    
    const sellerSubtotal = sellerProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    );
    
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com", // Make sure this is verified in Mailjet
              Name: "Carpets & Rugs Store - Orders"
            },
            To: [
              {
                Email: sellerEmail,
                Name: sellerName || 'Seller'
              }
            ],
            Subject: `🛍️ New Order ${companyName ? `for ${companyName}` : ''} - #${order._id.toString().slice(-6).toUpperCase()}`,
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
                  .footer { text-align: center; margin-top: 20px; padding: 20px; background: #2c3e50; color: white; border-radius: 5px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🛍️ New Order Received${companyName ? ` for ${companyName}` : ''}!</h1>
                    <p>You have a new order that requires your attention</p>
                  </div>
                  <div class="content">
                    <div class="urgent">
                      <strong>🚀 Action Required:</strong> Please review and process this order within 24 hours.
                    </div>
                    
                    <div class="order-details">
                      <h3>📋 Order Information</h3>
                      <p><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
                      <p><strong>Order Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleDateString()}</p>
                      <p><strong>Customer:</strong> ${order.buyer.name}</p>
                      <p><strong>Customer Email:</strong> ${order.buyer.email}</p>
                      <p><strong>Customer Phone:</strong> ${order.buyer.mobile || 'Not provided'}</p>
                      <p><strong>Payment Method:</strong> ${order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</p>
                      <p><strong>Payment Status:</strong> ${order.paid ? '✅ Paid' : '⏳ Pending'}</p>
                    </div>

                    <div class="order-details">
                      <h3>📦 Shipping Address</h3>
                      <p>${order.buyer.address}</p>
                      <p>${order.buyer.city}, ${order.buyer.postalCode}</p>
                      <p>${order.buyer.country}</p>
                    </div>

                    <div class="order-details">
                      <h3>📊 Order Items From Your Store</h3>
                      ${order.products.map(product => `
                        <div class="product-item">
                          <div>
                            <strong>${product.name}</strong>
                            ${product.variant && product.variant.color ? `<br><small>🎨 Color: ${product.variant.color}</small>` : ''}
                            ${product.variant && product.variant.size ? `<br><small>📏 Size: ${product.variant.size}</small>` : ''}
                            <br>📦 Quantity: ${product.quantity}
                            <br>💰 Price: $${product.price} each
                          </div>
                          <div><strong>$${(product.price * product.quantity).toFixed(2)}</strong></div>
                        </div>
                      `).join('')}
                      
                      <div class="product-item total">
                        <div><strong>Subtotal (Your Products)</strong></div>
                        <div><strong>$${sellerSubtotal.toFixed(2)}</strong></div>
                      </div>
                    </div>

                    <div class="order-details">
                      <h3>🎯 Next Steps</h3>
                      <ol>
                        <li><strong>Review</strong> the order details above</li>
                        <li><strong>Prepare</strong> the items for shipping</li>
                        <li><strong>Update</strong> order status in your seller dashboard</li>
                        <li><strong>Contact</strong> customer if any issues arise</li>
                        <li><strong>Ship</strong> within 2-3 business days</li>
                      </ol>
                    </div>

                    <p><strong>💡 Need Help?</strong> Contact our support team if you have any questions.</p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br><strong>The Carpets & Rugs Store Team</strong></p>
                    <p>📞 Support: +1 (555) 123-4567 | ✉️ Email: browndoor@668@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('✅ New order notification sent to seller:', sellerEmail);
    console.log('✅ Mailjet response status:', result.response.status);
    return result;
  } catch (error) {
    console.error('❌ Error sending new order notification to seller:', error);
    console.error('❌ Seller email that failed:', sellerEmail);
    throw error;
  }
};
// Main function to send all order emails
// export const sendOrderEmails = async (order) => {
//   try {
//     console.log('Starting to send order emails for order:', order._id);
    
//     // Send email to customer
//     await sendOrderConfirmationEmail(order, order.buyer.email, order.buyer.name);
//     console.log('Customer email sent to:', order.buyer.email);
    
//     // Get unique seller IDs from the order
//     const uniqueSellerIds = [...new Set(order.products.map(product => product.sellerId))];
//     console.log('Found sellers for order:', uniqueSellerIds);
    
//     // Send email to each seller
//     for (const sellerId of uniqueSellerIds) {
//       try {
//         const seller = await getSellerById(sellerId);
        
//         if (seller && seller.email) {
//           console.log('Sending email to seller:', seller.email);
//           await sendNewOrderNotificationToSeller(order, seller.email, seller.name, seller.companyName);
//           console.log('Seller email sent successfully to:', seller.email);
//         } else {
//           console.log('Seller not found or no email for ID:', sellerId);
//         }
//       } catch (sellerError) {
//         console.error(`Failed to send email to seller ${sellerId}:`, sellerError);
//         // Continue with other sellers even if one fails
//       }
//     }
    
//     console.log('All order emails processed for order:', order._id);
//   } catch (error) {
//     console.error('Error in sendOrderEmails:', error);
//     // Don't throw error here to prevent order creation from failing
//   }
// };
// Main function to send all order emails - ENHANCED VERSION
export const sendOrderEmails = async (order) => {
  try {
    console.log('🚀 Starting to send order emails for order:', order._id);
    console.log('📦 Order products count:', order.products.length);
    
    // Send email to customer
    console.log('📧 Sending confirmation to customer:', order.buyer.email);
    await sendOrderConfirmationEmail(order, order.buyer.email, order.buyer.name);
    console.log('✅ Customer email sent successfully');
    
    // Get unique seller IDs from the order
    const uniqueSellerIds = [...new Set(order.products.map(product => product.sellerId))];
    console.log('👥 Unique seller IDs in order:', uniqueSellerIds);
    
    let sellerEmailCount = 0;
    
    // Send email to each seller
    for (const sellerId of uniqueSellerIds) {
      try {
        console.log(`\n🔍 Processing seller ${sellerEmailCount + 1}/${uniqueSellerIds.length}:`, sellerId);
        
        const seller = await getSellerById(sellerId);
        
        if (seller && seller.email) {
          console.log(`📧 Sending email to seller: ${seller.email}`);
          
          // Filter products for this specific seller
          const sellerProducts = order.products.filter(product => 
            product.sellerId.toString() === sellerId.toString()
          );
          
          console.log(`📊 Seller has ${sellerProducts.length} products in this order`);
          
          await sendNewOrderNotificationToSeller(
            { ...order, products: sellerProducts }, // Send only relevant products
            seller.email, 
            seller.name, 
            seller.companyName
          );
          
          sellerEmailCount++;
          console.log(`✅ Seller email ${sellerEmailCount} sent successfully to: ${seller.email}`);
        } else {
          console.log('❌ Skipping seller - not found, no email, or not approved');
        }
      } catch (sellerError) {
        console.error(`❌ Failed to send email to seller ${sellerId}:`, sellerError);
        // Continue with other sellers even if one fails
      }
    }
    
    console.log(`\n🎉 All order emails processed!`);
    console.log(`✅ Customer: 1 email sent`);
    console.log(`✅ Sellers: ${sellerEmailCount}/${uniqueSellerIds.length} emails sent`);
    
    return {
      customerEmail: true,
      sellerEmails: sellerEmailCount,
      totalSellers: uniqueSellerIds.length
    };
  } catch (error) {
    console.error('❌ Critical error in sendOrderEmails:', error);
    // Don't throw error here to prevent order creation from failing
    return {
      customerEmail: false,
      sellerEmails: 0,
      totalSellers: 0,
      error: error.message
    };
  }
};

// Function to send order status update email to buyer
export const sendOrderStatusUpdateEmail = async (order, customerEmail, customerName, oldStatus, newStatus) => {
  try {
    console.log('📧 Sending status update email to buyer:', customerEmail);
    console.log('📧 Status change:', oldStatus, '→', newStatus);
    
    const statusMessages = {
      pending: {
        title: 'Order Received',
        message: 'Your order has been received and is being processed.',
        icon: '⏳'
      },
      processing: {
        title: 'Order Processing',
        message: 'We are preparing your items for shipment.',
        icon: '⚙️'
      },
      shipped: {
        title: 'Order Shipped',
        message: 'Your order has been shipped and is on its way!',
        icon: '🚚'
      },
      delivered: {
        title: 'Order Delivered',
        message: 'Your order has been delivered successfully.',
        icon: '✅'
      },
      cancelled: {
        title: 'Order Cancelled',
        message: 'Your order has been cancelled.',
        icon: '❌'
      }
    };

    const statusInfo = statusMessages[newStatus] || {
      title: 'Order Status Updated',
      message: `Your order status has been updated to ${newStatus}.`,
      icon: '📦'
    };

    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com",
              Name: "Carpets & Rugs Store - Order Updates"
            },
            To: [
              {
                Email: customerEmail,
                Name: customerName
              }
            ],
            Subject: `${statusInfo.icon} Order ${statusInfo.title} - #${order._id.toString().slice(-6).toUpperCase()}`,
            HTMLPart: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
                  .status-update { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #667eea; text-align: center; }
                  .status-icon { font-size: 48px; margin-bottom: 15px; }
                  .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #28a745; }
                  .product-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                  .total { font-weight: bold; font-size: 1.1em; color: #2c3e50; }
                  .footer { text-align: center; margin-top: 20px; padding: 20px; background: #2c3e50; color: white; border-radius: 5px; }
                  .next-steps { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>${statusInfo.icon} ${statusInfo.title}</h1>
                    <p>Order #${order._id.toString().slice(-6).toUpperCase()}</p>
                  </div>
                  <div class="content">
                    <div class="status-update">
                      <div class="status-icon">${statusInfo.icon}</div>
                      <h2>${statusInfo.title}</h2>
                      <p>${statusInfo.message}</p>
                      <p><strong>Previous Status:</strong> ${oldStatus}</p>
                      <p><strong>Current Status:</strong> ${newStatus}</p>
                    </div>

                    ${newStatus === 'shipped' ? `
                    <div class="next-steps">
                      <h3>🚚 What's Next?</h3>
                      <p>Your order is on the way! You can track your shipment using the tracking information provided by the seller.</p>
                      <p>Expected delivery: 3-5 business days</p>
                    </div>
                    ` : ''}

                    ${newStatus === 'delivered' ? `
                    <div class="next-steps">
                      <h3>🎉 Enjoy Your Purchase!</h3>
                      <p>We hope you love your new items! If you have any questions or need support, please contact us.</p>
                    </div>
                    ` : ''}

                    <div class="order-details">
                      <h3>📋 Order Summary</h3>
                      <p><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
                      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                      <p><strong>Customer:</strong> ${order.buyer.name}</p>
                      
                      <h4>🛍️ Order Items</h4>
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

                    <div class="order-details">
                      <h3>📦 Shipping Address</h3>
                      <p>${order.buyer.address}</p>
                      <p>${order.buyer.city}, ${order.buyer.postalCode}</p>
                      <p>${order.buyer.country}</p>
                    </div>

                    <p>If you have any questions about your order, please contact our support team.</p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br>Carpets & Rugs Store Team</p>
                    <p>📞 +1 (555) 123-4567 | ✉️ browndoor668@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('✅ Order status update email sent to buyer:', customerEmail);
    return result;
  } catch (error) {
    console.error('❌ Error sending status update email to buyer:', error);
    throw error;
  }
};

// Function to send seller approval email
export const sendSellerApprovalEmail = async (sellerEmail, sellerName, companyName = '') => {
  try {
    console.log('📧 Sending seller approval email to:', sellerEmail);
    
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com",
              Name: "Carpets & Rugs Store - Admin"
            },
            To: [
              {
                Email: sellerEmail,
                Name: sellerName
              }
            ],
            Subject: `🎉 Seller Account Approved - Welcome to Carpets & Rugs Store ${companyName ? ` - ${companyName}` : ''}!`,
            HTMLPart: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .welcome-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #10b981; text-align: center; }
                  .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                  .feature { background: white; padding: 15px; border-radius: 8px; text-align: center; }
                  .feature-icon { font-size: 24px; margin-bottom: 10px; }
                  .next-steps { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 30px; padding: 20px; background: #2c3e50; color: white; border-radius: 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 Welcome to Carpets & Rugs Store!</h1>
                    <p>Your seller account has been approved</p>
                  </div>
                  <div class="content">
                    <div class="welcome-section">
                      <h2>Congratulations, ${sellerName}!</h2>
                      <p>We're excited to inform you that your seller account${companyName ? ` for <strong>${companyName}</strong>` : ''} has been approved.</p>
                      <p>You can now start listing your products and reaching thousands of customers on our platform.</p>
                    </div>

                    <div class="next-steps">
                      <h3>🚀 Next Steps to Get Started</h3>
                      <ol style="text-align: left; margin: 15px 0;">
                        <li><strong>Login to your seller dashboard</strong></li>
                        <li><strong>Add your product catalog</strong> with images and descriptions</li>
                        <li><strong>Set up your inventory</strong> and pricing</li>
                        <li><strong>Configure shipping options</strong> for your products</li>
                        <li><strong>Start receiving orders</strong> from customers</li>
                      </ol>
                    </div>

                    <div class="features">
                      <div class="feature">
                        <div class="feature-icon">📦</div>
                        <h4>Product Management</h4>
                        <p>Easily add, edit, and manage your product listings</p>
                      </div>
                      <div class="feature">
                        <div class="feature-icon">📊</div>
                        <h4>Order Tracking</h4>
                        <p>Track and manage all your orders in one place</p>
                      </div>
                      <div class="feature">
                        <div class="feature-icon">💰</div>
                        <h4>Sales Analytics</h4>
                        <p>Monitor your sales performance and revenue</p>
                      </div>
                      <div class="feature">
                        <div class="feature-icon">👥</div>
                        <h4>Customer Reach</h4>
                        <p>Access thousands of potential customers</p>
                      </div>
                    </div>

                    <div style="text-align: center; margin: 25px 0;">
                      <a href="http://localhost:5173/login" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        🚀 Go to Seller Dashboard
                      </a>
                    </div>

                    <p style="text-align: center; color: #666;">
                      Need help getting started? Check out our <a href="#">Seller Guide</a> or contact our support team.
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br><strong>The Carpets & Rugs Store Team</strong></p>
                    <p>📞 Seller Support: +1 (555) 123-4567 | ✉️ browndoor668@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('✅ Seller approval email sent successfully to:', sellerEmail);
    return result;
  } catch (error) {
    console.error('❌ Error sending seller approval email:', error);
    throw error;
  }
};

// Function to send seller rejection email
export const sendSellerRejectionEmail = async (sellerEmail, sellerName, companyName = '') => {
  try {
    console.log('📧 Sending seller rejection email to:', sellerEmail);
    
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com",
              Name: "Carpets & Rugs Store - Admin"
            },
            To: [
              {
                Email: sellerEmail,
                Name: sellerName
              }
            ],
            Subject: `❌ Seller Application Update - Carpets & Rugs Store${companyName ? ` - ${companyName}` : ''}`,
            HTMLPart: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .message-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #ef4444; text-align: center; }
                  .next-steps { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .contact-info { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 30px; padding: 20px; background: #2c3e50; color: white; border-radius: 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Seller Application Update</h1>
                    <p>Important information regarding your application</p>
                  </div>
                  <div class="content">
                    <div class="message-section">
                      <h2>Dear ${sellerName},</h2>
                      <p>Thank you for your interest in becoming a seller on Carpets & Rugs Store.</p>
                      <p>After careful review, we regret to inform you that your seller application${companyName ? ` for <strong>${companyName}</strong>` : ''} has not been approved at this time.</p>
                      
                      <div style="background: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Common reasons for rejection include:</strong></p>
                        <ul style="text-align: left; margin: 10px 0;">
                          <li>Incomplete business information</li>
                          <li>Documentation requirements not met</li>
                          <li>Business type not aligned with our marketplace focus</li>
                          <li>Temporary pause on new seller onboarding</li>
                        </ul>
                      </div>
                    </div>

                    <div class="next-steps">
                      <h3>🔄 What You Can Do Next</h3>
                      <ol style="text-align: left; margin: 15px 0;">
                        <li><strong>Review your application</strong> for completeness and accuracy</li>
                        <li><strong>Ensure all required documents</strong> are provided and valid</li>
                        <li><strong>Consider reapplying</strong> after addressing any issues</li>
                        <li><strong>Contact our team</strong> if you have questions about the requirements</li>
                      </ol>
                    </div>

                    <div class="contact-info">
                      <h3>📞 Need More Information?</h3>
                      <p>If you have questions about this decision or would like to understand how to improve your application for future consideration, please contact our seller support team.</p>
                      <p><strong>Seller Support Email:</strong> browndoor668@gmail.com</p>
                      <p><strong>Support Phone:</strong> +1 (555) 123-4567</p>
                    </div>

                    <p style="text-align: center; color: #666;">
                      We appreciate your interest in Carpets & Rugs Store and encourage you to explore our platform as a customer.
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br><strong>The Carpets & Rugs Store Team</strong></p>
                    <p>📞 Support: +1 (555) 123-4567 | ✉️ browndoor668@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('✅ Seller rejection email sent successfully to:', sellerEmail);
    return result;
  } catch (error) {
    console.error('❌ Error sending seller rejection email:', error);
    throw error;
  }
};

// Function to send password reset email
export const sendPasswordResetEmail = async (userEmail, userName, resetCode) => {
  try {
    console.log('📧 Sending password reset email to:', userEmail);
    
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com",
              Name: "Carpets & Rugs Store - Security"
            },
            To: [
              {
                Email: userEmail,
                Name: userName
              }
            ],
            Subject: `🔒 Password Reset Code - Carpets & Rugs Store`,
            HTMLPart: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .code-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border: 2px dashed #667eea; text-align: center; }
                  .reset-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 15px 0; }
                  .security-note { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
                  .footer { text-align: center; margin-top: 30px; padding: 20px; background: #2c3e50; color: white; border-radius: 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🔒 Password Reset Request</h1>
                    <p>Use the code below to reset your password</p>
                  </div>
                  <div class="content">
                    <p>Hello <strong>${userName}</strong>,</p>
                    <p>We received a request to reset your password for your Carpets & Rugs Store account.</p>
                    
                    <div class="code-section">
                      <h3>Your Password Reset Code</h3>
                      <div class="reset-code">${resetCode}</div>
                      <p>Enter this code in the password reset form to create a new password.</p>
                    </div>

                    <div class="security-note">
                      <h4>⚠️ Security Notice</h4>
                      <p>This code will expire in <strong>15 minutes</strong>.</p>
                      <p>If you didn't request this reset, please ignore this email and ensure your account is secure.</p>
                    </div>

                    <p><strong>Need help?</strong> Contact our support team if you have any questions.</p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br><strong>The Carpets & Rugs Security Team</strong></p>
                    <p>📞 Support: +1 (555) 123-4567 | ✉️ browndoor668@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('✅ Password reset email sent successfully to:', userEmail);
    return result;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

// Function to send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (userEmail, userName) => {
  try {
    console.log('📧 Sending password reset confirmation to:', userEmail);
    
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "browndoor668@gmail.com",
              Name: "Carpets & Rugs Store - Security"
            },
            To: [
              {
                Email: userEmail,
                Name: userName
              }
            ],
            Subject: `✅ Password Reset Successful - Carpets & Rugs Store`,
            HTMLPart: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .success-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #10b981; text-align: center; }
                  .security-tips { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 30px; padding: 20px; background: #2c3e50; color: white; border-radius: 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>✅ Password Reset Successful</h1>
                    <p>Your password has been updated successfully</p>
                  </div>
                  <div class="content">
                    <div class="success-section">
                      <h2>Hello <strong>${userName}</strong>,</h2>
                      <p>Your Carpets & Rugs Store account password has been successfully reset.</p>
                      <p>You can now log in to your account using your new password.</p>
                    </div>

                    <div class="security-tips">
                      <h3>🔒 Security Tips</h3>
                      <ul style="text-align: left; margin: 15px 0;">
                        <li>Use a strong, unique password</li>
                        <li>Never share your password with anyone</li>
                        <li>Enable two-factor authentication if available</li>
                        <li>Log out from shared devices</li>
                      </ul>
                    </div>

                    <div style="text-align: center; margin: 25px 0;">
                      <a href="http://localhost:5173/login" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        🚀 Login to Your Account
                      </a>
                    </div>

                    <p style="text-align: center; color: #666;">
                      If you didn't make this change, please contact our security team immediately.
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p>Best regards,<br><strong>The Carpets & Rugs Store Security Team</strong></p>
                    <p>📞 Security Support: +1 (555) 123-4567 | ✉️ browndoor668@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        ]
      });

    const result = await request;
    console.log('✅ Password reset confirmation email sent successfully to:', userEmail);
    return result;
  } catch (error) {
    console.error('❌ Error sending password reset confirmation email:', error);
    throw error;
  }
};

// Function to send password change confirmation email
// export const sendPasswordChangeConfirmationEmail = async (userEmail, userName) => {
//   try {
//     console.log('📧 Sending password change confirmation to:', userEmail);
    
//     const request = mailjetClient
//       .post('send', { version: 'v3.1' })
//       .request({
//         Messages: [
//           {
//             From: {
//               Email: "browndoor668@gmail.com",
//               Name: "Carpets & Rugs Store - Security"
//             },
//             To: [
//               {
//                 Email: userEmail,
//                 Name: userName
//               }
//             ],
//             Subject: `✅ Password Changed Successfully - Carpets & Rugs Store`,
//             HTMLPart: `
//               <!DOCTYPE html>
//               <html>
//               <head>
//                 <style>
//                   body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                   .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                   .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//                   .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//                   .success-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #10b981; text-align: center; }
//                   .security-alert { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
//                   .footer { text-align: center; margin-top: 30px; padding: 20px; background: #2c3e50; color: white; border-radius: 8px; }
//                 </style>
//               </head>
//               <body>
//                 <div class="container">
//                   <div class="header">
//                     <h1>✅ Password Changed Successfully</h1>
//                     <p>Your account password has been updated</p>
//                   </div>
//                   <div class="content">
//                     <div class="success-section">
//                       <h2>Hello <strong>${userName}</strong>,</h2>
//                       <p>Your Carpets & Rugs Store account password was successfully changed.</p>
//                       <p>If you made this change, no further action is needed.</p>
//                     </div>

//                     <div class="security-alert">
//                       <h3>🔒 Security Alert</h3>
//                       <p>If you did NOT make this change, please contact our security team immediately as your account may be compromised.</p>
//                       <p><strong>Contact Security:</strong> browndoor668.com</p>
//                     </div>

//                     <p style="text-align: center; color: #666;">
//                       This is an automated security notification from Carpets & Rugs Store.
//                     </p>
//                   </div>
                  
//                   <div class="footer">
//                     <p>Best regards,<br><strong>The Carpets & Rugs Security Team</strong></p>
//                     <p>📞 Security Support: +1 (555) 123-4567</p>
//                   </div>
//                 </div>
//               </body>
//               </html>
//             `
//           }
//         ]
//       });

//     const result = await request;
//     console.log('✅ Password change confirmation email sent successfully to:', userEmail);
//     return result;
//   } catch (error) {
//     console.error('❌ Error sending password change confirmation email:', error);
//     throw error;
//   }
// };