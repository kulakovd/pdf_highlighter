// @flow

import React, { Component } from "react";
import ReactDOM from 'react-dom';

type Props = {
  rotate: number;
  scale: number;
}

type State = {
  parent: HTMLElement
}

// TODO: fix this horror
class TransformWrapper extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(): * {
    this.setState({
      parent: this.getTransformableParent()
    });
  }

  getTransformableParent(): HTMLElement {
    let parent = ReactDOM.findDOMNode(this);
    while ((parent = parent.parentElement) && parent.className !== 'textLayer') {}
    return parent;
  }

  clampRotation(rotation: number) {
    while (rotation > 180) rotation -= 360;
    while (rotation < -180) rotation += 360;
    return rotation;
  }

  getContainerTransform(parent: HTMLElement, rotate: number, scale: number): string {
    if (!parent || parent.style.transform === 'none') {
      return 'none';
    }
    const { transform } = parent.style;
    const rotateMatch = transform.match(/rotate\(-?(\d+)deg\)/);
    const parentRotate = rotateMatch && +rotateMatch[1] || 0;
    const scaleMatch = transform.match(/scale\(([\d.]+)/);
    const parentScale = scaleMatch && +scaleMatch[1] || 1;
    const rect = parent.getBoundingClientRect();
    const [x, y] = this.getOffsets(rotate, parentRotate, rect) || [0, 0];
    let finalRot = rotate - parentRotate;
    if (rotate === -90 && !parentRotate) {
      finalRot = 90;
    }
    if (Math.abs(rotate) === parentRotate) {
      finalRot = 0;
    }
    if (Math.abs(rotate) === 90 && parentRotate === 180) {
      finalRot = -90;
    }
    if (rotate === -90 && parentRotate === 270) {
      finalRot = 180;
    }
    scale /= parentScale;
    return `rotate(${finalRot}deg) scale(${scale}) translate(${x}px, ${y}px)`;
  }

  getOffsets(rotate: number, parentRotate: number, rect: ClientRect): [number, number] {
    parentRotate = this.clampRotation(parentRotate);
    if (!(rotate - parentRotate) && rotate !== -90) {
      return [0, 0]
    }
    switch (rotate) {
      case -180:
        switch (parentRotate) {
          case -90:
            return [-rect.width, 0];
          case 0:
            return [-rect.width, -rect.height];
          case 90:
            return [0, -rect.height];
          default:
            return 0;
        }
      case -90:
        switch (parentRotate) {
          case -180: case 180:
            return [-rect.height, 0];
          case -90:
            return [-rect.height, -rect.width];
          case 0:
            return [0, -rect.width];
          default:
            return 0;
        }
      case 0:
        switch (parentRotate) {
          case -90:
            return [-rect.height, 0];
          case 90:
            return [-rect.width, 0];
          case 180:
            return [-rect.width, -rect.height];
          default:
            return 0;
        }
      case 90:
        switch (parentRotate) {
          case -90:
            return [-rect.height, -rect.width];
          case 0:
            return [0, -rect.width];
          case 180:
            return [-rect.height, 0];
          default:
            return 0;
        }
      case 180:
        switch (parentRotate) {
          case -90:
            return [-rect.width, 0];
          case 0:
            return [-rect.width, -rect.height];
          case 90:
            return [0, -rect.height];
          default:
            return 0;
        }
      default:
        return 0;
    }
  }

  render() {
    const { rotate, scale } = this.props;
    const parent: HTMLElement = this.state.parent;

    const outerDivStyle = {
      transform: this.getContainerTransform(parent, rotate, scale),
      transformOrigin: '0% 0%'
    }

    return (<div className="full-size" style={outerDivStyle}>{this.props.children}</div>);
  }
}

export default TransformWrapper;
