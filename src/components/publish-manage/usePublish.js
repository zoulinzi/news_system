import {useEffect, useState} from "react";
import axios from "axios";
import {notification} from "antd";

export default function usePublish(type){

    const [dataSource,setDataSource] = useState([])
    useEffect(()=>{
        const {username} = JSON.parse(localStorage.getItem("token"))
        axios(`http://localhost:3000/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
            //console.log(res.data)
            setDataSource(res.data)
        })
    },[type])

    const handlePublish = (id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`http://localhost:3000/news/${id}`,{
            "publishState": 2,
            "publishTime":Date.now()
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻`,
                placement:"bottomRight"
            })
        })
    }

    const handleSunset = (id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`http://localhost:3000/news/${id}`,{
            "publishState": 3,
            "publishTime":Date.now()
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以到【已下线】中查看您的新闻`,
                placement:"bottomRight"
            })
        })
    }

    const handleDelete = (id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`http://localhost:3000/news/${id}`,).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您已经删除了已下线的新闻`,
                placement:"bottomRight"
            })
        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}