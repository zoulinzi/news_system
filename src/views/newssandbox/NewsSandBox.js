import React, {Component} from 'react';
import SideMenu from "../../components/newsSandBox/SideMenu";
import TopHeader from "../../components/newsSandBox/TopHeader";
import './NewsSandBox.css'
import {Layout} from "antd";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import NewsRouter from "../../components/newsSandBox/NewsRouter";

const {Content} = Layout

class NewsSandBox extends Component {
    render() {
        return (
            <Layout>
                <SideMenu></SideMenu>
                <Layout className="site-layout">
                    <TopHeader></TopHeader>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            overflow: 'auto'
                        }}
                    >
                        <NewsRouter></NewsRouter>
                    </Content>

                </Layout>
            </Layout>
        );
    }
}

export default NewsSandBox;