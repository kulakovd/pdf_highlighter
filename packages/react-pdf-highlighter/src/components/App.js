// @flow

import React, { Component } from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import PdfLoader from "./PdfLoader";
import PdfHighlighter from "./PdfHighlighter";
import Tip from "./Tip";
import Highlight from "./Highlight";
import Popup from "./Popup";
import AreaHighlight from "./AreaHighlight";
import PdfViewer from "./PDFViewer";
import Spinner from "./Spinner";
import Sidebar from "./Sidebar";

import type { T_Highlight, T_NewHighlight } from "react-pdf-highlighter/src/types";

import "../style/App.css";

type T_ManuscriptHighlight = T_Highlight;

type Props = {};

type State = {
  highlights: Array<T_ManuscriptHighlight>
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

function isJson(item) {
  try {
    JSON.parse(item);
  } catch (e) {
    return false;
  }
  return true;
}

class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.url = this.props.url;
    const item = localStorage.getItem(this.url);
    this.state = {
      highlights: isJson(item) ? JSON.parse(item) ? [...JSON.parse(item)] : [] : [],
      rotate: 0,
      scale: 1
    };
  }

  resetHighlights = () => {
    this.setState({
      ...this.state,
      highlights: []
    });
  };

  removeHighlight = e => {
    const array = [...this.state.highlights];
    const index = array.indexOf(e);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({
        ...this.state,
        highlights: array
      });
    }
  };

  setRotation = angle => {
    this.setState({
      ...this.state,
      rotate: angle
    });
  };

  setZoom = scale => {
    this.setState({
      ...this.state,
      scale: scale
    });
  };

  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
  }

  getHighlightById = (id: string) => {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }

  addHighlight = (highlight: T_NewHighlight) => {
    const { highlights } = this.state;
    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights]
    });
  }

  updateHighlight = (highlightId: string, position: Object, content: Object) => {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map(h => {
        return h.id === highlightId
          ? {
              ...h,
              position: { ...h.position, ...position },
              content: { ...h.content, ...content }
            }
          : h;
      })
    });
  }

  render() {
    const { highlights, rotate, scale } = this.state;
    localStorage.setItem(this.url, JSON.stringify(highlights));
    return (
      <div className="App">
        <SplitterLayout secondaryInitialSize={465}>
          <div
            style={{
              height: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div className="border rounded">
              <PdfViewer
                onZoom={scale => this.setZoom(scale)}
                onRotation={angle => this.setRotation(angle)}
                scaleStep={0.1}
                maxScale={2.6}
                minScale={0.5}
              />
            </div>
            <PdfLoader url={this.url} beforeLoad={<Spinner />}>
              {pdfDocument => (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  rotate={rotate}
                  scale={scale}
                  enableAreaSelection={event => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={scrollTo => {
                    this.scrollViewerTo = scrollTo;

                    this.scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection
                  ) => (
                    <Tip
                      onOpen={transformSelection}
                      onConfirm={comment => {
                        this.addHighlight({ content, position, comment });

                        hideTipAndSelection();
                      }}
                    />
                  )}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo
                  ) => {
                    const isTextHighlight = !Boolean(
                      highlight.content && highlight.content.image
                    );

                    const component = isTextHighlight ? (
                      <Highlight
                        isScrolledTo={isScrolledTo}
                        position={highlight.position}
                        comment={highlight.comment}
                        rotate={rotate}
                        scale={scale}
                      />
                    ) : (
                      <AreaHighlight
                        rotate={rotate}
                        scale={scale}
                        highlight={highlight}
                        onChange={boundingRect => {
                          this.updateHighlight(
                            highlight.id,
                            { boundingRect: viewportToScaled(boundingRect) },
                            { image: screenshot(boundingRect) }
                          );
                        }}
                      />
                    );

                    return (
                      <Popup
                        rotate={rotate}
                        scale={scale}
                        popupContent={<HighlightPopup {...highlight} />}
                        onMouseOver={popupContent =>
                          setTip(highlight, highlight => popupContent)
                        }
                        onMouseOut={hideTip}
                        key={index}
                        children={component}
                      />
                    );
                  }}
                  highlights={highlights}
                />
              )}
            </PdfLoader>
          </div>

          <Sidebar
            highlights={highlights}
            resetHighlights={this.resetHighlights}
            removeHighlight={this.removeHighlight}
            rotate={this.rotate}
            scale={this.scale}
          />
        </SplitterLayout>
      </div>
    );
  }
}

export default App;
