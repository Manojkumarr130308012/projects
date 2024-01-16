const router = require('express').Router();
const businessController = require('../controller/business');


router.post('/add', async (req, res) => {
    res.send(await businessController.add(req.body));
});
router.get('/', async (req, res) => {
    res.send(await businessController.fetch());
});
router.get('/fetchlorders', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const response = await businessController.fetchdata(req.query.id);
	res.send(response);
})
router.delete('/delete', async (req, res) => {
	const response = await businessController.delete(req.query.id);
	res.send(response);
})
router.put('/update', async (req, res) => {
	const response = await businessController.update(req.query.id, req.body);
	res.send(response);
})


module.exports = router;