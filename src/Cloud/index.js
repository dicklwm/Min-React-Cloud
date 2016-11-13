/**
 * Created by Min on 2016-11-11.
 */
import React from 'react';
import {Icon} from 'antd';
import 'antd/dist/antd.min.css'
import './index.css';
import Nav from '../Nav';
import FileList from '../FileList';
import Menu from '../Menu';
import {getFileList} from '../api';

var Cloud=React.createClass({

    getInitialState(){
        return {
            path: [],
            file: [],
            loading: false,
            active: '',
            cutItem: null,
            copyItem: null,
            menu: {
                x: 0,
                y: 0,
                display: false,
            },

        }
    },
    //组件加载完成
    componentDidMount(){
        const {params} = this.props;
        const {splat} = params;
        this.getFiles(splat);
    },
    //组件Props改变后
    componentWillReceiveProps(nextProps){
        const {params} = nextProps;
        const {splat} = params;
        this.getFiles(splat);
    },
    //渲染
    render(){
        return (
            <div className="Cloud"
                 onContextMenu={(e)=>e.preventDefault()}
                 onMouseDown={this.mouseDown}
            >
                <div className="app-title">
                    <Icon type="cloud" className="cloud"/>
                    <h3 className="title">Min云盘</h3>
                </div>
                <Nav value={this.state.path}/>
                <FileList
                    file={this.state.file}
                    path={this.state.path}
                    active={this.state.active}
                    loading={this.state.loading}
                    onPick={(name)=>this.PickItem(name)}
                />
                <Menu
                    path={this.state.path}
                    active={this.state.active}
                    isActive={!!this.state.active}
                    isPaste={!!this.state.cutItem||!!this.state.copyItem}
                    menu={this.state.menu}
                    onAction={(action)=>this.handleMenuClick(action)}
                />
            </div>
        )
    },
    //处理菜单点击
    handleMenuClick(action){
        var hasPicked=!!this.state.active;
        if (hasPicked) {
            switch (action) {
                case 'newFolder':
                case 'rename':
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
    },
    //获取服务器文件
    getFiles(path){
        var that=this;
        this.setState({loading: true});
        //调用API
        getFileList(path, function (res) {
            that.setState({
                loading: false,
                file: res.file,
                path: res.path.split('/')
            })
        }, function (res) {
            console.log('getFileList Error', res);
        })
    },
    //选中Item方法
    PickItem(name){
        this.setState({
                active: name,
                newValue: name,
            }
        );
    },
    //取消选中Item方法
    unPickItem(){
        const {cutItem,copyItem} = this.state;
        this.setState({
                active: '',
                newValue: '',
                menu: {
                    isActive: false,
                    isPaste: !!cutItem || !!copyItem
                }
            }
        );
    },
    //右键方法
    mouseDown(e){
        if (e.button===2) {
            this.showMenu(e);
        } else {
            this.hideMenu();
            this.unPickItem();
        }
    },
    //显示右键菜单
    showMenu(e){
        this.setState({
            menu: {
                x: e.clientX,
                y: e.clientY,
                display: true,
            }
        })
    },
    //隐藏右键菜单
    hideMenu(){
        this.setState({
            menu: {
                display: false
            }
        })
    }
});

export default Cloud;