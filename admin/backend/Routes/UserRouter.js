const { getUserById } = require('../Controllers/UserController');

const router = require ('express').Router();

router.get('/get-by-id/:id', getUserById);

module.exports = router;