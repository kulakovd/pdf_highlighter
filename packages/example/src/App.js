// @flow

import React, {Component} from "react";

import URLSearchParams from "url-search-params";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    AreaHighlight,
    PdfViewer

} from "react-pdf-highlighter";

import testHighlights from "./test-highlights";

import Spinner from "./Spinner";
import Sidebar from "./Sidebar";

import type {
    T_Highlight,
    T_NewHighlight
} from "react-pdf-highlighter/src/types";

import "./style/App.css";

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

const HighlightPopup = ({comment}) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

const DEFAULT_URL = "https://arxiv.org/pdf/1708.08021.pdf";

const searchParams = new URLSearchParams(document.location.search);
const url = searchParams.get("url") || DEFAULT_URL;

let item = localStorage.getItem(url);

class App extends Component<Props, State> {

    state = {
        highlights: item ? JSON.parse(item) ? [...JSON.parse(item)] : [] : [],
        rotate: false,
        scale: false
    };

    state: State;

    resetHighlights = () => {
        this.setState({
            ...this.state, highlights: []
        });
        console.log(this.state)
    };

    rotate = () => {
        this.setState({
            ...this.state, rotate: !this.state.rotate
        });
        console.log(this.state)
    };
    scale = () => {
        this.setState({
            ...this.state, scale: !this.state.scale
        });
    };

    scrollViewerTo = (highlight: any) => {
    };

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

    getHighlightById(id: string) {
        const {highlights} = this.state;

        return highlights.find(highlight => highlight.id === id);
    }

    addHighlight(highlight: T_NewHighlight) {
        const {highlights} = this.state;

        console.log("Saving highlight", highlight);

        localStorage.setItem(url, JSON.stringify(highlight));
        this.setState({
            highlights: [{...highlight, id: getNextId()}, ...highlights]
        });
    }

    updateHighlight(highlightId: string, position: Object, content: Object) {
        console.log("Updating highlight", highlightId, position, content);

        this.setState({
            highlights: this.state.highlights.map(h => {
                return h.id === highlightId
                    ? {
                        ...h,
                        position: {...h.position, ...position},
                        content: {...h.content, ...content}
                    }
                    : h;
            })
        });
    }

    render() {
        const {highlights, rotate, scale} = this.state;
        localStorage.setItem(url, highlights);
        return (
            <div className="App" style={{display: "flex", height: "100vh"}}>
                <SplitterLayout>
                    <div
                        style={{
                            height: "100vh",
                            width: "75vw",
                            overflowY: "scroll",
                            position: "relative"
                        }}
                    >
                        <div className='col-sm-12 text-center'>
                            <h1 className='text-white bg-info rounded'>Fetch PDF by URL</h1>
                            <div className='border rounded'>
                                <PdfViewer
                                    document={{
                                        url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
                                    }}
                                />
                            </div>
                        </div>
                        <PdfLoader url={url} beforeLoad={<Spinner/>}>
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
                                                this.addHighlight({content, position, comment});

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
                                            />
                                        ) : (
                                            <AreaHighlight
                                                highlight={highlight}
                                                onChange={boundingRect => {
                                                    this.updateHighlight(
                                                        highlight.id,
                                                        {boundingRect: viewportToScaled(boundingRect)},
                                                        {image: screenshot(boundingRect)}
                                                    );
                                                }}
                                            />
                                        );

                                        return (
                                            <Popup
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
                        rotate={this.rotate}
                        scale={this.scale}
                    />
                </SplitterLayout>
            </div>
        );
    }
}

export default App;
