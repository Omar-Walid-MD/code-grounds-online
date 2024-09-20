import React from 'react';
import { Col } from 'react-bootstrap';
import { FaCode, FaQuestion } from 'react-icons/fa';
import {Button as BS_Button} from 'react-bootstrap';
import TutorialPopup from '../TutorialPopup';

function SideBar({currentTab,setCurrentTab}) {

    const buttons = [
        {
            label: "Question Tab",
            icon: <FaQuestion size={30} />
        },
        {
            label: "Code Tab",
            icon: <FaCode size={30} />
        }
    ]


    return (
        <div className="play-sidebar container-border px-0 px-md-4 p-4 pb-lg-0 d-flex flex-row flex-md-column align-items-center gap-3">
        {
            buttons.map((button,index)=>
                <div className='tutorial-popup-container position-relative d-flex align-items-center justify-content-center'>
                    <BS_Button variant='transparent' className={`select-tab-button p-2 ${currentTab===index ? "selected" : ""} text-white shadow rounded-0 border-0`}
                    onClick={()=>setCurrentTab(index)}>{button.icon}</BS_Button>
                    <TutorialPopup text={button.label} />
                </div>
            )
        }
        </div>
    );
}

export default SideBar;