import React, {Component, useEffect, useState} from 'react';
import {Table, Button, Modal, notification} from "antd";
import axios from "axios";
import {
    DeleteOutlined,
    UploadOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
const {confirm} = Modal

function NewsDraft(){

    const [dataSource,setDataSource] = useState([])
    const navigate = useNavigate()

    const {username}  = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`http://localhost:3000/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setDataSource(list)
        })
    }, [username])

    const navagate = useNavigate()
    const handleCheck = (id)=>{
        axios.patch(`/news/${id}`,{
            auditState:1
        }).then(res=>{
            navagate('/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                    `您可以到${'审核列表'}中查看您的新闻`,
                placement:"bottomRight"
            });
        })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render:(id)=>{
                return <b>{id}</b>
            }

        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item)=>{
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render:(category)=>{
                return category.title
            }
        },
        {
            title: '操作',
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />}
                            onClick={()=>confirmMethod(item)}/>&nbsp;&nbsp;
                    <Button shape="circle" icon={<EditOutlined />}
                            onClick={()=>navigate(`/news-manage/update/${item.id}`)}/>&nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<UploadOutlined />}
                            onClick={()=>handleCheck(item.id)}/>&nbsp;&nbsp;
                </div>
            }
        },
    ];

    const confirmMethod = (item)=>{
        confirm({
            title: '你确定删除吗?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descrip tions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {},
        });
    }

    //删除
    const deleteMethod = (item)=>{
        console.log(item)
        //当前页面同步状态而且 + 后端同步
        // setDataSource(dataSource.filter(data=>data.id !== item.id));
        // axios.delete(`http://localhost:3000/rights/${item.id}`)
        setDataSource(dataSource.filter(data=>data.id !== item.id));
        axios.delete(`http://localhost:3000/news/${item.id}`)
    }

    return (
        <div>
            <Table dataSource={dataSource} rowKey={item=>item.id} columns={columns}
                   pagination={{
                       pageSize:5
                   }}/>
        </div>
    );

}

export default NewsDraft;