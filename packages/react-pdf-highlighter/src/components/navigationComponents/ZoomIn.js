import React from 'react'
import PropTypes from 'prop-types'

const ZoomIn = ({ css, scale, defaultScale, maxScale, handleZoomIn }) => {
    let checkScale = maxScale
    if (defaultScale > maxScale) {
        checkScale = defaultScale
    }

    const isDisabled = () => scale.toFixed(2) === checkScale.toFixed(2);

    const handleZoom = e => {
        e.preventDefault();
        handleZoomIn();
    }

    return (
        <button onClick={handleZoom} disabled={isDisabled()}>
            <i className='icon app-icons'>zoom_in</i>
        </button>
    )
}

ZoomIn.propTypes = {
    css: PropTypes.string,
    scale: PropTypes.number.isRequired,
    defaultScale: PropTypes.number.isRequired,
    maxScale: PropTypes.number.isRequired,
    handleZoomIn: PropTypes.func.isRequired,
}

export default ZoomIn
