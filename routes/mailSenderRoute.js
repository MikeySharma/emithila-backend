const {mailSender} = require('../controller/mailSenderCtrl');

const express = require('express');
const router = express.Router();

router.post("/send", mailSender);

module.exports = router;