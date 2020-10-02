import React from 'react'
import PropTypes from 'prop-types'

const RotateRight = ({ css, rotationAngle, handleRotateRight }) => {
    const handleRotate = e => {
        e.preventDefault();
        handleRotateRight();
    }

    return (
        <button onClick={handleRotate} disabled={rotationAngle === 180}>
            <i className='icon app-icons'>rotate_right</i>
        </button>
    )
}
RotateRight.propTypes = {
    css: PropTypes.string,
    rotationAngle: PropTypes.number.isRequired,
    handleRotateRight: PropTypes.func.isRequired,
}

export default RotateRight
