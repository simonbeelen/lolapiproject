const express = require('express');
const router = express.Router();
const championController = require('../controllers/championController');

router.get('/', championController.getAllChampions);
router.get('/:id', championController.getChampionById);
router.post('/', championController.createChampion);
router.put('/:id', championController.updateChampion);
router.delete('/:id', championController.deleteChampion);

module.exports = router;