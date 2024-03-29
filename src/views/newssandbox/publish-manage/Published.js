import React, {Component, useEffect, useState} from 'react';
import axios from "axios";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import {Button} from "antd";

function Published(){
    const {dataSource,handleSunset} = usePublish(2)
    
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleSunset(id)}>
                下线
            </Button>}>
            </NewsPublish>
        </div>
    );
}

export default Published;