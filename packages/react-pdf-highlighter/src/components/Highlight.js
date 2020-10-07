// @flow

import React, { Component } from "react";

import "../style/Highlight.css";

import type { T_LTWH } from "../types.js";
import TransformWrapper from "./TransformWrapper";
import { getEmojiStyle } from '../lib/coordinates';

type Props = {
  position: {
    boundingRect: T_LTWH,
    rects: Array<T_LTWH>
  },
  onClick?: () => void,
  onMouseOver?: () => void,
  onMouseOut?: () => void,
  comment: {
    emoji: string,
    text: string
  },
  isScrolledTo: boolean,
  rotate: number,
  scale: number
};

class Highlight extends Component<Props> {
  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      comment,
      isScrolledTo,
      rotate,
      scale,
      getIcon
    } = this.props;

    const { rects, boundingRect } = position;
    const icon = comment ? getIcon(comment.emoji) : null;

    return (
      <div className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}>
        {icon ? (
          <div
            className="Highlight__emoji"
            style={getEmojiStyle(position.boundingRect, rotate)}
          >
            <i className="icon app-icons" style={{color: icon.color}}>{icon.icon}</i>
          </div>
        ) : null}
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className={`Highlight__part`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
