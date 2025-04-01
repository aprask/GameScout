import express from 'express';
import { resourceSharer } from '../middleware/resource.js';
const router = express.Router();
router.use(resourceSharer);

router.get('/', (req, res) => {
    res.sendStatus(200);
})

export default router;