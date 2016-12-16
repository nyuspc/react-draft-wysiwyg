/* @flow */

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import {
  colors,
  toggleCustomInlineStyle,
  getSelectionCustomInlineStyle,
} from 'draftjs-utils';
import LANG from '../../config/lang';
import Option from '../Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

export default class ColorPicker extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    lang: PropTypes.string,
  };

  state: Object = {
    currentColor: undefined,
    currentBgColor: undefined,
    showModal: false,
    currentStyle: 'color',
  };

  componentWillMount(): void {
    const { editorState, modalHandler } = this.props;
    if (editorState) {
      this.setState({
        currentColor: getSelectionCustomInlineStyle(editorState, ['COLOR']).COLOR,
        currentBgColor: getSelectionCustomInlineStyle(editorState, ['BGCOLOR']).BGCOLOR,
      });
    }
    modalHandler.registerCallBack(this.showHideModal);
  }

  componentWillReceiveProps(properties: Object): void {
    const newState = {};
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      newState.currentColor
        = getSelectionCustomInlineStyle(properties.editorState, ['COLOR']).COLOR;
      newState.currentBgColor
        = getSelectionCustomInlineStyle(properties.editorState, ['BGCOLOR']).BGCOLOR;
    }
    this.setState(newState);
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.showHideModal);
  }

  onOptionClick: Function = (): void => {
    this.signalShowModal = !this.state.showModal;
  };

  setCurrentStyleBgcolor: Function = (): void => {
    this.setState({
      currentStyle: 'bgcolor',
    });
  };

  setCurrentStyleColor: Function = (): void => {
    this.setState({
      currentStyle: 'color',
    });
  };

  showHideModal: Function = (): void => {
    this.setState({
      showModal: this.signalShowModal,
    });
    this.signalShowModal = false;
  }

  toggleColor: Function = (color: string): void => {
    const { editorState, onChange } = this.props;
    const { currentStyle } = this.state;
    const newState = toggleCustomInlineStyle(
      editorState,
      currentStyle,
      `${currentStyle}-${color}`
    );
    if (newState) {
      onChange(newState);
    }
  };

  stopPropagation: Function = (event: Object): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  renderModal: Function = (): Object => {
    const { config: { popupClassName }, lang } = this.props;
    const { currentColor, currentBgColor, currentStyle } = this.state;
    const currentSelectedColor = (currentStyle === 'color') ? currentColor : currentBgColor;
    return (
      <div
        className={classNames('rdw-colorpicker-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <span className="rdw-colorpicker-modal-header">
          <span
            className={classNames(
              'rdw-colorpicker-modal-style-label',
              { 'rdw-colorpicker-modal-style-label-active': currentStyle === 'color' }
            )}
            onClick={this.setCurrentStyleColor}
          >
            { LANG.TEXT[lang] }
          </span>
          <span
            className={classNames(
              'rdw-colorpicker-modal-style-label',
              { 'rdw-colorpicker-modal-style-label-active': currentStyle === 'bgcolor' }
            )}
            onClick={this.setCurrentStyleBgcolor}
          >
            { LANG.BACKGROUND[lang] }
          </span>
        </span>
        <span className="rdw-colorpicker-modal-options">
          {
            colors.map((color, index) =>
              <Option
                value={color}
                key={index}
                className="rdw-colorpicker-option"
                activeClassName="rdw-colorpicker-option-active"
                active={currentSelectedColor === `${currentStyle}-${color}`}
                onClick={this.toggleColor}
              >
                <span
                  style={{ backgroundColor: color }}
                  className="rdw-colorpicker-cube"
                />
              </Option>)
          }
        </span>
      </div>
    );
  };

  render(): Object {
    const { config: { icon, className } } = this.props;
    const { showModal } = this.state;
    return (
      <div
        className="rdw-colorpicker-wrapper"
        aria-haspopup="true"
        aria-expanded={showModal}
        aria-label="rdw-color-picker"
      >
        <Option
          onClick={this.onOptionClick}
          className={classNames(className)}
        >
          <img
            src={icon}
            role="presentation"
          />
        </Option>
        {showModal ? this.renderModal() : undefined}
      </div>
    );
  }
}
