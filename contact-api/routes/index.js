const express = require ("express");
const router = express.Router();

const { sendEmail , sendInvoice}  = require('../controllers/index')



router.post('/contact',sendEmail)
router.post('/invoice',sendInvoice)




module.exports = router;