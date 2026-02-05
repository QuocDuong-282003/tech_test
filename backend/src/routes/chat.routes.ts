import { Router } from 'express';
import * as chatController from '../controllers/chatController';

const router = Router();

router.get('/history/:userId/:otherId', chatController.getHistory);

export default router;
