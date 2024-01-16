const router = require('express').Router();
const merchantController = require('../controller/merchant');


router.post('/add', async (req, res) => {
    res.send(await merchantController.add(req.body));
});
router.get('/', async (req, res) => {
    res.send(await merchantController.fetch());
});
router.get('/fetchlorders', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const response = await merchantController.fetchdata(req.query.id);
	res.send(response);
})
router.delete('/delete', async (req, res) => {
	const response = await merchantController.delete(req.query.id);
	res.send(response);
})
router.put('/update', async (req, res) => {
	const response = await merchantController.update(req.query.id, req.body);
	res.send(response);
})


module.exports = router;