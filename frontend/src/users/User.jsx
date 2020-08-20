import React, {Fragment, useEffect, useState} from 'react';
import {
    Link,
    useParams,
} from "react-router-dom";
import { userDetailService } from "../_services";
import { useDispatch, useSelector } from 'react-redux';
import { userDetailActions } from "../_actions";
import { FaSave, FaTimes } from 'react-icons/fa';
import { isAdmin, validateEmail } from "../_helpers";


function User() {
    let { userId } = useParams();

    const user = useSelector(state => state.userDetail.user);
    const profile = useSelector(state => state.profile.profile);
    const deleting = useSelector(state => state.userDetail.deleting);
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        id: "",
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        password: "",
        passwordRepeat: "",
    });

    useEffect(() => {
        userDetailService.get(userId)
            .then(
                user => {
                    const userInitialData = {
                        id: user.id,
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role: user.role,
                        password: "",
                        passwordRepeat: "",
                    }
                    setUserData(userInitialData);
                },
                error => {
                    console.log("user retrieve error", user);
                }
            );
    }, []);

    const [submitted, setSubmitted] = useState(false);
    const updating = useSelector(state => state.userDetail.updating);

    function handleChange(e) {
        const { name, value } = e.target;
        setUserData(userData => ({ ...userData, [name]: value }));
    }

    function passwordValid() {
        if (!userData.password && !userData.passwordRepeat) {
            return true;
        }
        return userData.password === userData.passwordRepeat;
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (userData.first_name && userData.email && userData.role && passwordValid()) {
            const payload = {
                id: userData.id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
            }
            if (userData.password) {
                payload.password = userData.password;
            }
            dispatch(userDetailActions.update(payload));
        }
    }

    function deleteUser() {
        if(confirm("Delete this user?")) {
            dispatch(userDetailActions.delete(userData.id));
        }
    }

    function renderTitle() {
        return (
            <div className="form-row">
                <div className={"form-group col"} >
                    <h5>
                        {userData && ("#" + userData.id + ": ")} User detail
                    </h5>
                </div>
                <div className={"form-group col d-flex justify-content-end"} >
                    <Link to={"/users"} className="btn btn-link">Go to list</Link>
                </div>
            </div>
        );
    }

    function renderRoleSelect() {
        const admin = isAdmin(profile);
        return (
            <select className="form-control" name="role" onChange={handleChange} value={userData.role}>
                <option value={1}>Regular</option>
                <option value={2}>Manager</option>
                {admin && <option value={3}>Admin</option>}
            </select>
        );

    }

    function renderModifyButtons(){
        if (!profile || !userData) {
            return null;
        }
        if (profile.role >= userData.role) {
            return (
                <div className="form-group">
                    <button className="btn btn-primary">
                        {updating && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save <FaSave />
                    </button>
                    <button className="btn btn-danger float-right" onClick={deleteUser}>
                        {deleting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Delete <FaTimes />
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="col-xs-12" style={{marginTop: "20px"}}>
            {renderTitle()}
            <hr />
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="first_name" value={userData.first_name} onChange={handleChange} className={'form-control'} />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="last_name" value={userData.last_name} onChange={handleChange} className={'form-control'} />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input type="text" name="email" value={userData.email} onChange={handleChange} className={'form-control' + (submitted && (!userData.email || !validateEmail(userData.email)) ? ' is-invalid' : '')} />
                    {submitted && (!userData.email || !validateEmail(userData.email)) &&
                    <div className="invalid-feedback">A valid email is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Username *</label>
                    <input type="text" name="username" value={userData.username} onChange={handleChange} className={'form-control' + (submitted && !userData.username ? ' is-invalid' : '')} />
                    {submitted && !userData.username &&
                        <div className="invalid-feedback">Username is required</div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    {renderRoleSelect()}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={userData.password} onChange={handleChange} className={'form-control' + (submitted && !passwordValid() ? ' is-invalid' : '')} />
                </div>
                <div className="form-group">
                    <label>Repeat password</label>
                    <input type="password" name="passwordRepeat" value={userData.passwordRepeat} onChange={handleChange} className={'form-control' + (submitted && !passwordValid() ? ' is-invalid' : '')} />
                    {submitted && !passwordValid() && <div className="invalid-feedback">Passwords must match</div>}
                </div>
                {renderModifyButtons()}
            </form>
        </div>
    );
}

export { User };