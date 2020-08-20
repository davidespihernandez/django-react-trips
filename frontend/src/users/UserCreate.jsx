import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userListActions } from "../_actions";
import { FaSave } from 'react-icons/fa';
import { isAdmin, validateEmail } from "../_helpers";


function UserCreate() {
    const profile = useSelector(state => state.profile.profile);
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

    const [submitted, setSubmitted] = useState(false);
    const creating = useSelector(state => state.userList.creating);

    function handleChange(e) {
        const { name, value } = e.target;
        setUserData(userData => ({ ...userData, [name]: value }));
    }

    function formIsValid() {
        if (!userData.username) {
            return false;
        }
        if (!userData.email || !validateEmail(userData.email)) {
            return false;
        }
        if (!userData.role) {
            return false;
        }
        return passwordValid();
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (formIsValid()) {
            const payload = {
                id: userData.id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
                password: userData.password,
                passwordRepeat: userData.passwordRepeat,
            }
            dispatch(userListActions.create(payload));
        }
    }

    function renderTitle() {
        return (
            <div className="form-row">
                <div className={"form-group col"} >
                    <h5>
                        Create new user
                    </h5>
                </div>
            </div>
        );
    }

    function renderRoleSelect() {
        const admin = isAdmin(profile);
        return (
            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select className={"form-control" + (submitted && !userData.role ? ' is-invalid' : '')}
                        name="role" onChange={handleChange} value={userData.role}>
                    <option value=""> </option>
                    <option value={1}>Regular</option>
                    <option value={2}>Manager</option>
                    {admin && <option value={3}>Admin</option>}
                </select>
                {submitted && !userData.role && <div className="invalid-feedback">Role is mandatory</div>}
            </div>
        );

    }

    function renderModifyButtons(){
        if (!profile) {
            return null;
        }
        return (
            <div className="form-group">
                <button className="btn btn-primary">
                    {creating && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save <FaSave />
                </button>
            </div>
        );
    }

    function passwordValid() {
        if (!userData.password && !userData.passwordRepeat) {
            return false;
        }
        return userData.password === userData.passwordRepeat;
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
                {renderRoleSelect()}
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={userData.password} onChange={handleChange} className={'form-control' + (submitted && !passwordValid() ? ' is-invalid' : '')} />
                </div>
                <div className="form-group">
                    <label>Repeat password</label>
                    <input type="password" name="passwordRepeat" value={userData.passwordRepeat} onChange={handleChange} className={'form-control' + (submitted && !passwordValid() ? ' is-invalid' : '')} />
                    {submitted && !passwordValid() &&
                        <div className="invalid-feedback">Password is mandatory and both must match</div>
                    }
                </div>
                {renderModifyButtons()}
            </form>
        </div>
    );
}

export { UserCreate };