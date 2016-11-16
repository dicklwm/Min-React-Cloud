/**
 * Created by Min on 2016-11-12.
 */
import React from 'react';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import ActionModel from '../ActionModel'
import {message,Modal} from 'antd';
import {rename,mkdir,remove,cut,paste} from '../api';
import {File,CopyItem} from '../backboneModel/model';

var Menu=React.createClass({
    getInitialState(){
        return {
            showActionModel: false,
            newValue: '',
            action: '',
        }
    },
    render(){
        const {active,menu,isActive,isPaste} = this.props;
        const {x,y,display} = menu;
        var nodes=[];

        if (isActive) {
            nodes.push(<li key="title" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'title')}>
                <strong>{active}</strong></li>)
            nodes.push(<li key="rename" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'rename')}><span
                className="fa fa-edit"></span>重命名</li>);
            nodes.push(<li key="delete" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'delete')}><span
                className=" fa fa-trash-o"></span>删除</li>);
            nodes.push(<li key="cut" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'cut')}><span
                className=" fa fa-cut"></span>剪切</li>);
            nodes.push(<li key="copy" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'copy')}><span
                className=" fa fa-copy"></span>复制</li>);
        }
        if (isPaste) {
            nodes.push(<li key="paste" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'paste')}><span
                className=" fa fa-floppy-o"></span>粘贴</li>);
        }

        return (
            <div>
                <ul className="right-menu"
                    style={{display:display ? 'block' : 'none',
                    left:x+'px',top:y+'px'}}
                >
                    <li key="newFolder" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'newFolder')}><span
                        className="fa fa-plus-circle"></span>新建文件夹
                    </li>
                    <li key="uploadFile" className="allow" onMouseDown={(e)=>this.handleMenuClick(e,'uploadFile')}><span
                        className="fa fa-cloud-upload"></span>上传文件
                    </li>
                    {nodes}
                </ul>
                <ActionModel
                    action={this.state.action}
                    oldValue={active}
                    newValue={this.state.newValue}
                    visible={this.state.showActionModel}
                    onCancel={(e)=>this.hideModel()}
                    onChange={(e)=>this.setState({newValue:e.target.value})}
                    onOk={this.handleOk}
                    path={this.props.path}
                    afterFinished={this.afterFinished}
                />
            </div>

        )
    },
    //处理菜单点击
    handleMenuClick(e, action){
        console.log('handleMenuClick', action);
        this.setState({action: action});
        switch (action) {
            case 'newFolder':
                this.setState({newValue: "新建文件夹"});
                this.showModel();
                break;
            case 'rename':
                this.setState({newValue: this.props.active})
                this.showModel();
                break;
            case 'delete':
                Modal.confirm({
                    title: '删除操作',
                    content: '删除选中文件，是否确认要删除文件？',
                    onOk: this.handleOk,
                    onCancel: function () {
                        return;
                    }
                });
                break;
            case 'cut':
                console.log('cut start');
                var activeItem=File.findWhere({name: this.props.active}).toJSON();
                CopyItem.set(activeItem);
                this.props.setCutName(this.props.active);
                message.success('将' + this.props.active + '放入剪贴板成功', 5);
                this.afterFinished();
                break;
            case 'copy':
                console.log('copy start');
                var activeItem=File.findWhere({name: this.props.active}).toJSON();
                CopyItem.set(activeItem);
                message.success('将' + this.props.active + '放入剪贴板成功', 5);
                this.props.setCutName('');
                this.afterFinished();
                break;
            case 'paste':
                //剪切
                if (this.props.cutName!=='') {
                    var obj=CopyItem.toJSON();

                    obj['path']=this.props.path.join('/') + '/' + obj.name;
                    //调接口
                    this.cutFile(CopyItem.toJSON().path, obj.path);
                }
                //复制
                else {
                    var obj=CopyItem.toJSON(),
                        name=obj.name.split('.')[0],
                        path=this.props.path.join('/') + '/' + name,
                        newPath=path;
                    //判断是否已经存在这个复制项了
                    if (File.findWhere({name: obj.name})) {
                        var time=1;
                        /****处理存在相同的文件名****/
                        //path=obj.path.split('.')[0];
                        //直到找不到相同的为止
                        while (File.findWhere({name: obj.name})) {
                            obj['name']=name + '(' + time + ')' + obj.ext;
                            newPath=path + '(' + time + ')';
                            time++;
                        }
                    }
                    obj['path']=newPath + obj.ext;
                    console.log(CopyItem.toJSON().path, obj.path);
                    //调复制的接口
                    this.copyFile(CopyItem.toJSON().path, obj.path)
                }
                this.afterFinished();
                break;
            case 'uploadFile':
                this.setState({newValue: "上传文件"});
                this.showModel();
                break;
            default:
                break;
        }
        e.preventDefault();
        e.stopPropagation();
    },
    //处理Ok
    handleOk(){
        const {action,newValue} = this.state;
        console.log(action, newValue);
        switch (action) {
            case 'newFolder':
                this.newFolder(newValue);
                break;
            case 'rename':
                this.rename(newValue);
                break;
            case 'delete':
                this.deleteFile();
                break;
        }
    },
    //新建文件夹方法
    newFolder(name){
        const {path,active} = this.props;
        var that=this,
            paths=path.join('/') + '/' + active,
        //处理相同文件夹名的变量
            folderName=name,
            time=1;
        //如果找到相同的文件夹名
        /****处理存在相同的文件名****/
        //直到找不到相同的为止
        while (File.findWhere({name: folderName})) {
            folderName=name + '(' + time + ')';
            time++;
        }
        //在新建文件夹之前判断是否有同名
        mkdir({
            path: paths,
            name: folderName
        }, function (res) {
            console.log(res);
            //试一下用backbone
            //---------------Backbone------------------
            //Backbone推入
            File.push(res);
            //完成后的操作
            that.afterFinished();
            message.success('新建文件夹 ' + res.name + ' 成功', 5);
        }, function (res) {
            console.log(res);
        })
    },
    //重命名方法
    rename(newName){
        const {path,active} = this.props;
        var that=this,
            paths=path.join('/') + '/' + active,
            query={name: newName, path: paths};
        rename(query, function (res) {
            console.log(res);
            //-----------------Backbone--------------------
            //先用findWhere找到那个Model然后set它
            File.findWhere({name: active}).set(res);
            //完成后的操作
            that.afterFinished();
            message.success('重命名' + active + '-->' + res.name + '成功', 5);
        }, function () {
            message.error('重命名失败，文件名有重复');
        })
    },
    //删除方法
    deleteFile(){
        const {path,active} = this.props;
        var that=this;
        var paths=path.join('/') + '/' + active;
        var query={path: paths};
        remove(query, function (res) {
            console.log(res);
            //------------Backbone---------------
            File.remove(File.findWhere({name: active}));
            //完成后的操作
            that.afterFinished();
            message.success('删除 ' + active + ' 成功', 5);
        })
    },
    //复制方法
    copyFile(old_path, new_path){
        var query={old_path, new_path};
        paste(query, function (res) {
            console.log('paste success', res);
            if (res.error==="file exists") {
                message.error('复制失败，此文件夹有重复项', 5);
                return
            }
            File.add(res);
            message.success('复制成功', 5);
        }, function (res) {
            console.log('paste failed', res);
            message.error('复制失败，请打开控制台查看错误信息', 5);
        })
    },
    //剪切方法
    cutFile(old_path, new_path){
        var query={old_path, new_path},
            that=this;
        cut(query, function (res) {
            console.log('cut success', res);
            if (res.error==="file exists") {
                message.error('剪切失败，此文件夹有重复项', 5);
                return
            }
            File.add(res);
            that.props.setCutName('');
            CopyItem.clear();
            message.success('剪切成功', 5);
        }, function (res) {
            console.log('cut failed', res);
            message.error('剪切失败，请打开控制台查看错误信息', 5);
        })
    },
    //显示模态框
    showModel(){
        this.setState({
            showActionModel: true
        })
    },
    //隐藏模态框
    hideModel(){
        this.setState({
            showActionModel: false
        })
    },
    //清除newValue
    clearNewValue(){
        this.setState({
            newValue: ''
        })
    },
    //完成操作后
    afterFinished(){
        //清除新文件名
        this.clearNewValue();
        //隐藏模态框和菜单
        this.hideModel();
        this.props.hideMenu();
        this.props.unPickItem();
    }
})

export default Menu;