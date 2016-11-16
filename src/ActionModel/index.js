/**
 * Created by Min on 2016-11-13.
 */
import React from 'react';
import {Modal,Icon,Input,Upload,notification} from 'antd';
const Dragger=Upload.Dragger;
import {UPLOAD_URL} from '../api';
import {File} from '../backboneModel/model';


var ActionModel=React.createClass({
    render(){
        const {visible,onCancel,newValue,onChange,onOk} = this.props;
        var title=this.getTitle(),
            Input=this.getInput(newValue);
        return (
            <div>
                <Modal
                    visible={visible}
                    title={title}
                    onCancel={onCancel}
                    onOk={onOk}
                >
                    {Input}
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
            case 'uploadFile':
                return '上传文件(可多选)';
            default:
                return '无效操作';
        }
    },
    onFileUploadChange(info) {
        if (info.file.status!=='uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status==='done') {
            var nameSplit=info.file.name.split('.'),
                obj={
                    ext: '.' + nameSplit[nameSplit.length - 1],
                    isFolder: false,
                    name: info.file.name,
                    path: this.props.path.join('/') + '/' + info.file.name
                };
            console.log(obj);
            File.add(obj);
            notification.success({
                message: '上传成功',
                description: info.file.name + '已经上传到' + this.props.path + '目录',
                duration: 3
            });
            this.props.afterFinished();
        } else if (info.file.status==='error') {
            notification.success({
                message: '上传失败',
                description: info.file.name + '上传失败',
                duration: 5
            });
        }
    },
    getInput(newValue){
        if (newValue==='上传文件') {
            return (
                <div>
                    <div style={{ marginTop: 16, height: 180 }}>
                        <Dragger
                            name="cloud"
                            showUploadList={false}
                            data={{path:this.props.path.join('/')+'/'}}
                            multiple={true}
                            action={UPLOAD_URL}
                            onChange={(info)=>this.onFileUploadChange(info)}
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">点击或者拖拉可以上传文件</p>
                            <p className="ant-upload-hint">支持多文件上传</p>
                        </Dragger>
                    </div>
                </div>
            );
        } else {
            return (
                <Input type="text" value={newValue} onChange={this.props.onChange}/>
            );
        }
    }
});

export default ActionModel;