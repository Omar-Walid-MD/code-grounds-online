import React from 'react';

function Loading({className}) {
    return (
        <div className={`loading font-mono fs-4 text-bright ${className || ""}`}>
            Loading...
        </div>
    );
}

export default Loading;