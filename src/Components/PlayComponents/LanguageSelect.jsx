import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { languages } from '../../codeAPI/langauges';

function LanguageSelect({language,setLanguage}) {


    return (
        <Dropdown>
            <Dropdown.Toggle className='h-100 main-button bg-primary border-0' id="dropdown-basic">
                {language.name}
            </Dropdown.Toggle>

            <Dropdown.Menu className='language-select bg-black rounded-0 container-border' style={{boxShadow:"0 0 10px rgba(0,0,0,0.75)"}}>
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