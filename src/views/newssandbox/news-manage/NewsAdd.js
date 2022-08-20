import React, { useEffect, useRef, useState} from 'react';
import {PageHeader, Steps, Button, Form, Input, Checkbox, Select, message,notification  } from 'antd';
import axios from 'axios'
import './News.css'
import NewsEditor from "../../../components/news-manage/NewsEditor";
import {useNavigate} from "react-router-dom";

const { Step } = Steps;
const {Option} = Select;
function NewsAdd(){
    const [current,setCurrent] = useState(0)
    const [categoryList,setCategoryList] = useState([])
    const [formInfo,setFormInfo]=useState({})
    const [content,setContent]=useState("")

    const handleNext = () =>{
        if (current===0){
            NewsForm.current.validateFields().then(res=>{
                //console.log(res)
                setFormInfo(res)
                setCurrent(current+1)
            }).catch(err=>{
                console.log(err)
            })
        }else{
            if (content==="" || content.trim()==="<p></p>"){
                message.error("新闻内容不能为空")
            }else{
                setCurrent(current+1)
            }
        }
    }
    const handkePrevious = ()=>{
        setCurrent(current-1)
    }

    const NewsForm = useRef(null)
    const User = JSON.parse(localStorage.getItem("token"))
    const navagate = useNavigate()
    const handleSave = (auditState)=>{
        axios.post('http://localhost:3000/news',{
            ...formInfo,
            "content":content,
            "region": User.region?User.region:"全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            //"publishTime": 0
        }).then(res=>{
            navagate(auditState===0?'/news-manage/draft':'/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement:"bottomRight"
            })
        })
    }

    useEffect(()=>{
        axios.get("http://localhost:3000/categories").then(res=>{
            setCategoryList(res.data)
        })
    },[])

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写新闻"
                subTitle="This is a subtitle"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            <div style={{marginTop:"50px"}}>
                <div className={current===0?'':"hidden"}>
                    <Form
                        name="basic"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 21 }}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item=>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>

                <div className={current===1?'':"hidden"}>
                    <NewsEditor getContent={(values)=>{
                        setContent(values)
                    }}></NewsEditor>
                </div>

                <div className={current===2?'':"hidden"}></div>
            </div>

            <div style={{marginTop:"50px"}}>
                {
                    current===2 && <span>
                        <Button type="primary" onClick={()=>handleSave(0)}>保存草稿</Button>&nbsp;&nbsp;
                        <Button danger onClick={()=>handleSave(1)}>提交审核</Button>&nbsp;&nbsp;
                    </span>
                }
                {
                    current<2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current>0 && <Button onClick={handkePrevious}>上一步</Button>
                }
            </div>
        </div>
    );
}

export default NewsAdd;