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
    const [menuItem,setmenuItem] =useState([])
    const navigate = useNavigate()
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
    
    useEffect(()=>{
        axios.get("http://localhost:3000/rights?_embed=children").then(res=>{
            setMenu(res.data)
            setmenuItem(res.data)
        })
    },[])
    
    function getItem(menuItemObj) {
        return {
            key:menuItemObj.key,
            icon:iconList[menuItemObj.key],
            //这里的children如果没有的话还是执行:后面的语句
            children:menuItemObj.children?.length===0?undefined:getItemChildren(menuItemObj.children),
            label:menuItemObj.title,
        };
    }
    
    function getItemChildren(children){
        //本来以为这里是数据请求的时间问题，结果是传入的就是undefined
        if (!children){ //这里是控制子项的右标志
            return undefined
        }
        let arr = []
        let array = []
        children?.map(child=>{
            arr.push(child)
        })
        arr.map(item=>{
            if (item.pagepermisson){
                array.push(getItem(item))
            }
        })
        return array
    }
    
    const items = menuItem.map(item=>getItem(item))
    
    /*
    //源代码
    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    
    const items = [
        getItem('Option 1', '1', <SettingOutlined />),
        getItem('Option 2', '2', <SettingOutlined />),
        getItem('User', 'sub1', <SettingOutlined />, [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem('Team', 'sub2', <SettingOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
        getItem('Files', '9', <SettingOutlined />),
    ];
    */
    
    
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
                    {/*default会让组件变成非受控组件*/}
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                        items={items}
                        onClick={(item)=>navigate(item.key)}>
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