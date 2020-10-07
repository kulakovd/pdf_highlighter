// @flow

import React, { Component } from "react";

import "../style/Tip.css";

type State = {
  compact: boolean,
  text: string,
  emoji: string
};

type Props = {
  onConfirm: (comment: { text: string, emoji: string }) => void,
  onOpen: () => void,
  onUpdate?: () => void
};

class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    emoji: ""
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen, icons } = this.props;
    const { compact, text, emoji } = this.state;

    return (
      <div className="Tip">
        {compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Добавить комментарий
          </div>
        ) : (
          <form
            className="Tip__card"
            onSubmit={event => {
              event.preventDefault();
              onConfirm({ text, emoji });
            }}
          >
            <div>
              <textarea
                width="100%"
                placeholder="Ваш комментарий"
                autoFocus
                value={text}
                onChange={event => this.setState({ text: event.target.value })}
                ref={node => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
              <div style={{marginTop: 5}}>
                {icons.map(e => (
                  <label key={e.name}>
                    <input
                      checked={emoji === e.name}
                      type="radio"
                      name="emoji"
                      value={e.name}
                      onChange={event =>
                        this.setState({ emoji: event.target.value })
                      }
                    />
                    <i className='icon app-icons' style={{color: e.color}}>{e.icon}</i>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <input type="submit" value="Сохранить" />
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default Tip;
