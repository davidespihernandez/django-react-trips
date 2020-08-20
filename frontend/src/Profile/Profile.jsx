import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { profileActions } from '../_actions';
import { validateEmail } from "../_helpers";
import { profileService } from "../_services";
import { FaSave } from "react-icons/fa";

function Profile() {
    const profile = useSelector(state => state.profile.profile);
    const dispatch = useDispatch();

    useEffect(() => {
        profileService.getProfile()
            .then(
                profile => {
                    const user = {
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        email: profile.email,
                        username: profile.email,
                        password: "",
                        passwordRepeat: "",
                    }
                    setUser(user);
                },
                error => {
                    console.log("profile error", profile);
                }
            );
    }, []);

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
        passwordRepeat: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const updating = useSelector(state => state.profile.updating);

    function handleChange(e) {
        const { name, value } = e.target;
        setUser(user => ({ ...user, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (user.username && user.email && validateEmail(user.email) && passwordValid()) {
            const payload = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.email,
            }
            if (user.password) {
                payload.password = user.password;
            }
            dispatch(profileActions.updateProfile(payload));
        }
    }

    function passwordValid() {
        if (!user.password && !user.passwordRepeat) {
            return true;
        }
        return user.password === user.passwordRepeat;
    }

    return (
        <div className="col-xs-12" style={{marginTop: "20px"}}>
            <h5>Your profile</h5>
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
                    <label>Password</label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} className={'form-control' + (submitted && !passwordValid() ? ' is-invalid' : '')} />
                </div>
                <div className="form-group">
                    <label>Repeat password</label>
                    <input type="password" name="passwordRepeat" value={user.passwordRepeat} onChange={handleChange} className={'form-control' + (submitted && !passwordValid() ? ' is-invalid' : '')} />
                    {submitted && !passwordValid() &&
                        <div className="invalid-feedback">Passwords must match</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        {updating && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save <FaSave />
                    </button>
                </div>
            </form>
        </div>
    );
}

export { Profile };