import React, {Component, useEffect, useState} from 'react';
import {Button, Table, Tag, Modal, Tree} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
const {confirm} = Modal

function RoleList() {
    const [dataSource,setDataSource] = useState([])
    const [rightList,setRightList] = useState([])
    const [currentRights,setCurrentRights] = useState([])
    const [currentId,setCurrentId] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render:(id)=>{
                return <b>{id}</b>
            }

        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            // 这里的items是roles里面的数据
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />}
                            onClick={()=>confirmMethod(item)}/>&nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<EditOutlined />}
                    onClick={()=>{
                        setIsModalVisible(true)
                        setCurrentRights(item.rights)
                        setCurrentId(item.id)
                    }}/>
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
        //当前页面同步状态而且 + 后端同步
        setDataSource(dataSource.filter(data=>data.id !== item.id));
        axios.delete(`http://localhost:3000/roles/${item.id}`)
    }

    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson===1?0:1
        setDataSource([...dataSource])
        if(item.grade === 1){
            axios.patch(`http://localhost:3000/roles/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
    }

    useEffect(()=>{
        axios.get("http://localhost:3000/roles").then(res=>{
            setDataSource(res.data)
        })
    },[])

    useEffect(()=>{
        axios.get("http://localhost:3000/rights?_embed=children").then(res=>{
            setRightList(res.data)
        })
    },[])

    const handleOk = () => {
        setIsModalVisible(false);
        //同步dataSource
        setDataSource(dataSource.map(item=>{
            if (item.id===currentId){
                return {
                    ...item,
                    rights:currentRights
                }
            }
            return item
        }))
        //同步后端patch
        axios.patch(`http://localhost:3000/roles/${currentId}`,{
            rights:currentRights
        })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    //在取消一个框之后，该函数会自动删掉rights里面的路径
    const onCheck = (checkKeys) => {
        setCurrentRights(checkKeys.checked)
    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}>
            </Table>

            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly = {true}
                    treeData={rightList}
                />
            </Modal>
        </div>
    );
}

export default RoleList;