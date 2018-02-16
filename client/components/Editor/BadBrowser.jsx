import React from 'react';

const BadBrowser = ({ name }) => (
    <section style={{display:'none'}} className="BadBrowser hero is-medium is-warning">
        <div className="hero-body">
            <div className="container has-text-centered">
                <h1 className="title">We're sorry...</h1>
                <h2 className="subtitle">But your browser is too old to display Naphcart properly</h2>
                <h2 className="subtitle"><a href="http://outdatedbrowser.com/" className="button">Update your browser</a></h2>
            </div>
        </div>
    </section> 
);

export default BadBrowser