import React, {Component, useEffect, useState} from 'react';
import axios from "axios";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import {Button} from "antd";

function Sunset(){
    const {dataSource,handleDelete} = usePublish(3)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleDelete(id)}>
                删除
            </Button>}></NewsPublish>
        </div>
    );
}

export default Sunset;