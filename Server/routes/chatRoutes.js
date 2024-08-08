import express from 'express';
import verifyJWT from '../middlewares/verifyJWT.js';
import { getChatMessages, getChatsInfo } from '../controllers/chatsController.js';

const router = express.Router();

router.get("/getChatsInfo",verifyJWT,getChatsInfo)
router.get("/getChatMessages",verifyJWT,getChatMessages)

export default router;
