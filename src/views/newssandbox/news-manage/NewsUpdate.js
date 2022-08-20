import React, {Component, useEffect, useRef, useState} from 'react';
import {PageHeader, Steps, Button, Form, Input, Checkbox, Select, message,notification  } from 'antd';
import axios from 'axios'
import './News.css'
import NewsEditor from "../../../components/news-manage/NewsEditor";
import {useNavigate, useParams} from "react-router-dom";

const { Step } = Steps;
const {Option} = Select;

function NewsUpdate(){
    const [current,setCurrent] = useState(0)
    const [categoryList,setCategoryList] = useState([])
    const [formInfo,setFormInfo]=useState({})
    const [content,setContent]=useState("")

    const params = useParams()

    const handleNext = () =>{
        if (current===0){
            NewsForm.current.validateFields().then(res=>{
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
    // const User = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate()
    const handleSave = (auditState)=>{
        axios.patch(`http://localhost:3000/news/${params.id}`,{
            ...formInfo,
            "content":content,
            "auditState": auditState,
        }).then(res=>{
            navigate(auditState===0?'/news-manage/draft':'audit-manage/list')
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
            console.log(res.data)
            setCategoryList(res.data)
        })
    },[])

    useEffect(()=>{
        axios.get(`http://localhost:3000/news/${params.id}?_expand=category&_expand=role`).then(res=>{
            // setNewsInfo(res.data)

            //content
            //formInfo
            let {title,categoryId,content} = res.data
            NewsForm.current.setFieldsValue({ //点击更新时，把旧的值设置到更新页面中
                title,
                categoryId
            })
            setContent(content)
        })
    },[params])

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={()=>window.history.back()}
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
                    }} content={content}></NewsEditor>
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

export default NewsUpdate;