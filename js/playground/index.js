/* @flow */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { stateToHTML } from 'draft-js-export-html'; // eslint-disable-line import/no-extraneous-dependencies
import {
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
  ContentState,
  EditorState,
} from 'draft-js';
import { Editor } from '../src';
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
    const url = 'http://api.factube.com/dbc/api/qiniu/uploadandgetURL';
    const data = new FormData();
    data.append('file', file);
    const xtoken = '3b6bbad5-49ff-4fbd-9d8c-f9591a75e32e';
    return fetch(url, {
      method: 'POST',
      headers: {
        'x-auth-token': xtoken
      },
      body: data
    }).then(response => {
      return response.json();
    }).then( json => {
      return ( { data: { link: json.src } });
    });
  }

  render() {
    const { editorContent, contentState, initEditorState } = this.state;
    const toolBar = {
        options: ['inline', 'blockType', 'list', 'link', 'image', 'colorPicker', 'history'],
        inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline', 'strikethrough']
        },
        list: {
            inDropdown: false,
            options: ['unordered', 'ordered', 'indent', 'outdent']
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
        <div>{ editorContent ? stateToHTML(convertFromRaw(editorContent)) : null }</div>
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
