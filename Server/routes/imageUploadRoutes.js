import express from 'express';

import verifyJWT from '../middlewares/verifyJWT.js';
import upload from '../middlewares/multerMiddleware.js';
import { uploadImage } from '../controllers/imageUploadController.js';

const router = express.Router();

router.post("",verifyJWT,upload.single('image'),uploadImage)

export default router;
