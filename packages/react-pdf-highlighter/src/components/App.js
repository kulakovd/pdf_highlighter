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

import type { T_Highlight, T_NewHighlight } from "../types";

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

const HighlightPopup = ({ comment, getIcon }) => {
  const icon = comment ? getIcon(comment.emoji) : null;
  return comment.text ? (
    <div className="Highlight__popup">
      {icon ? <i className="icon app-icons" style={{color: icon.color, marginRight: 10}}>{icon.icon}</i> : null}{comment.text}
    </div>
  ) : null;
}

class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.url = this.props.url;
    this.state = {
      highlights: JSON.parse(props.loadAnnotations()),
      rotate: 0,
      scale: 1
    };
  }

  resetHighlights = () => {
    this.setState({
      ...this.state,
      highlights: []
    }, () => {
      if (this.props.manualAnnotationsControl) {
        this.props.resetAnnotations();
      } else {
        this.saveAnnotations();
      }
    });
  };

  canRemoveHighlight = e => this.props.canDeleteAnnotations || (e.authorId === this.props.authorId && this.props.canDeleteOwnAnnotations);

  removeHighlight = e => {
    const array = [...this.state.highlights];
    const index = array.indexOf(e);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({
        ...this.state,
        highlights: array
      }, () => {
        if (this.props.manualAnnotationsControl) {
          this.props.deleteAnnotation(e.id);
        } else {
          this.saveAnnotations();
        }
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

  getHighlightById = (id: string) => {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }

  addHighlight = (highlight: T_NewHighlight) => {
    const { highlights } = this.state;
    const { author, authorId } = this.props;
    this.setState({
      highlights: [{ ...highlight, id: getNextId(), author, authorId }, ...highlights]
    }, () => {
      if (this.props.manualAnnotationsControl) {
        this.props.addAnnotation(highlight);
      } else {
        this.saveAnnotations();
      }
    });
  }

  updateHighlight = (highlightId: string, position: Object, content: Object) => {
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
    }, () => {
      if (this.props.manualAnnotationsControl) {
        this.props.updateAnnotation(highlightId, this.getHighlightById(highlightId));
      } else {
        this.saveAnnotations();
      }
    });
  }

  saveAnnotations = () => {
    if (this.props.saveAnnotations)
      this.props.saveAnnotations(JSON.stringify(this.state.highlights));
  }

  findIconByName = (name) => this.props.icons.find(e => e.name === name);

  render() {
    const { highlights, rotate, scale } = this.state;
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
                  canCreateHighlight={this.props.canCreateAnnotations}
                  enableAreaSelection={event => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={scrollTo => {
                    this.scrollViewerTo = scrollTo;
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection
                  ) => (
                    <Tip
                      icons={this.props.icons}
                      onOpen={transformSelection}
                      onConfirm={comment => {
                        this.addHighlight({ content, position, comment });

                        hideTipAndSelection();
                      }}
                      phrases={this.props.phrases}
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
                        getIcon={this.findIconByName}
                      />
                    ) : (
                      <AreaHighlight
                        rotate={rotate}
                        scale={scale}
                        highlight={highlight}
                        getIcon={this.findIconByName}
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
                        popupContent={<HighlightPopup {...highlight} getIcon={this.findIconByName} />}
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
            canRemoveHighlight={this.canRemoveHighlight}
            rotate={this.rotate}
            scale={this.scale}
            phrases={this.props.phrases}
            onHighlightClick={h => this.scrollViewerTo(h)}
          />
        </SplitterLayout>
      </div>
    );
  }
}

export default App;
