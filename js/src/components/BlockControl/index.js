/* @flow */

import React, { Component, PropTypes } from 'react';
import { RichUtils } from 'draft-js';
import classNames from 'classnames';
import { getSelectedBlocksType } from '../../utils/draftjsUtils';
import { Dropdown, DropdownOption } from '../Dropdown';
import LANG from '../../config/lang';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

export default class BlockControl extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    lang: PropTypes.string,
  };

  state: Object = {
    currentBlockType: 'unstyled',
  };

  componentWillMount(): void {
    const { editorState } = this.props;
    if (editorState) {
      this.setState({
        currentBlockType: getSelectedBlocksType(editorState),
      });
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentBlockType: getSelectedBlocksType(properties.editorState),
      });
    }
  }

  blocksTypes: Array<Object> = [
    { label: LANG.NORMAL[this.props.lang], style: 'unstyled' },
    { label: LANG.H1[this.props.lang], style: 'header-one' },
    { label: LANG.H2[this.props.lang], style: 'header-two' },
    { label: LANG.H3[this.props.lang], style: 'header-three' },
    { label: LANG.H4[this.props.lang], style: 'header-four' },
    { label: LANG.H5[this.props.lang], style: 'header-five' },
    { label: LANG.H6[this.props.lang], style: 'header-six' },
  ];

  toggleBlockType: Function = (blockType: string) => {
    const { editorState, onChange } = this.props;
    const newState = RichUtils.toggleBlockType(
      editorState,
      blockType
    );
    if (newState) {
      onChange(newState);
    }
  };

  render() {
    let { currentBlockType } = this.state;
    if (currentBlockType === 'unordered-list-item' || currentBlockType === 'ordered-list-item') {
      currentBlockType = 'unstyled';
    }
    const currentBlockData = this.blocksTypes.filter(blk => blk.style === currentBlockType);
    const currentLabel = currentBlockData && currentBlockData[0] && currentBlockData[0].label;
    const { config: { className, dropdownClassName }, modalHandler } = this.props;
    return (
      <div className="rdw-block-wrapper" aria-label="rdw-block-control">
        <Dropdown
          className={classNames('rdw-block-dropdown', className)}
          optionWrapperClassName={classNames(dropdownClassName)}
          onChange={this.toggleBlockType}
          modalHandler={modalHandler}
        >
          <span>{currentLabel}</span>
          {
            this.blocksTypes.map((block, index) =>
              <DropdownOption
                active={currentBlockType === block.style}
                value={block.style}
                key={index}
              >
                {block.label}
              </DropdownOption>)
          }
        </Dropdown>
      </div>
    );
  }
}
