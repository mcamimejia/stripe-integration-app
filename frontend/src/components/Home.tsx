import React, { useState, useContext, FormEvent, useEffect  } from 'react';
import { AuthContext } from './AuthProvider';
import api from '../api';
import { User, PaymentMethod } from '../dataTypes/User';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const Home: React.FC = () => {
    const [userDetails, setUserDetails] = useState<Partial<User | null>>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [infoMessage, setInfoMessage] = useState<string>('');

    const { user } = useContext(AuthContext);
    const apiCall = api();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userResponse = await apiCall.get(`/api/user/${user?.userId}`);
            setUserDetails(userResponse.data.user);
            setPaymentMethods(userResponse.data.paymentMethods);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Error getting user details.');
        }
    };

    const handleAddPaymentMethod = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');

        if (!stripe || !elements) {
            setError('Stripe not configured.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement!,
        });

        if (stripeError) {
            setError(stripeError.message || 'Error creating payment method.');
            return;
        }

        if (!paymentMethod || !userDetails) {
            setError('Invalid data to add a new payment method.');
            return;
        }

        try {
            const response = await apiCall.post('/api/user/new-payment-method', {
                data: {
                    stripeCustomerId: userDetails.stripeCustomerId,
                    paymentMethodId: paymentMethod.id,
                }
            });

            if (response.status === 200) {
                setInfoMessage('Payment method successfully added');
                fetchData();
            } else {
                setError('Error adding payment method.');
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'Error adding payment method.');
        }

    };

    const handleMakePayment = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');

        if (!stripe || !elements) {
            setError('Stripe not configured.');
            return;
        }

        if(!userDetails || !selectedPaymentMethod || !paymentAmount || paymentAmount <= 0) {
            setError('Invalid data to make a payment.');
            return;
        }

        try {
            const response = await apiCall.post('/api/user/new-payment', {
                data: {
                    stripeCustomerId: userDetails.stripeCustomerId,
                    amount: paymentAmount * 100,
                    paymentMethodId: selectedPaymentMethod
                }
            });

            if (response.status === 200) {
                setInfoMessage('Payment successful.');
            } else {
                setError('Error processing payment.');
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'Error processing payment.');
        }
    };

    return (
        <div className="container mt-5">
            {infoMessage && <div className="alert alert-success">{infoMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <h2>Welcome!</h2>

            {userDetails && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">User Details</h5>
                        <p><strong>Name:</strong> {userDetails.name}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                        <p><strong>Stripe Customer ID:</strong> {userDetails.stripeCustomerId}</p>
                    </div>
                </div>
            )}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Saved Payment Methods</h5>
                    {paymentMethods && paymentMethods.length > 0
                        ? <ul className="list-group">
                            {paymentMethods.map((method, index) => (
                                <li key={index} className="list-group-item">
                                    {method.card.brand} **** {method.card.last4}
                                </li>
                            ))}
                        </ul>
                        : <p><strong>No payment methods saved</strong></p>
                    }
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Add New Payment Method</h5>
                    <form onSubmit={handleAddPaymentMethod}>
                        <div className="mb-3">
                            <label className="form-label">Card Details</label>
                            <CardElement />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Payment Method</button>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Make Payment</h5>
                    {paymentMethods && paymentMethods.length > 0 
                        ? <form onSubmit={handleMakePayment}>
                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={paymentAmount || ''}
                                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Select Payment Method</label>
                                <select
                                    className="form-select"
                                    value={selectedPaymentMethod || ''}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    required
                                >
                                    <option value={''}>Select...</option>
                                    {paymentMethods.map((method, index) => (
                                        <option key={index} value={method.id}>
                                            {method.card.brand} **** {method.card.last4}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Make Payment</button>
                        </form>
                        : <p><strong>Please add first a payment method</strong></p>
                    }
                </div>
            </div>
        </div>
    );
}

export default Home;