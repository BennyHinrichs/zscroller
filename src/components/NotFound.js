import { Link } from 'react-router-dom';
import React from 'react';

const NotFound = () => (
    <div>
        <p>404 Not Found!</p>
        <Link to="/">Home</Link> {/*This is how you do clientside routing*/}
    </div>
);

export default NotFound;