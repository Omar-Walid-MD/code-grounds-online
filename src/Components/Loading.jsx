import React from 'react';

function Loading({className}) {
    return (
        <div className={`loading font-mono text-bright ${className || ""}`}>
            Loading...
        </div>
    );
}

export default Loading;