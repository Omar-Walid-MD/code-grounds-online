import React from 'react';
import PropTypes from 'prop-types';
import {Button as BS_Button} from "react-bootstrap";
import { Link } from 'react-router-dom';


/**
 * MyComponent description
 * @param {object} props - Component props
 * @param {"primary"|"danger"|"secondary"|"transparent"} props.variant - The variant of the component
 */


function Button(props) {
    return (
        props.linkTo ?

        
        <BS_Button
        as={Link}
        to={props.linkTo}
        state={props.linkState}
        variant={props.variant || "primary"}
        className={`main-button${props.arrow ? " arrow" : ""} ${props.variant || ""} ${!props.bordered ? " fill" : " bordered"} ${props.className || ""}`}
        onClick={props.onClick}
        disabled={props.disabled}
        style={props.style || {}}
        >
        {props.children}
        </BS_Button>

        :

        <BS_Button
        type={props.type || "button"}
        variant={props.variant || "primary"}
        className={`main-button${props.arrow ? " arrow" : ""} ${props.variant || ""} ${!props.bordered ? " fill" : " bordered"} ${props.className || ""}`}
        onClick={props.onClick}
        disabled={props.disabled}
        style={props.style || {}}
        >
        {props.children}
        </BS_Button>
    );
}

Button.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    variant: PropTypes.oneOf(["primary","danger","secondary","transparent"]),
    bordered: PropTypes.bool,
    arrow: PropTypes.bool,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    linkTo: PropTypes.string,
    linkState: PropTypes.object
};

export default Button;