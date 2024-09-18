import React from 'react';
import { Col } from 'react-bootstrap';
import { FaCode, FaQuestion } from 'react-icons/fa';
import {Button as BS_Button} from 'react-bootstrap';

function SideBar({currentTab,setCurrentTab}) {

    const buttons = [
        {
            label: "Question",
            icon: <FaQuestion size={30} />
        },
        {
            label: "Code",
            icon: <FaCode size={30} />
        }
    ]


    return (
        <div className="play-sidebar container-border px-0 px-md-4 p-4 pb-lg-0 d-flex flex-row flex-md-column align-items-center gap-3">
        {
            buttons.map((button,index)=>
                <div className='select-tab-button-container position-relative d-flex align-items-center justify-content-center'>
                    <BS_Button variant='transparent' className={`select-tab-button p-2 ${currentTab===index ? "selected" : ""} text-white shadow rounded-0 border-0`}
                    onClick={()=>setCurrentTab(index)}>{button.icon}</BS_Button>
                    
                    <div className='select-tab-label position-absolute h-100 top-0 d-flex align-items-center justify-content-center'>
                        <div className='select-tab-label-text bg-black h-100 d-flex align-items-center justify-content-center px-3 fs-5'>{button.label}</div>
                        <div className='select-tab-label-pointer position-absolute'></div>
                    </div>
                </div>
            )
        }
        </div>
    );
}

export default SideBar;