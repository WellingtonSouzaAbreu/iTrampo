import React from 'react'
import Toast from 'react-bootstrap/Toast'

function ToastMessages(msg, visibility, toastType) {
    let style
    style = toastType === 'success' ? 'bg-success' : ''
    style += toastType === 'error' ? 'bg-danger' : ''
    style += toastType === 'warning' ? 'bg-warning' : ''
    return (
        <div>
            <div
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: 'relative',
                    minHeight: '0px',
                }}
            >
                <div
                    style={{
                        position: "fixed",
                        top: '20px',
                        right: '22px',
                    }}
                >
                    <Toast className={style} show={visibility}
                        style={{
                            color: 'white',
                            zIndex: 4,
                            borderRadius: '10px'
                        }}>
                        <Toast.Body>{msg}</Toast.Body>
                    </Toast>
                </div>
            </div>
        </div>
    )
}

export default ToastMessages