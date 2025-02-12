import React from 'react';
import '../styles/login.css'
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/features/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import google from '../images/google.png'

function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                dispatch(setUser(result.user))
                navigate('/dashboard')
                toast.success("Login Successful!!!")
            } else {
                toast.error("Login Unsuccessful!!!")
            }
        } catch (error) {
            console.error("Error signing in:", error);
            toast.error("Something went wrong")
        }
    };

    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center position-relative">
            <div className="row justify-content-center align-items-center w-100">
                <div className="col-md-6 mt-5 pt-5 mt-md-0 pt-md-0 text-center text-md-start">
                    <div className="d-flex align-items-center mb-4 mt-5 p-0 m-0 mt-md-0 pt-md-0 justify-content-md-start custom-main-title">
                        <i className="bi bi-clipboard2 fs-1 m-0 p-0"></i>
                        <p className="h1 ms-2 m-0 p-0">TaskBuddy</p>
                    </div>
                    <div>
                        <p className='m-0 p-0'>Streamline your workflow and track progress effortlessly with our all-in-one task management app.</p>
                    </div>
                    <div className='text-center text-md-start mt-3'>
                        <button className="btn btn-dark p-2 ps-5 pe-5" onClick={handleGoogleSignIn}><img className='img-fluid custom-google-logo me-2 mb-2' src={google} alt="g-logo" /><span className='h4'>Continue with Google</span></button>
                    </div>
                </div>

                <div className="col-md-6 position-relative d-flex justify-content-center">
                    <svg className="d-none d-md-block" width="700" height="700" viewBox="0 0 1400 1400" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="700" cy="700" r="650" fill="none" stroke="purple" strokeWidth="1" />
                        <circle cx="700" cy="700" r="500" fill="none" stroke="purple" strokeWidth="1" />
                        <circle cx="700" cy="700" r="350" fill="none" stroke="purple" strokeWidth="1" />
                    </svg>
                    <svg className="d-block d-md-none mt-5" width="300" height="300" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="300" cy="300" r="300" fill="none" stroke="purple" strokeWidth="1" />
                        <circle cx="300" cy="300" r="250" fill="none" stroke="purple" strokeWidth="1" />
                        <circle cx="300" cy="300" r="200" fill="none" stroke="purple" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            <svg className="position-absolute top-0 end-0 translate-middle d-md-none" width="200" height="200" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="200" fill="none" stroke="purple" strokeWidth="1" />
            </svg>
            <svg className="position-absolute top-25 start-0 translate-middle d-md-none" width="150" height="150" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="150" r="150" fill="none" stroke="purple" strokeWidth="1" />
            </svg>
        </div>
    );
}

export default Login;
