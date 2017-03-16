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

const testState = JSON.parse('{"entityMap":{"0":{"type":"IMAGE","mutability":"MUTABLE","data":{"src":"http://7xs74m.com1.z0.glb.clouddn.com/7e3af49f-3bd7-4639-9821-63e2413bcec2?…oken=fZZHQu4JaXWtlWu9hvTpc9Rk4BFgUPngfAoq8Nio:K_G_YnbzKU3yhYqoaAQmra5cL10=","height":"auto","width":"100%","alignment":"none"}}},"blocks":[{"key":"doudj","text":"    电磁光谱的红外部分根据其同可见光谱的关系，可分为近红外光、中红外光和远红外光。 远红外光（大约400-10  cm-1）同微波毗邻，能量低，可以用于旋转光谱学。中红外光（大约4000-400  cm-1）可以用来研究基础震动和相关的旋转-震动结构。更高能量的近红外光（14000-4000 cm-1）可以激发泛音和谐波震动。红外光谱法的工作原理是由于震动能级不同，化学键具有不同的频率。共振频率或者振动频率取决于分子等势面的形状、原子质量、和最终的相关振动耦合。为使分子的振动模式在红外活跃，必须存在永久双极子的改变。具体的，在波恩-奥本海默和谐振子近似中，例如，当对应于电子基态的分子哈密顿量能被分子几何结构的平衡态附近的谐振子近似时，分子电子能量基态的势面决定的固有振荡模，决定了共振频率。然而，共振频率经过一次近似后同键的强度和键两头的原子质量联系起来。这样，振动频率可以和特定的键型联系起来。简单的双原子分子只有一种键，那就是伸缩。更复杂的分子可能会有许多键，并且振动可能会共轭出现，导致某种特征频率的红外吸收可以和化学组联系起来。常在有机化合物中发现的CH2组，可以以 “对非对称伸缩”、“剪刀式摆动”、“左右摇摆”、“上下摇摆”和“扭摆”六种方式振动。 ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"baciv","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"dmfja","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"83v19","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"dhqj3","text":" 傅立叶变换红外光谱仪被称为第三代红外光谱仪，利用麦克尔逊干涉仪将两束光程差按一定速度变化的复色红外光相互干涉，形成干涉光，再与样品作用。探测器将得到的  傅立叶变换红外光谱仪被称为第三代红外光谱仪，利用麦克尔逊干涉仪将两束光程差按一定速度变化的复色红外光相互干涉，形成干涉光，再与样品作用。探测器将得到的 ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}');
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
            <div>{ stateToHTML(testState) }</div>
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
