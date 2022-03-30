import React, {Component} from 'react';
import {HashRouter, Route, Routes,Navigate} from "react-router-dom";
import NewsSandBox from "../views/newssandbox/NewsSandBox";
import Login from "../views/login/Login";
import News from "../views/news/News";
import Detail from "../views/news/Detail";
class IndexRouter extends Component {
    render() {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/news" element={<News/>}/>
                    <Route path="/detail/:id" element={<Detail/>}/>
                    <Route exact path="*" element={<NewsSandBox/>}/>
                    {/*重定向*/}
                    {/*<Route path="*" element={<Navigate to="/" />}/>*/}
                </Routes>
            </HashRouter>
        );
    }
}

export default IndexRouter;