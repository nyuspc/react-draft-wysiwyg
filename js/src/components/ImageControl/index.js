/* @flow */

import React, { Component, PropTypes } from 'react';
import { Entity, AtomicBlockUtils } from 'draft-js';
import classNames from 'classnames';
import Option from '../Option';
import Spinner from '../Spinner';
import LANG from '../../config/lang.js';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

export default class ImageControl extends Component {

  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    uploadCallback: PropTypes.func,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
  };

  state: Object = {
    imgSrc: '',
    showModal: false,
    dragEnter: false,
    showImageUpload: !!this.props.uploadCallback,
    showImageLoading: false,
    height: 'auto',
    width: '100%',
  };

  componentWillMount(): void {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.showHideModal);
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.uploadCallback !== this.props.uploadCallback) {
      this.setState({
        showImageUpload: !!this.props.uploadCallback,
      });
    }
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.showHideModal);
  }

  onImageDrop: Function = (event: Object): void => {
    event.preventDefault();
    event.stopPropagation();
    this.uploadImage(event.dataTransfer.files[0]);
  };

  onDragEnter: Function = (event: Object): void => {
    this.stopPropagation(event);
    this.setState({
      dragEnter: true,
    });
  };

  onOptionClick: Function = (): void => {
    this.signalShowModal = !this.state.showModal;
  };

  setImageURLInputReference: Function = (ref: Object): void => {
    this.imageURLInput = ref;
  };

  setHeightInputReference: Function = (ref: Object): void => {
    this.heightInput = ref;
  };

  setWidthInputReference: Function = (ref: Object): void => {
    this.widthInput = ref;
  };

  updateImageSrc: Function = (event: Object): void => {
    this.setState({
      imgSrc: event.target.value,
    });
  };

  updateHeight: Function = (event: Object): void => {
    this.setState({
      height: event.target.value,
    });
  };

  updateWidth: Function = (event: Object): void => {
    this.setState({
      width: event.target.value,
    });
  };

  toggleShowImageLoading: Function = (): void => {
    const showImageLoading = !this.state.showImageLoading;
    this.setState({
      showImageLoading,
    });
  };

  showImageURLOption: Function = (): void => {
    this.setState({
      showImageUpload: false,
    });
  };

  showImageUploadOption: Function = (): void => {
    this.setState({
      showImageUpload: true,
    });
  };

  hideModal: Function = (): void => {
    this.setState({
      showModal: false,
      imgSrc: undefined,
      showImageUpload: !!this.props.uploadCallback,
    });
  };

  showHideModal: Function = (): void => {
    this.setState({
      showModal: this.signalShowModal,
      imgSrc: undefined,
      showImageUpload: !!this.props.uploadCallback,
    });
    this.signalShowModal = false;
  }

  selectImage: Function = (event: Object): void => {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadImage(event.target.files[0]);
    }
  };

  uploadImage: Function = (file: Object): void => {
    this.toggleShowImageLoading();
    const { uploadCallback } = this.props;
    uploadCallback(file)
      .then(({ data }) => {
        this.setState({
          showImageLoading: false,
          dragEnter: false,
        });
        this.addImageFromSrcLink(data.link);
      });
  };

  addImageFromState: Function = (): void => {
    this.addImage(this.state.imgSrc);
  };

  addImageFromSrcLink: Function = (src: string): void => {
    this.addImage(src);
  };

  addImage: Function = (imgSrc: string): void => {
    const { editorState, onChange } = this.props;
    const src = imgSrc || this.state.imgSrc;
    const { height, width } = this.state;
    const entityKey = Entity.create('IMAGE', 'MUTABLE', { src, height, width });
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );
    onChange(newEditorState);
    this.hideModal();
  };

  fileUploadClick = () => {
    this.fileUpload = true;
    this.signalShowModal = true;
  }

  stopPropagation: Function = (event: Object): void => {
    if (!this.fileUpload) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.fileUpload = false;
    }
  };

  renderAddImageModal(): Object {
    const { imgSrc, showImageUpload, showImageLoading, dragEnter, height, width } = this.state;
    const { config: { popupClassName }, uploadCallback, lang } = this.props;
    return (
      <div
        className={classNames('rdw-image-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <div className="rdw-image-modal-header">
          {uploadCallback ?
            <span
              onClick={this.showImageUploadOption}
              className="rdw-image-modal-header-option"
            >
              <span>{ LANG['FILE_UPLOAD'][lang] }</span>
              <span
                className={classNames(
                  'rdw-image-modal-header-label',
                  { 'rdw-image-modal-header-label-highlighted': showImageUpload }
                )}
              />
            </span>
            :
            undefined
          }
          <span
            onClick={this.showImageURLOption}
            className="rdw-image-modal-header-option"
          >
            <span>{ LANG['URL'][lang] }</span>
            <span
              className={classNames(
                'rdw-image-modal-header-label',
                { 'rdw-image-modal-header-label-highlighted': !showImageUpload }
              )}
            />
          </span>
        </div>
        {
          showImageUpload && uploadCallback ?
            <div onClick={this.fileUploadClick}>
              <div
                onDragEnter={this.stopPropagationPreventDefault}
                onDragOver={this.stopPropagationPreventDefault}
                onDrop={this.onImageDrop}
                className={classNames(
                'rdw-image-modal-upload-option',
                { 'rdw-image-modal-upload-option-highlighted': dragEnter })}
              >
                <label
                  htmlFor="file"
                  className="rdw-image-modal-upload-option-label"
                >
                  { LANG['UPLOAD_IMAGE'][lang] }
                </label>
              </div>
              <input
                type="file"
                id="file"
                onChange={this.selectImage}
                className="rdw-image-modal-upload-option-input"
              />
            </div> :
              <div className="rdw-image-modal-url-section">
                <input
                  ref={this.setImageURLInputReference}
                  className="rdw-image-modal-url-input"
                  placeholder="Enter url"
                  onChange={this.updateImageSrc}
                  onBlur={this.updateImageSrc}
                  value={imgSrc}
                />
              </div>
        }
        <div className="rdw-embedded-modal-size">
          <input
            ref={this.setHeightInputReference}
            onChange={this.updateHeight}
            onBlur={this.updateHeight}
            value={height}
            className="rdw-embedded-modal-size-input"
            placeholder="Height"
          />
          <input
            ref={this.setWidthInputReference}
            onChange={this.updateWidth}
            onBlur={this.updateWidth}
            value={width}
            className="rdw-embedded-modal-size-input"
            placeholder="Width"
          />
        </div>
        <span className="rdw-image-modal-btn-section">
          <button
            className="rdw-image-modal-btn"
            onClick={this.addImageFromState}
            disabled={!imgSrc || !height || !width}
          >
            { LANG['ADD'][lang] }
          </button>
          <button
            className="rdw-image-modal-btn"
            onClick={this.hideModal}
          >
            { LANG['CANCEL'][lang] }
          </button>
        </span>
        {showImageLoading ?
          <div className="rdw-image-modal-spinner">
            <Spinner />
          </div> :
          undefined}
      </div>
    );
  }

  render(): Object {
    const { config: { icon, className } } = this.props;
    const { showModal } = this.state;
    return (
      <div
        className="rdw-image-wrapper"
        aria-haspopup="true"
        aria-expanded={showModal}
        aria-label="rdw-image-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={this.onOptionClick}
        >
          <img
            src={icon}
            role="presentation"
          />
        </Option>
        {showModal ? this.renderAddImageModal() : undefined}
      </div>
    );
  }
}
