const express = require('express');
const router = express.Router();
const { createReferral, getOwnerByCode } = require('../controllers/referralController');

router.post('/create', createReferral);
router.get('/owner/:code', getOwnerByCode);

module.exports = router;
