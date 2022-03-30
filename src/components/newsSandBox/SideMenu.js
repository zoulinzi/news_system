import React, {Component,useEffect,useState} from 'react';
import { Layout, Menu } from 'antd';
import './index.css'
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {connect} from "react-redux";

const {Sider} = Layout;
const {SubMenu} = Menu;
//模拟数组结构
const menuList = [
    {
        key:"/sandbox/home",
        title:"首页",
        icon:<UserOutlined />
    },
    {
        key:"/sandbox/user-manage",
        title:"用户管理",
        icon:<UserOutlined />,
        children:[
            {
                key:"/sandbox/user-manage/list",
                title:"用户列表",
                icon:<UserOutlined />
            },
        ]
    },
    {
        key:"/sandbox/right-manage",
        title:"权限管理",
        icon:<UserOutlined />,
        children:[
            {
                key:"/sandbox/right-manage/role/list",
                title:"角色列表",
                icon:<UserOutlined />
            },
            {
                key:"/sandbox/right-manage/right/list",
                title:"权限列表",
                icon:<UserOutlined />
            },
        ]
    },
]

const iconList = {
    "/home":<UserOutlined />,
    "/user-manage":<VideoCameraOutlined />,
    "/user-manage/list":<VideoCameraOutlined />,
    "/right-manage":<SettingOutlined />,
    "/right-manage/role/list":<UploadOutlined />,
    "/right-manage/right/list":<SettingOutlined />
}

function SideMenu(props) {
    const [menu,setMenu] = useState([])

    useEffect(()=>{
        axios.get("http://localhost:3000/rights?_embed=children").then(res=>{
            setMenu(res.data)
        })
    },[])

    const navigate = useNavigate()

    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

    const checkPagePermission = (item)=>{
        return item.pagepermisson === 1 && rights.includes(item.key)
        // return item.pagepermisson
    }

    const renderMenu = (menuList)=>{
        return menuList.map(item=>{
            if (item.children?.length > 0 && checkPagePermission(item)){
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{
                navigate(item.key)
            }}>{item.title}</Menu.Item>
        })
    }
    const location = useLocation()
    const selectKeys = [location.pathname]
    const openKeys = ["/" + location.pathname.split("/")[1]]
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
                <div className="logo">全球新闻发布系统</div>
                <div style={{flex:1,overflow:"auto"}}>
                    {/*受控和非受控组件*/}
                    {/*受控组件：在外部组件变化后，内部组件也会跟着受影响；*/}
                    {/*非受控组件：在外部组件变化后，内部组件只跟着受第一次的影响*/}
                    <Menu theme="light" mode="inline" selectedKeys={selectKeys}
                    defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    );
}

const mapStateTpProps = ({CollapsedReducer:{isCollapsed}})=>({
    isCollapsed
})

const mapDispatchToProps = {}

export default connect(mapStateTpProps)(SideMenu)