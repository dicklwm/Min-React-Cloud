/**
 * Created by Min on 2016-11-12.
 */
import React from 'react';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import ActionModel from '../ActionModel'
import {message} from 'antd';
import {rename,mkdir,remove} from '../api';

var Menu=React.createClass({
    getInitialState(){
        return {
            showActionModel: false,
            newValue: '',
            action: 'newFolder'
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
                    {nodes}
                </ul>
                <ActionModel
                    action={this.state.action}
                    oldValue={active}
                    newValue={this.state.newValue}
                    visible={this.state.showActionModel}
                    onCancel={(e)=>this.hideModel()}
                    onChange={(e)=>this.setState({newValue:e.target.value})}
                />
            </div>

        )
    },
    //处理菜单点击
    handleMenuClick(e, action){
        var hasPicked=!!this.props.active;
        console.log(action,hasPicked);
        if (hasPicked) {
            switch (action) {
                case 'newFolder':
                case 'rename':
                    this.setState({action:action});
                    this.showModel();
                    break;
                case 'delete':
                    break;
                case 'cut':
                    break;
                case 'copy':
                    break;
                case 'paste':
                    break;
                default:
                    break;
            }
        }
        else {
            switch (action) {
                case 'newFolder':
                    this.showModel();
                    break;
                case 'paste':
                    break;
                default:
                    break;
            }
        }
        e.preventDefault();
        e.stopPropagation();
    },
    newFolder(name){
        const {path,active} = this.props;
        var that = this
        var path = path.join('/')+'/'+active;
        mkdir({
            path:path,
            name:name
        },function (res) {
            //试一下用backbone
            var file = that.state.file
            file.push(res)
            that.setState({file})
            //that.pickItem(name)
            that.hideModel();
            message.success('操作成功');
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
    }
})

export default Menu;