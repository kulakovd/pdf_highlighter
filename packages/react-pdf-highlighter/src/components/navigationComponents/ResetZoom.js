import React from 'react'
import PropTypes from 'prop-types'

const ResetZoom = ({ css, scale, defaultScale, handleResetZoom }) => {
    const isDisabled = () => scale.toFixed(2) === defaultScale.toFixed(2);

    const handleReset = e => {
        e.preventDefault();
        handleResetZoom();
    }

    return (
        <button onClick={handleReset} disabled={isDisabled()}>
            <i className='icon app-icons'>refresh</i>
        </button>
    )
}

ResetZoom.propTypes = {
    css: PropTypes.string,
    scale: PropTypes.number.isRequired,
    defaultScale: PropTypes.number.isRequired,
    handleResetZoom: PropTypes.func.isRequired,
}

export default ResetZoom
