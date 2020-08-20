import React from 'react';
import { useRouteMatch } from 'react-router-dom';

function NotFound() {
    const { path, url } = useRouteMatch();

    return (<p>Resource not found: {path} {url}</p>);
}

export { NotFound };