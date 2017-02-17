/* @flow */

import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line import/no-extraneous-dependencies
import {
    convertFromHTML,
    convertToRaw,
    convertFromRaw,
    ContentState,
    EditorState,
} from 'draft-js';
import { Editor, stateToHTML } from '../src';

import styles from './styles.css'; // eslint-disable-line no-unused-vars

const contentBlocks = convertFromHTML('<p>请测试</p>');

const contentState = ContentState.createFromBlockArray(contentBlocks);

const rawContentState = convertToRaw(contentState);

class Playground extends Component {
    state: any = {
        editorContent: undefined,
        contentState: undefined,
        initEditorState: EditorState.createWithContent(contentState),
    };
    onEditorChange: Function = (editorContent) => {
        this.setState({
            editorContent,
        });
    };
    onEditorStateChange: Function = (initEditorState) => {
        this.setState({
            initEditorState,
        });
    };
    setContentState: Function = () => {
        this.setState({
            contentState: rawContentState,
        });
    };
    imageUploadCallBack: Function = file => {
        const url = 'http://7xs74m.com1.z0.glb.clouddn.com/c38cebae-fabd-4795-8a54-b91e139f44ad?e=1479293705&token=fZZHQu4JaXWtlWu9hvTpc9Rk4BFgUPngfAoq8Nio:5jVthf8FfVS8bIIyhIsfGx5pr10=';
        const data = { data: { link: url } };
        return new Promise((resolve, reject) => {
            if (file) {
                resolve(data);
            } else {
                reject();
            }
        });
    }
    render() {
        console.log(stateToHTML);
        console.log(Editor);
        const { editorContent, contentState, initEditorState } = this.state;
        const toolBar = {
            options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'image', 'colorPicker', 'history'],
            inline: {
                inDropdown: false,
                options: ['bold', 'italic', 'underline', 'strikethrough']
            },
            list: {
                inDropdown: false,
                options: ['unordered', 'ordered', 'indent', 'outdent']
            },
            textAlign: {
                inDropdown: false,
                options: ['left', 'center', 'right', 'justify']
            },
            'link': {
                inDropdown: false,
                options: ['link', 'unlink']
            },
            history: {
                inDropdown: false,
                options: ['undo', 'redo']
            }
        };
        console.log(editorContent);
        const options = {
            inlineStyles: {
                'Left': { element: 'text-align', attributes: 'left' }
            }
        };
        return (
            <div className="playground-root">
            <button onClick={this.setContentState}>重置编辑器</button>
            <div className="playground-content">
            <Editor
            defaultContentState={rawContentState}
            toolbarClassName="playground-toolbar"
            wrapperClassName="playground-wrapper"
            editorClassName="playground-editor"
            onChange={this.onEditorChange}
            lang="zh"
            uploadCallback={this.imageUploadCallBack}
            placeholder="测试"
            toolbar={toolBar}
            />
            <div>{ editorContent ? stateToHTML(editorContent) : null }</div>
            </div>
            </div>
        );
    }
}
ReactDOM.render(<Playground />, document.getElementById('app')); // eslint-disable-line no-undef


/**
const rawContentState = ;


toolbar={{
inline: {
inDropdown: true,
},
list: {
inDropdown: true,
},
textAlign: {
inDropdown: true,
},
link: {
inDropdown: true,
},
image: {
uploadCallback: this.imageUploadCallBack,
},
history: {
inDropdown: true,
},
}}*/
