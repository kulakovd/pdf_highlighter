// @flow

import React from "react";
import type { T_Highlight } from "../types";

type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  resetHighlights: () => void,
  removeHighlight: (highlight: T_ManuscriptHighlight) => void,
  canRemoveHighlight:  (highlight: T_ManuscriptHighlight) => boolean,
};

function Sidebar({
   highlights,
   resetHighlights,
   removeHighlight,
   canRemoveHighlight,
   phrases,
   onHighlightClick = () => {}
}: Props) {
  return (
    <div className="sidebar">
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>{phrases.COMMENTS_ON_THE_DOCUMENT}</h2>
        <p>
          <small>{phrases.HOLD_THE_ALT_BUTTON_TO_SPECIFY_THE_AREA}</small>
        </p>
      </div>

      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              onHighlightClick(highlight);
            }}
          >
            <div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <strong>{highlight.comment.text}</strong>
                <button
                  title={phrases.DELETE}
                  style={{border: "none", background: "none"}}
                  disabled={!canRemoveHighlight(highlight)}
                  onClick={e => {
                    e.preventDefault();
                    removeHighlight(highlight);
                  }}>
                  <i className="icon app-icons">delete</i>
                </button>
              </div>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div>
                  <div className="highlight__image" style={{ marginTop: "0.5rem" }}>
                    <img src={highlight.content.image} alt={"Screenshot"} />
                  </div>
                </div>

              ) : null}
            </div>
            <div className="highlight__location">
              {phrases.PAGE} {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>{phrases.CLEAR_ALL}</button>
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;
