/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  fontFamilies,
  toggleCustomInlineStyle,
  getSelectionCustomInlineStyle,
} from 'draftjs-utils';
import classNames from 'classnames';
import LANG from '../../config/lang';
import { Dropdown, DropdownOption } from '../Dropdown';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

export default class FontFamilyControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    lang: PropTypes.string,
  };

  state: Object = {
    currentFontFamily: undefined,
  };

  componentWillMount(): void {
    const { editorState } = this.props;
    if (editorState) {
      this.setState({
        currentFontFamily: getSelectionCustomInlineStyle(editorState, ['FONTFAMILY']).FONTFAMILY,
      });
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentFontFamily:
          getSelectionCustomInlineStyle(properties.editorState, ['FONTFAMILY']).FONTFAMILY,
      });
    }
  }

  toggleFontFamily: Function = (fontFamily: string) => {
    const { editorState, onChange } = this.props;
    const newState = toggleCustomInlineStyle(
      editorState,
      'fontFamily',
      fontFamily,
    );
    if (newState) {
      onChange(newState);
    }
  };

  render() {
    let { currentFontFamily } = this.state;
    const { config: { className, dropdownClassName }, modalHandler, lang } = this.props;
    currentFontFamily =
      currentFontFamily && currentFontFamily.substring(11, currentFontFamily.length);
    return (
      <div className="rdw-fontfamily-wrapper" aria-label="rdw-font-family-control">
        <Dropdown
          className={classNames('rdw-fontfamily-dropdown', className)}
          onChange={this.toggleFontFamily}
          modalHandler={modalHandler}
          optionWrapperClassName={classNames('rdw-fontfamily-optionwrapper', dropdownClassName)}
        >
          <span className="rdw-fontfamily-placeholder">
            {currentFontFamily || LANG.FONT_FAMILY[lang]}
          </span>
          {
            fontFamilies.map((family, index) =>
              <DropdownOption
                active={currentFontFamily === family}
                value={`fontfamily-${family}`}
                key={index}
              >
                {family}
              </DropdownOption>)
          }
        </Dropdown>
      </div>
    );
  }
}
