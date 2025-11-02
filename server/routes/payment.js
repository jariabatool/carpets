// routes/payment.js
import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RzdFt3B6rjlGaEZFAS8rTqeS6DkejQEYXLLF6tZZDdC0W2wQC2nxyJLIGt6scbS0NLPuzHc0HnLLFTBJrx0ZwdM006jWSgvFo');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, buyer } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_name: buyer.name,
        customer_email: buyer.email
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

export default router;