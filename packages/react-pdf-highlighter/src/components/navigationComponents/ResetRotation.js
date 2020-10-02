import React from 'react'
import PropTypes from 'prop-types'

const ResetRotation = ({ css, rotationAngle, handleResetRotation }) => {
    const isDisabled = () => rotationAngle === 0;

    const handleReset = e => {
        e.preventDefault();
        handleResetRotation();
    }

    return (
        <button onClick={handleReset} disabled={isDisabled()}>
            <i className='icon app-icons'>refresh</i>
        </button>
    )
}
ResetRotation.propTypes = {
    css: PropTypes.string,
    rotationAngle: PropTypes.number.isRequired,
    handleResetRotation: PropTypes.func.isRequired,
}

export default ResetRotation
