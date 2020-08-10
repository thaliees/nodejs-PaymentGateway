const router = require('express').Router();
const PaymentController = require('../Controllers/PaymentGatewayController');

router.post('/payment/paypal', PaymentController.createTransactionPayPal);
router.post('/payment', PaymentController.createTransaction);

module.exports = router;