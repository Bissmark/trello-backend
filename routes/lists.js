const express = require('express');
const router = express.Router();
const listsController = require('../controllers/lists');
const checkToken = require('../config/checkToken');

router.use(checkToken);

router.get('/', listsController.index);
router.post('/', listsController.create);
router.delete('/:id', listsController.delete);
router.put('/:id', listsController.update);

module.exports = router;