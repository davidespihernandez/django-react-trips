import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { validateEmail } from "../_helpers";

import { userActions } from '../_actions';

function RegisterPage() {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
        passwordRepeat: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const registering = useSelector(state => state.registration.registering);
    const dispatch = useDispatch();

    // reset login status
    useEffect(() => {
        dispatch(userActions.logout());
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setUser(user => ({ ...user, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (user.username && user.password && user.passwordRepeat === user.password &&
                user.email && validateEmail(user.email)) {
            dispatch(userActions.register(user));
        }
    }

    return (
        <div className="col-xs-12" style={{marginTop: "20px"}}>
            <h5>Register</h5>
            <hr />
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="first_name" value={user.first_name} onChange={handleChange} className={'form-control'} />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="last_name" value={user.last_name} onChange={handleChange} className={'form-control'} />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input type="text" name="email" value={user.email} onChange={handleChange} className={'form-control' + (submitted && (!user.email || !validateEmail(user.email)) ? ' is-invalid' : '')} />
                    {submitted && (!user.email || !validateEmail(user.email)) &&
                        <div className="invalid-feedback">A valid email is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Username *</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} className={'form-control' + (submitted && !user.username ? ' is-invalid' : '')} />
                    {submitted && !user.username &&
                        <div className="invalid-feedback">Username is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Password *</label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} className={'form-control' + (submitted && !user.password ? ' is-invalid' : '')} />
                    {submitted && !user.password &&
                        <div className="invalid-feedback">Password is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Repeat password *</label>
                    <input type="password" name="passwordRepeat" value={user.passwordRepeat} onChange={handleChange} className={'form-control' + (submitted && user.passwordRepeat !== user.password ? ' is-invalid' : '')} />
                    {submitted && user.passwordRepeat !== user.password &&
                        <div className="invalid-feedback">Passwords doesn't match</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        {registering && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Register
                    </button>
                    <Link to="/login" className="btn btn-link">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

export { RegisterPage };