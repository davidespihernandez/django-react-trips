import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userListActions, profileActions } from '../_actions';
import { Link } from "react-router-dom";
import queryString from 'query-string'
import "react-datetime/css/react-datetime.css";
import {
    useRouteMatch,
} from "react-router-dom";
import { FaFilter, FaPlus } from 'react-icons/fa';
import { roleDescription } from "./helpers";


function UserList() {
    let { url } = useRouteMatch();
    const userList = useSelector(state => state.userList.list);
    const loading = useSelector(state => state.userList.loading);
    const filterButtonRef = useRef(null);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "role": "",
    });

    function search() {
        const parsed = queryString.parse(location.search);
        if (!("offset" in parsed)) {
            parsed.offset = "0";
        }
        const finalFilter = {
            ...filter,
            ...parsed,
        };
        setFilter(finalFilter);
        dispatch(userListActions.get(finalFilter));
    }

    useEffect(() => {
        search();
    }, [location.search]);

    function renderRow(user) {
        return (
            <tr key={user.id}>
                <td><Link to={`${url}/${user.id}`}>{user.id}</Link></td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{roleDescription(user.role)}</td>
            </tr>
        );
    }

    function renderLoading() {
        if (loading) {
            return <span className="spinner-border spinner-border-sm mr-1"> </span>;
        }
        return null;
    }
    function renderTable() {
        if (!userList) {
            return null;
        }
        return (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                    </tr>
                    </thead>
                    <tbody>
                        {userList.results.map(renderRow)}
                    </tbody>
                </table>
        );
    }

    function renderTitle() {
        let title = "User list"
        if (userList) {
            title += ": " + userList.count + " users in total";
        }
        return (
            <div className="form-row">
                <div className={"form-group col"} >
                    <h5>{title}</h5>
                </div>
                <div className={"form-group col d-flex justify-content-end"} >
                    <Link to={"/users/create"} className="btn btn-success" style={{marginRight: "10px"}}>Create new <FaPlus /></Link>
                </div>
            </div>
        );
    }

    function getLink(backendLink) {
        let index  = backendLink.indexOf('?');
        return backendLink.substr(index);
    }

    function onClickNext() {
        setPage(page + 1);
    }

    function onClickPrevious() {
        setPage(page - 1);
    }

    function renderPagination() {
        if (!userList) {
            return null;
        }
        return (
            <div className="row">
                <div className="col">
                    {userList.previous && <Link to={getLink(userList.previous)} className="btn btn-link" onClick={onClickPrevious}>&lt; Previous</Link>}
                </div>
                <div className="col text-center">
                    Page {page}
                </div>
                <div className="col text-right">
                    {userList.next && <Link to={getLink(userList.next)} className="btn btn-link" onClick={onClickNext}>Next &gt;</Link>}
                </div>
            </div>
        );
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFilter(f => ({ ...filter, [name]: value }));
    }

    function getFormFilterLink() {
        const finalFilter = {
            ...filter,
        };
        finalFilter.offset = 0;
        const qs = new URLSearchParams(finalFilter).toString();
        return `/users?${qs}`;
    }

    function onClickFilter() {
        setPage(1);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            filterButtonRef.current.click();
        }
    }

    function renderFilterForm() {
        return (
            <form>
                <div className="form-row">
                    <div className="form-group col">
                        <label htmlFor="first_name">First name</label>
                        <input type="text" name="first_name" value={filter.first_name} onChange={handleChange} className={'form-control'} onKeyDown={handleKeyDown} />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="last_name">Last name</label>
                        <input type="text" name="last_name" value={filter.last_name} onChange={handleChange} className={'form-control'} onKeyDown={handleKeyDown} />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="comment">Email</label>
                        <input type="text" name="email" value={filter.email} onChange={handleChange} className={'form-control'} onKeyDown={handleKeyDown} />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="role">Role</label>
                        <select className="form-control" name="role" onChange={handleChange}>
                            <option value={""}> </option>
                            <option value={1}>Regular</option>
                            <option value={2}>Manager</option>
                            <option value={3}>Admin</option>
                        </select>
                    </div>
                    <div className="form-group col d-flex align-items-end justify-content-end">
                        <Link ref={filterButtonRef} to={getFormFilterLink()} name={"filter"} className="btn btn-primary" onClick={onClickFilter}>Filter <FaFilter /></Link>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <div className="col-xs-12" style={{marginTop: "20px"}}>
            {renderTitle()}
            <hr />
            {renderFilterForm()}
            {loading && renderLoading()}
            {!loading && renderPagination()}
            {!loading && renderTable()}
        </div>
    );
}

export { UserList };