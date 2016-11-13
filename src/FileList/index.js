/**
 * Created by Min on 2016-11-12.
 */
import React from 'react';
import './index.css';
import {hashHistory} from 'react-router';
import {Icon} from 'antd';
import './index.css';
const host='http://101.200.129.112:9527/static/';
import Loading from '../Loading';

/**
 * 判断文件类型返回Icon
 * @param ext 后缀名
 * @param isFolder 是否文件夹
 * @returns {*} Icon的className
 */
function getIcon(ext, isFolder) {
    if (isFolder) {
        return 'folder'
    }
    switch (ext) {
        case '.html':
            return 'code'
        case '.css':
            return 'code'
        case '.js':
            return 'code'
        case '.jpg':
            return 'picture'
        case '.png':
            return 'picture'
        case '.gif':
            return 'picture'
        default :
            return 'frown-o'
    }
}

/**
 * FileItem组件
 */
var FileItem=React.createClass({
    //组件渲染
    render(){
        const {obj,active} = this.props;
        const {ext,name,isFolder} = obj;
        const type=getIcon(ext, isFolder);
        const act=name===active //被激活
        return (
            <li
                className={act?"file-item active":"file-item"}
                onClick={this.handleClick}
                onMouseDown={this.handleMouseDown}
            >
                <span className="file-item-icon">
                    <Icon type={type}/>
                </span>
                <span className="file-item-name">{name}</span>
            </li>
        )
    },
    //单击事件
    handleClick(){
        const {obj,onPick} = this.props;
        const {path,name,isFolder} = obj;
        onPick(name);
        if (isFolder)
            hashHistory.push(path);
        else
            window.open(host + path);
    },
    //右键OnPick
    handleMouseDown(e){
        const {obj,onPick} = this.props;
        const {name} =obj;
        if (e.button===2) {
            onPick(name);
        }
    }
});


/**
 * FileList组件
 */
var FileList=React.createClass({
    render(){
        const {path,file,loading,active,onPick} = this.props;
        //返回按钮
        const backButton=(<li
            className="file-item"
            onClick={(e)=>hashHistory.goBack()}
        >
                <span className="file-item-icon">
                    <Icon type="arrow-left"/>
                </span>
            <span className="file-item-name">返回</span>
        </li>);
        var nodes;
        //是否Loading状态
        if (loading) {
            nodes=<Loading/>
        } else {
            //根据file数组生成FileItems
            nodes=file.map(function (o) {
                return (
                    <FileItem
                        obj={o}
                        key={path+'-'+o.name}
                        active={active}
                        onPick={onPick}
                    />
                )
            })
        }

        //渲染结果
        return (
            <div className="file-content">
                <ul className="file-list">
                    {path[0]===""||loading ? '' : backButton}
                    {nodes}
                </ul>
            </div>
        )
    }
});

export default FileList;