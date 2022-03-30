import React, {Component, useEffect} from 'react';
import {Form, Input, Button, Checkbox, message} from 'antd';
import './Login.css'
import { UserOutlined,
        LockOutlined ,
} from '@ant-design/icons';
import axios from "axios";
import {createHashHistory} from 'history'

function Login() {
    const history = createHashHistory()

    useEffect(()=>{
        axios.get("http://localhost:3000/users").then(res=>{
            // console.log(res.data)
            // console.log(res.data)
        })
    })

    const onFinish = (values) => {
        axios.get(`http://localhost:3000/users?username=${values.username
        }&password=${values.password}&roleState=true&_expand=role`).then(res=>{
            console.log(res.data)
            if(res.data.length===0){
                message.error("用户名或密码不匹配")
            }else{
                localStorage.setItem("token",JSON.stringify(res.data[0]))
                history.push("/home")
                //刷新页面
                window.location.reload()
            }
        })
    }

    return (
        <div style={{background:'rgb(255,197,44)', height:'100%'}
            // ,backgroundImage: "url(" + require("../../IMG_5208.JPG") + ")",
        }>
            <div className='formContainer'>
                <div className="loginTitle">全球新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your Username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your Password!'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default Login;