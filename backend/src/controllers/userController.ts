import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import stripe from '../config/stripe';
import { Request, Response } from 'express';
import User from '../models/user';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body.data;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPassword});

        if(user){
            const customer = await stripe.customers.create({
                email,
                name,
            });

            user.stripeCustomerId = customer.id;

            await user.save();
        };

        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body.data;
        const userToLogin = await User.findOne(
            {where: 
                { email: email.trim()}
            }
        );
        if (!userToLogin) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, userToLogin.password);

        if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: userToLogin.id, userEmail: userToLogin.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'User logged in successfully', token, email, userId: userToLogin.id});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId
        });

        res.status(200).json({user, paymentMethods: paymentMethods.data});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
};

export const addPaymentMethod = async (req: Request, res: Response) => {
    const { stripeCustomerId, paymentMethodId } = req.body.data;
    try {
        await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });

        res.json({ message: 'Payment method added' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
};
  
export const processPayment = async (req: Request, res: Response) => {
    const { stripeCustomerId, amount, paymentMethodId } = req.body.data;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            customer: stripeCustomerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
        });

        res.json({ paymentIntent });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
};