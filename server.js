const express = require('express');
const stripe = require('stripe')('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'); // Replace with your Stripe secret key
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files directly from the root directory
app.use(express.static(__dirname)); // Serve static files from the root directory

// Serve cancel and success pages
app.get('/cancel.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'cancel.html'));
});

app.get('/success.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'success.html'));
});

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { productName, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productName,
                    },
                    unit_amount: amount, // Amount in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4000/success.html', // Redirect to success page
        cancel_url: 'http://localhost:4000/cancel.html',   // Redirect to cancel page
    });

    res.json({ id: session.id });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
