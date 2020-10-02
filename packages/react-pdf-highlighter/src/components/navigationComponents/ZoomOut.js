import React from 'react'
import PropTypes from 'prop-types'

const ZoomOut = ({ css, scale, defaultScale, minScale, handleZoomOut }) => {
    let checkScale = minScale
    if (defaultScale < minScale) {
        checkScale = defaultScale
    }

    const isDisabled = () => scale.toFixed(2) === checkScale.toFixed(2);

    const handleZoom = e => {
        e.preventDefault();
        handleZoomOut();
    }

    return (
        <button onClick={handleZoom} disabled={isDisabled()}>
            <i className='icon app-icons'>zoom_out</i>
        </button>
    )
}

ZoomOut.propTypes = {
    css: PropTypes.string,
    scale: PropTypes.number.isRequired,
    defaultScale: PropTypes.number.isRequired,
    minScale: PropTypes.number.isRequired,
    handleZoomOut: PropTypes.func.isRequired,
}

export default ZoomOut
