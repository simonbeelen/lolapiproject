const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { validateItem } = require('../middleware/validation');

router.get('/', itemController.getAllItems);

router.get('/:id', itemController.getItemById);

router.post('/', validateItem, itemController.createItem);

router.put('/:id', validateItem, itemController.updateItem);

router.delete('/:id', itemController.deleteItem);

module.exports = router;