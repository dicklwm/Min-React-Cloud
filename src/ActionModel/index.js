/**
 * Created by Min on 2016-11-13.
 */
import React from 'react';
import {Modal,Icon,Input} from 'antd';

var ActionModel = React.createClass({
    render(){
        const {visible,onCancel,newValue,onChange} = this.props
        return(
            <div>
                <Modal
                    visible={visible}
                    title='新建文件夹'
                    onCancel={onCancel}
                    onOk={(e)=>console.log(1)}
                >
                    <Input value={newValue} onChange={onChange}/>

                </Modal>
            </div>
        )
    },

});

export default ActionModel;