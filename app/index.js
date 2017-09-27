import React from 'react';
import ReactDOM from 'react-dom';
import {Route, HashRouter} from 'react-router-dom'
import App from "./pages/App"


ReactDOM.render((
    <HashRouter>
        <div>
            <Route exact path="/" component={App}/>
        </div>
    </HashRouter>
), document.getElementById('root'));