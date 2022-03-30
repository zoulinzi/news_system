import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { createHashHistory } from "history";
import {connect} from "react-redux";

const { Header } = Layout;
function TopHeader(props){
    const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
    const history = createHashHistory()
    const changeCollapsed = ()=>{
        //改变state的isCollapsed
        props.changeCollapsed()
    }
    const menu = (
        // <Menu>
        //     <Menu.Item>
        //         {roleName}
        //     </Menu.Item>
        //     <Menu.Item danger onClick={()=>{
        //         localStorage.removeItem("token")
        //         history.replace('/login')
        //         window.location.reload()
        //     }}>退出登录</Menu.Item>
        // </Menu>
        <Menu>
            <Menu.Item key={"1"}>
                {roleName}
            </Menu.Item>
            <Menu.Item key={"2"} danger onClick={()=>{
                localStorage.removeItem("token")
                // console.log(props.history)
                history.replace("/login")
                window.location.reload()
            }}>退出</Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: "right" }}>
                <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>

    )
}
/*
connect(
    mapStateToProps，
    mapDispatchToPeops
)(被包装的组件)
*/
const mapStateToProps = (
    {CollapsedReducer:{isCollapsed}})=>{
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed(){
        return {
            type:"change_collapsed",
            // payload:
        }//action
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(TopHeader);
