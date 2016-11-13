/**
 * Created by Min on 2016-11-12.
 */
import React from 'react';
import {Icon} from 'antd';
import './index.css';
var Loading = React.createClass({
    render(){
        return (
            <div className="loading">
                <div className="loading-content">
                    <span className="loading-icon">
                        <Icon type="loading"/>
                    </span>
                    <p>正在加载...</p>
                </div>

            </div>
        )
    }
});

export default Loading;