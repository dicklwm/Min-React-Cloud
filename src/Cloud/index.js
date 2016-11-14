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
import {File,CopyItem} from '../backboneModel/model';

var Cloud=React.createClass({

    getInitialState(){
        return {
            path: [],
            file: [],
            loading: false,
            active: '',
            copyItem: {},
            cutName:'',
            menu: {
                x: 0,
                y: 0,
                display: false,
            },

        }
    },
    //组件加载完成
    componentDidMount(){
        var that=this;
        const {params} = this.props;
        const {splat} = params;
        this.getFiles(splat);
        /*----------------Backbone-----------------------*/
        //全局调试用
        window.FileGG=File;
        window.CopyItemGG=CopyItem;
        File.on('reset add remove change', function () {
            var obj={};
            obj['file']=File.toJSON();
            that.setState(obj);
        });
        CopyItem.on('change', function () {
            var obj={};
            console.log('Backbone CopyItemModel Change');
            obj['copyItem']=CopyItem.toJSON();
            that.setState(obj);
        });
    },
    //组件Props改变后，更换地址后刷新Files
    componentWillReceiveProps(nextProps){
        const {params} = nextProps;
        const {splat} = params;
        this.getFiles(splat);
        this.unPickItem();
    },
    //渲染
    render(){
        //判断是否copyItem是否为空对象
        var isPaste;
        for (var i in this.state.copyItem) {
            isPaste=true;
            break;
        }
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
                    cutName={this.state.cutName}
                />
                <Menu
                    path={this.state.path}
                    active={this.state.active}
                    isActive={!!this.state.active}
                    isPaste={!!isPaste}
                    menu={this.state.menu}
                    hideMenu={this.hideMenu}
                    unPickItem={this.unPickItem}
                    setCutName={this.setCutName}
                    cutName={this.state.cutName}
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
                //file: res.file,
                path: res.path.split('/')
            })
            //Backbone处理
            File.reset(res.file);
        }, function (res) {
            console.log('getFileList Error', res);
        })
    },
    //选中Item方法
    PickItem(name){
        this.setState({
                active: name,
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
    },
    //设置剪切项
    setCutName(name){
        this.setState({cutName:name});
    }
});

export default Cloud;