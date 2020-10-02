import React from 'react'
import PropTypes from 'prop-types'

const RotateLeft = ({ css, rotationAngle, handleRotateLeft }) => {
    const handleRotate = e => {
        e.preventDefault();
        handleRotateLeft();
    }

    return (
        <button onClick={handleRotate} disabled={rotationAngle === -180}>
            <i className='icon app-icons'>rotate_left</i>
        </button>
    )
}

RotateLeft.propTypes = {
    css: PropTypes.string,
    rotationAngle: PropTypes.number.isRequired,
    handleRotateLeft: PropTypes.func.isRequired,
}

export default RotateLeft
