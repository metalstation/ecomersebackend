const router = require('express').Router();

//import blogs route 
const Access = require('./Access');

router.use('/', Access);

module.exports = router; 