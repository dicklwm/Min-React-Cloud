/**
 * Created by Min on 2016-11-13.
 */
import React from 'react';
import {Modal,Icon,Input} from 'antd';

var ActionModel=React.createClass({
    render(){
        const {visible,onCancel,newValue,onChange,onOk} = this.props
        var title = this.getTitle();
        return (
            <div>
                <Modal
                    visible={visible}
                    title={title}
                    onCancel={onCancel}
                    onOk={onOk}
                >
                    <Input value={newValue} onChange={onChange}/>

                </Modal>
            </div>
        )
    },
    getTitle(){
        const {action,oldValue} = this.props;
        switch (action) {
            case 'newFolder':
                return '新建文件夹';
            case 'rename':
                return '对 ' + oldValue + ' 重命名';
            default:
                return '无效操作';
        }
    }

});

export default ActionModel;