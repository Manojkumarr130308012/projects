const router = require('express').Router();
const serviceController = require('../controller/service');


router.post('/add', async (req, res) => {
    res.send(await serviceController.add(req.body));
});
router.get('/', async (req, res) => {
    res.send(await serviceController.fetch());
});
router.get('/fetchlservice', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const response = await serviceController.fetchdata(req.query.id);
	res.send(response);
})
router.delete('/delete', async (req, res) => {
	const response = await serviceController.delete(req.query.id);
	res.send(response);
})
router.put('/update', async (req, res) => {
	const response = await serviceController.update(req.query.id, req.body);
	res.send(response);
})


module.exports = router;