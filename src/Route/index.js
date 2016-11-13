/**
 * Created by Min on 2016-11-11.
 */
import React from 'react';
import Cloud from '../Cloud';

import {Router,Route,hashHistory} from 'react-router';

var R = React.createClass({
    render(){
        return (
            <Router history={hashHistory}>
                <Route path='*' component={Cloud}/>
            </Router>
        )
    }
});

export default R;