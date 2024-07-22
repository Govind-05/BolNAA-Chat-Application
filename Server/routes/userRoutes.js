import express from 'express';
import {
    getUserProfile,
    registerUser,
    loginUser,
    searchUser,
    getUserInvites,
    deleteInvite,
    getUserRequests,
    deleteRequest,
    acceptRequest
} from '../controllers/userController.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// Occupation Roles routes
router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/getUserProfile', verifyJWT, getUserProfile);

router.post('/searchUser', verifyJWT, searchUser);

router.get('/getUserInvites', verifyJWT, getUserInvites);

router.get('/getUserRequests', verifyJWT, getUserRequests);

router.post('/deleteInvite', verifyJWT, deleteInvite);

router.post('/deleteRequest', verifyJWT, deleteRequest);

router.post('/acceptRequest', verifyJWT, acceptRequest);



export default router;
