const express = require('express');
const router = express.Router();
const championController = require('../controllers/championController');
const { validateChampion } = require('../middleware/validation');

router.get('/', championController.getAllChampions);

router.get('/:id', championController.getChampionById);

router.post('/', validateChampion, championController.createChampion);

router.put('/:id', validateChampion, championController.updateChampion);

router.delete('/:id', championController.deleteChampion);

module.exports = router;