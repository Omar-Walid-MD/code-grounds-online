import React from 'react';
import { generateAvatar } from '../Helpers/avatar';

function UserAvatar({src,className,style}) {
    return (
        <img src={generateAvatar(src)} className={`user-avatar ${className}`} style={style} />
    );
}

export default UserAvatar;