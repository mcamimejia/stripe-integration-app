import React, { useState, useContext, FormEvent  } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import api from '../api';
import { User } from '../dataTypes/User';

const Login: React.FC = () => {
    const [user, setUser] = useState<Partial<User>>({});
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [infoMessage, setInfoMessage] = useState<string>('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const apiCall = api();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');
        if(validateInputs()){
            try {
                const response = await apiCall.post('/api/login', {
                    data: {
                        email: user.email,
                        password: user.password,
                    }
                });

                if (response.status === 200) {
                    const { token, email, userId } = response.data;
                    login(token, email, userId);
                    navigate('/');
                } else {
                    setError('Login failed');
                }
            } catch (error: any) {
                setError(error.response?.data?.error || 'Error Logging in');
            }
        }
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');
        if(validateInputs()){
            try {
                const response = await apiCall.post('/api/signup', {
                    data: {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                    }
                });

                if (response.status === 200) {
                    setUser({});
                    setInfoMessage('User created successfully');
                    setIsSignUp(false);
                } else {
                    setError('Error creating user');
                }
            } catch (error: any) {
                setError(error.response?.data?.error || 'Error creating user');
            }
        }
    };

    const validateInputs = () => {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (isSignUp && (!user.name || user.name.length < 3)) {
            setError('Please enter a valid Name.');
            isValid = false;
        } else if (!user.email || !emailRegex.test(user.email)) {
            setError('Please enter a valid Email.');
            isValid = false;
        } else if (!user.password || user.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setError('');
        }
    
        return isValid;
    };

    const toggleSignInSignUp = () => {
        setError('');
        setInfoMessage('');
        setIsSignUp(!isSignUp);
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">
                                {isSignUp ? 'Sign Up' : 'Login'}
                            </h2>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {infoMessage && (
                                <div className="alert alert-success">{infoMessage}</div>
                            )}

                            <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                                {isSignUp && (
                                    <div className="mb-5">
                                        <label htmlFor="name" className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={user.name || ''}
                                            onChange={(e) =>
                                                setUser({ ...user, name: e.target.value })
                                            }
                                            required={isSignUp}
                                        />
                                    </div>
                                )}
                                <div className="mb-5">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={user.email || ''}
                                        onChange={(e) =>
                                            setUser({ ...user, email: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={user.password || ''}
                                        onChange={(e) =>
                                            setUser({ ...user, password: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                >
                                    {isSignUp ? 'Sign Up' : 'Login'}
                                </button>
                            </form>

                            <div className="text-center">
                                <button
                                    className="btn btn-outline-primary mb-3"
                                    onClick={toggleSignInSignUp}
                                >
                                    {isSignUp
                                        ? 'If already have an account Login here'
                                        : 'Create an account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;