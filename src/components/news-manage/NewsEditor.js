import React, {Component, useEffect, useState} from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

function NewsEditor(props){
    const [editorState,setEditorState] = useState("")

    useEffect(()=>{
        // console.log(props.content)
        const html = props.content
        //没有这行代码在初始化撰写新闻模块会报错
        if (html===undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    },[props.content])

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState)=>setEditorState(editorState)}
                onBlur={()=>{
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    );
}

export default NewsEditor;