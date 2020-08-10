'use strict'
require('dotenv').config();
const braintree = require('braintree');
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
});

async function createTransaction(req, res) {
    const bodyTransacion = req.body;
    const shippingObj = bodyTransacion.shipping;
    const billingObj = bodyTransacion.billing;
    const itemsArray = bodyTransacion.items;

    if (!bodyTransacion.paymentMethodNonce || !bodyTransacion.deviceData || !bodyTransacion.currency || bodyTransacion.totalAmount === undefined) {
        return res.status(400).send({ code: 1000, message: `Information isn't complete` });
    }
    
    if (bodyTransacion.totalAmount == 0) return res.status(400).send({ code: 1100, message:  'The quantity should greater than 0' });
    if (shippingObj && (!shippingObj.name || !shippingObj.lastName || !shippingObj.address || !shippingObj.postalCode || !shippingObj.city)) return res.status(400).send({ code: 1000, message: `Information isn't complete` });
    if (billingObj && (!billingObj.name || !billingObj.lastName || !billingObj.address || !billingObj.postalCode || !billingObj.city)) return res.status(400).send({ code: 1000, message: `Information isn't complete` });
    if (itemsArray && itemsArray.length == 0) return res.status(400).send({ code: 1000, message: `The list is empty` });
    
    const total = String(bodyTransacion.totalAmount);
    const tax = (bodyTransacion.taxAmount === undefined) ? undefined : String(bodyTransacion.taxAmount);
    const discount = (bodyTransacion.discountAmount === undefined) ? undefined : String(bodyTransacion.discountAmount);
    const shipping = (bodyTransacion.shippingAmount === undefined) ? undefined : String(bodyTransacion.shippingAmount);

    let shippingAddress = null;
    if (shippingObj) {
        shippingAddress = {
            firstName: shippingObj.name,
            lastName: shippingObj.lastName,
            streetAddress: shippingObj.address,
            locality: shippingObj.city,
            postalCode: shippingObj.postalCode
        }
    }

    let billingAddress = null;
    if (billingObj) {
        billingAddress = {
            firstName: billingObj.name,
            lastName: billingObj.lastName,
            streetAddress: billingObj.address,
            locality: billingObj.city,
            postalCode: billingObj.postalCode
        }
    }

    const lineItems = [];
    if (itemsArray !== undefined) {
        for (const item of itemsArray) {
            lineItems.push({
                name: item.name,
                productCode: item.productCode,
                kind: item.kind,
                description: item.description,
                quantity: String(item.quantity),
                unitAmount: String(item.unitAmount),
                totalAmount: String(item.totalAmount),
                taxAmount: String(item.taxAmount),
                discountAmount: String(item.discountAmount)
            });
        }
    }
    
    // orderId: if you want have an order of payments, you must uncomment the line and set the value.
    //          This value must not be the same as the previous one.
    gateway.transaction.sale({
        paymentMethodNonce: bodyTransacion.paymentMethodNonce,
        deviceData: bodyTransacion.deviceData,
        amount: total,
        taxAmount: tax,
        discountAmount: discount,
        shippingAmount: shipping,
        //orderId: '9',
        billing: billingAddress,
        shipping: shippingAddress,
        lineItems: lineItems,
        options: {
            submitForSettlement: true
        }
    }, (error, result) => {
        if (error) {
            return res.status(500).send({ code: -1, message: error.message });
        }
        
        if (!result.success) return res.status(500).send({ code: -1, message: result.message });
        // Uncomment the following line if you want to see what information contain result
        //console.log(result)
        const transaction = {
            id: result.transaction.id,
            status: result.transaction.status,
            type: result.transaction.type,
            currency: result.transaction.currencyIsoCode,
            total: result.transaction.amount,
            taxAmount: result.transaction.taxAmount,
            merchantAccountId: result.transaction.merchantAccountId,
            orderId: result.transaction.orderId,
            createdAt: result.transaction.createdAt,
            updatedAt: result.transaction.updatedAt,
            paymentInstrumentType: result.transaction.paymentInstrumentType,
            customer: {
                id: result.transaction.customer.id,
                name: result.transaction.customer.firstName,
                lastName: result.transaction.customer.lastName
            },
            billing: {
                id: result.transaction.billing.id,
                name: result.transaction.billing.firstName,
                lastName: result.transaction.billing.lastName,
                address: result.transaction.billing.streetAddress,
                city: result.transaction.billing.locality,
                postalCode: result.transaction.billing.postalCode
            },
            shipping: {
                id: result.transaction.shipping.id,
                name: result.transaction.shipping.firstName,
                lastName: result.transaction.shipping.lastName,
                address: result.transaction.shipping.streetAddress,
                city: result.transaction.shipping.locality,
                postalCode: result.transaction.shipping.postalCode
            },
            creditCard: {
                token: result.transaction.creditCard.token,
                bin: result.transaction.creditCard.bin,
                last4: result.transaction.creditCard.last4,
                cardType: result.transaction.creditCard.cardType,
                expirationMonth: result.transaction.creditCard.expirationMonth,
                expirationYear: result.transaction.creditCard.expirationYear,
                expirationDate: result.transaction.creditCard.expirationDate,
                customerLocation: result.transaction.creditCard.customerLocation,
                cardHolderName: result.transaction.creditCard.cardHolderName,
                debit: result.transaction.creditCard.debit,
                prepaid: result.transaction.creditCard.prepaid,
                commercial: result.transaction.creditCard.commercial,
                healthcare: result.transaction.creditCard.healthcare,
                payroll: result.transaction.creditCard.payroll
            }
        }
        
        return res.status(200).send(transaction);
    });
}

async function createTransactionPayPal(req, res) {
    const bodyTransacion = req.body;
    const shippingObj = bodyTransacion.shipping;
    const billingObj = bodyTransacion.billing;
    const itemsArray = bodyTransacion.items;

    if (!bodyTransacion.paymentMethodNonce || !bodyTransacion.deviceData || !bodyTransacion.currency || bodyTransacion.totalAmount === undefined) {
        return res.status(400).send({ code: 1000, message: `Information isn't complete` });
    }
    
    if (bodyTransacion.totalAmount == 0) return res.status(400).send({ code: 1100, message:  'The quantity should greater than 0' });
    if (shippingObj && (!shippingObj.name || !shippingObj.lastName || !shippingObj.address || !shippingObj.postalCode || !shippingObj.city)) return res.status(400).send({ code: 1000, message: `Information isn't complete` });
    if (billingObj && (!billingObj.name || !billingObj.lastName || !billingObj.address || !billingObj.postalCode || !billingObj.city)) return res.status(400).send({ code: 1000, message: `Information isn't complete` });
    if (itemsArray && itemsArray.length == 0) return res.status(400).send({ code: 1000, message: `The list is empty` });
    
    const total = String(bodyTransacion.totalAmount);
    const tax = (bodyTransacion.taxAmount === undefined) ? undefined : String(bodyTransacion.taxAmount);
    const discount = (bodyTransacion.discountAmount === undefined) ? undefined : String(bodyTransacion.discountAmount);
    const shipping = (bodyTransacion.shippingAmount === undefined) ? undefined : String(bodyTransacion.shippingAmount);

    let shippingAddress = null;
    if (shippingObj) {
        shippingAddress = {
            firstName: shippingObj.name,
            lastName: shippingObj.lastName,
            streetAddress: shippingObj.address,
            locality: shippingObj.city,
            postalCode: shippingObj.postalCode
        }
    }
    let billingAddress = null;
    if (billingObj) {
        billingAddress = {
            firstName: billingObj.name,
            lastName: billingObj.lastName,
            streetAddress: billingObj.address,
            locality: billingObj.city,
            postalCode: billingObj.postalCode
        }
    }

    const lineItems = [];
    if (itemsArray !== undefined) {
        for (const item of itemsArray) {
            lineItems.push({
                name: item.name,
                productCode: item.productCode,
                kind: item.kind,
                description: item.description,
                quantity: String(item.quantity),
                unitAmount: String(item.unitAmount),
                totalAmount: String(item.totalAmount),
                taxAmount: String(item.taxAmount),
                discountAmount: String(item.discountAmount)
            });
        }
    }

    // orderId: if you want have an order of payments, you must uncomment the line and set the value.
    //          This value must not be the same as the previous one.
    gateway.transaction.sale({
        paymentMethodNonce: bodyTransacion.paymentMethodNonce,
        deviceData: bodyTransacion.deviceData,
        amount: total,
        taxAmount: tax,
        discountAmount: discount,
        shippingAmount: shipping,
        //orderId: '7',
        billing: billingAddress,
        shipping: shippingAddress,
        lineItems: lineItems,
        options: {
            submitForSettlement: true
        }
    }, (error, result) => {
        if (error) {
            return res.status(500).send({ code: -1, message: error.message });
        }
        
        if (!result.success) return res.status(500).send({ code: -1, message: result.message });
        // Uncomment the following line if you want to see what information contain result
        //console.log(result)
        const transaction = {
            id: result.transaction.id,
            status: result.transaction.status,
            type: result.transaction.type,
            currency: result.transaction.currencyIsoCode,
            total: result.transaction.amount,
            taxAmount: result.transaction.taxAmount,
            merchantAccountId: result.transaction.merchantAccountId,
            orderId: result.transaction.orderId,
            createdAt: result.transaction.createdAt,
            updatedAt: result.transaction.updatedAt,
            paymentInstrumentType: result.transaction.paymentInstrumentType,
            customer: {
                id: result.transaction.customer.id,
                name: result.transaction.customer.firstName,
                lastName: result.transaction.customer.lastName
            },
            billing: {
                id: result.transaction.billing.id,
                name: result.transaction.billing.firstName,
                lastName: result.transaction.billing.lastName,
                address: result.transaction.billing.streetAddress,
                city: result.transaction.billing.locality,
                postalCode: result.transaction.billing.postalCode
            },
            shipping: {
                id: result.transaction.shipping.id,
                name: result.transaction.shipping.firstName,
                lastName: result.transaction.shipping.lastName,
                address: result.transaction.shipping.streetAddress,
                city: result.transaction.shipping.locality,
                postalCode: result.transaction.shipping.postalCode
            },
            paypalAccount: {
                token: result.transaction.paypal.token,
                paymentId: result.transaction.paypal.paymentId,
                debugId: result.transaction.paypal.debugId,
                payeeId: result.transaction.paypal.payeeId,
                payerId: result.transaction.paypal.payerId,
                payerEmail: result.transaction.paypal.payerEmail,
                payerName: result.transaction.paypal.payerFirstName,
                payerLastName: result.transaction.paypal.payerLastName,
                payerStatus: result.transaction.paypal.payerStatus,
                sellerProtectionStatus: result.transaction.paypal.sellerProtectionStatus,
                captureId: result.transaction.paypal.captureId,
                transactionFeeAmount: result.transaction.paypal.transactionFeeAmount,
                transactionFeeCurrency: result.transaction.paypal.transactionFeeCurrencyIsoCode
            }
        }
        
        return res.status(200).send(transaction);
    });
}

module.exports = { createTransactionPayPal, createTransaction }