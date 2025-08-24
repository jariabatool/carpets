import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutPage.css";

// Initialize Stripe with your publishable key

// Country options with 2-letter codes
const countryOptions = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Pakistan", code: "PK" },
  { name: "India", code: "IN" },
  // Add more countries as needed
];

// Stripe Payment Form Component
function StripePaymentForm({ 
  formData, 
  cart, 
  totalAmount, 
  delivery, 
  onSuccess, 
  onError 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setStripeError(null);

    try {
      // Create payment intent on your server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round((totalAmount + delivery) * 100), // Convert to cents
          currency: "usd",
          buyer: formData
        })
      });

      const { clientSecret, error: serverError } = await response.json();

      if (serverError) {
        throw new Error(serverError);
      }

      // Confirm the payment with the card details
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.mobile,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.countryCode, // Use the 2-letter country code
            },
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setStripeError(err.message);
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="stripe-payment-form">
      <div className="input-group">
        <label>Card Details</label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      {stripeError && <div className="stripe-error">{stripeError}</div>}
      <button 
        type="button" 
        onClick={handleSubmit} 
        disabled={!stripe || processing}
        className={`stripe-pay-btn ${processing ? 'processing' : ''}`}
      >
        {processing ? 'Processing Payment...' : `Pay $${(totalAmount + delivery).toFixed(2)}`}
      </button>
    </div>
  );
}

// Main Checkout Component
export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    country: "",
    countryCode: "US", // Default to US
    postalCode: "",
    paymentMethod: "cod"
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 250;
  const grandTotal = totalAmount + delivery;

  useEffect(() => {
    // Reset payment error when payment method changes
    setPaymentError(null);
  }, [formData.paymentMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // If paying online, the Stripe form will handle the submission
    if (formData.paymentMethod === "online") {
      return;
    }
    
    // For COD, proceed with the original flow
    setIsLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            countryCode: formData.countryCode,
            postalCode: formData.postalCode
          },
          products: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            sellerId: item.sellerId,
            price: item.price,
            quantity: item.quantity,
            variant: {
              color: item.selectedVariant?.color || null,
              size: item.selectedVariant?.size || null
            }
          })),
          totalAmount,
          deliveryCharges: delivery,
          paymentMethod: formData.paymentMethod,
          paid: formData.paymentMethod === "online"
        })
      });

      if (res.ok) {
        setSubmitted(true);
        clearCart();
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnlinePaymentSuccess = async (paymentIntentId) => {
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            countryCode: formData.countryCode,
            postalCode: formData.postalCode
          },
          products: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            sellerId: item.sellerId,
            price: item.price,
            quantity: item.quantity,
            variant: {
              color: item.selectedVariant?.color || null,
              size: item.selectedVariant?.size || null
            }
          })),
          totalAmount,
          deliveryCharges: delivery,
          paymentMethod: "online",
          paid: true,
          paymentIntentId
        })
      });

      if (res.ok) {
        setSubmitted(true);
        clearCart();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Order failed");
      }
    } catch (err) {
      console.error("Order error:", err);
      setPaymentError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCountryChange = (e) => {
    const selectedOption = countryOptions.find(option => option.code === e.target.value);
    setFormData({
      ...formData,
      country: selectedOption ? selectedOption.name : "",
      countryCode: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="checkout-container">
        <div className="success-animation">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2>🎉 Order Confirmed!</h2>
        <p>Thank you for your purchase. We'll process it shortly.</p>
        <button className="home-btn" onClick={() => navigate("/")}>
          Go to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              required
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Shipping Address</h3>
          <div className="input-group">
            <textarea
              name="address"
              placeholder="Street Address"
              required
              value={formData.address}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-row">
            <div className="input-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                required
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Country</label>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleCountryChange}
              required
            >
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="input-group">
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
          
          {formData.paymentMethod === "online" && (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                formData={formData}
                cart={cart}
                totalAmount={totalAmount}
                delivery={delivery}
                onSuccess={handleOnlinePaymentSuccess}
                onError={setPaymentError}
              />
            </Elements>
          )}
        </div>

        <div className="summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cart.map((item) => (
              <div key={item._id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  {item.selectedVariant && (
                    <span className="item-variant">
                      ({item.selectedVariant.color}, {item.selectedVariant.size})
                    </span>
                  )}
                  <span className="item-quantity">x {item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <div className="summary-row grand-total">
              <span>Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {formData.paymentMethod === "cod" && (
          <button 
            type="submit" 
            disabled={cart.length === 0 || isLoading}
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Confirm Order'}
          </button>
        )}
        
        {paymentError && (
          <div className="payment-error">
            {paymentError}
          </div>
        )}
      </form>
    </div>
  );
}