import express from 'express';
import { authToken } from '../middlewares/auth';
import { createUser, login, getUserById, addPaymentMethod, processPayment } from '../controllers/userController';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', login);

router.get('/user/:id', authToken, getUserById);

router.post('/user/new-payment-method', authToken, addPaymentMethod);
router.post('/user/new-payment', authToken, processPayment);

export default router;