import express from 'express';
import {
    getUserProfile,
    registerUser,
    loginUser,
    searchUser,
    getUserInvites
} from '../controllers/userController.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// Occupation Roles routes
router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/getUserProfile', verifyJWT, getUserProfile);

router.post('/searchUser', verifyJWT, searchUser);

router.get('/getUserInvites', verifyJWT, getUserInvites);

export default router;
