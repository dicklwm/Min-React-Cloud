/**
 * Created by Min on 2016-11-12.
 */
import React from 'react';
import {Icon,Breadcrumb } from 'antd';
import {Link} from 'react-router';
import './index.css'

var Nav=React.createClass({
    render(){
        const {value} = this.props;
        var to='';
        var nodes=[];
        if (typeof value==='object') {
            nodes=value.map(function (o, i) {
                to=to + '/' + o;
                return (
                    <Breadcrumb.Item href="" key={i}>
                        <Link to={to}>{o}</Link>
                    </Breadcrumb.Item>
                )
            })
        }


        return (
            <div className="app-nav">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href="">
                        <Link to={'/'}>
                            <Icon type="home"/>首页
                        </Link>
                    </Breadcrumb.Item>
                    {nodes}
                </Breadcrumb>
            </div>
        )
    }
});

export default Nav;