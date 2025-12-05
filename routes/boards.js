const express = require('express');
const router = express.Router();
const boardsController = require('../controllers/boards');
const checkToken = require('../config/checkToken');

router.use(checkToken);

router.get('/', boardsController.index);
router.post('/', boardsController.create);
router.get('/:id', boardsController.show);
router.delete('/:id', boardsController.delete);
router.put('/:id', boardsController.update);

module.exports = router;