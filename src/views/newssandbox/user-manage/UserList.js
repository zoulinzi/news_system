import React, {useEffect, useState, useRef} from 'react';
import {Button, Switch, Table, Modal, Form,Input,Select} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import '../../../components/user-manage/UserForm'
import UserForm from "../../../components/user-manage/UserForm";

const {confirm} = Modal

function UserList() {
    const [dataSource,setDataSource] = useState([])
    const [isAddVisible,setIsAddVisible] = useState(false)
    const [roleList,setRoleList] = useState([])
    const [regionList,setRegionList] = useState([])
    const [isUpdateVisible,setIsUpdateVisible] = useState(false)
    const addForm = useRef(null)
    const updateForm = useRef(null)
    const [isUpdateDisabled,setIsUpdateDisabled] = useState(false)
    const [current,setCurrent] = useState(null)

    const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))

    useEffect(()=>{
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        axios.get("http://localhost:3000/users?_expand=role").then(res=>{
            const list = res.data
            setDataSource(roleObj[roleId]==="superadmin"?list:[
                // 过滤自己
                ...list.filter(item=>item.username===username),
                //再把旗下的过滤出来
                ...list.filter(item=>item.region===region && roleObj[item.roleId]==="editor")
            ])
        })
    },[roleId,region,username])

    useEffect(()=>{
        axios.get("http://localhost:3000/regions").then(res=>{
            setRegionList(res.data)
        })
    },[])

    useEffect(()=>{
        axios.get("http://localhost:3000/roles").then(res=>{
            setRoleList(res.data)
        })
    },[])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters:[
                ...regionList.map(item=>({
                    text:item.title,
                    value:item.value
                })),
                {
                    text:"全球",
                    value:"全球"
                }
            ],
            onFilter:(value,item)=>{
                if (value==="全球"){
                    return item.region===""
                }else{
                    return item.region===value
                }
            },
            render:(region)=>{
                return <b>{region===""?"全球":region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render:(role)=>{
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render:(roleState,item)=>{
                return <Switch checked={roleState} disabled={item.default} onChange={()=>{handleChange(item)}}></Switch>
            }
        },
        {
            title: '操作',
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />}
                            onClick={()=>confirmMethod(item)} disabled={item.default}/>&nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default}
                    onClick={()=>handleUpdate(item)}/>
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
    const deleteMethod = (item)=>{
        //当前页面同步状态而且 + 后端同步
        setDataSource(dataSource.filter(data=>data.id !== item.id));
        axios.delete(`http://localhost:3000/users/${item.id}`)
    }
    const addFormOK = ()=>{
        addForm.current.validateFields().then(res=>{
            setIsAddVisible(false)

            addForm.current.resetFields()

            //post到后端，生成id，再设置dataSource,再来做增删改查
            axios.post(`http://localhost:3000/users`,{
                ...res,
                "roleState": true,
                "default": false
            }).then(value=>{
                setDataSource([...dataSource,{
                    ...res.data,
                    role:roleList.filter(item=>item.id===value.roleId)[0]
                }])
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    const handleChange = (item)=>{
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`http://localhost:3000/users/${item.id}`,{
            roleState:item.roleState
        })
    }

    const handleUpdate = (item)=>{
        setTimeout(()=>{
            setIsUpdateVisible(true)
            if (item.roleId===1){
                //禁用
                setIsUpdateDisabled(true)
            }else{
                //取消禁用
                setIsUpdateDisabled(false)
            }
            //将原有的值填 上去
            updateForm.current.setFieldsValue(item)
        },0)
        setCurrent(item)
    }

    const updateFormOK = (item)=>{
        //获取当前的值
        updateForm.current.validateFields().then(res=>{
            setIsUpdateVisible(false)
            setDataSource(dataSource.map(item=>{
                if (item.id===current.id){
                    return {
                        ...item,
                        ...res,
                        role:roleList.filter(data=>data.id===res.roleId)[0]
                    }
                }
                return item
            }))
            setIsUpdateDisabled(!isUpdateDisabled)
            axios.patch(`http://localhost:3000/user/${current.id}`,
                res
            )
        })
    }

    return (
        <div>
            <Button type="primary" onClick={()=>setIsAddVisible(true)}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                   pagination={{pageSize:5}} rowKey={item=>item.id}/>

            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={()=>{
                    setIsAddVisible(false)
                }}
                onOk={() => {
                    addFormOK()
                }}
            >
                <UserForm regionList={regionList} roleList={roleList}
                          ref={addForm} isUpdate={false}></UserForm>
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={()=>{
                    setIsUpdateVisible(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => {
                    updateFormOK()
                }}
            >
                <UserForm regionList={regionList} roleList={roleList}
                          ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}>
                </UserForm>
            </Modal>
        </div>
    );
}

export default UserList;