import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AuthProvider from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Home from './components/Home';
import NavBar from './components/NavBar';

const App = () => {
    return (
        <React.Fragment>
            <AuthProvider>
                <Router>
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<PrivateRoute component={Home}/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </Router>
            </AuthProvider>
        </React.Fragment>
    );
}

export default App;
