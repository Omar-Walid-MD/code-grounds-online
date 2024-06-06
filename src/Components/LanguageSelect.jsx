import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { languages } from '../codeAPI/langauges';

function LanguageSelect({language,setLanguage}) {


    return (
        <Dropdown>
            <Dropdown.Toggle className='main-button border-0' id="dropdown-basic">
                {language.name}
            </Dropdown.Toggle>

            <Dropdown.Menu variant='success'  className='rounded-0 shadow'>
            {
                languages.map((lang)=>
                    <Dropdown.Item
                className={language===lang ? "active" : ""}
                onClick={()=>setLanguage(lang)} key={`lang-select-${lang.code}`} >{lang.name}</Dropdown.Item>
                
                )
            }
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default LanguageSelect;