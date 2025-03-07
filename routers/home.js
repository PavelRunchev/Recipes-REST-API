const router = require('express').Router();
const controllers = require('../controllers');

router.get('/', controllers.home.index);
router.get('/api', controllers.home.proba);

module.exports = router;