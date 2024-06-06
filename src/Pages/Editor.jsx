import { Editor } from '@monaco-editor/react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { getCodeOutput } from '../codeAPI/api';
import LanguageSelect from '../Components/LanguageSelect';
import axios from 'axios';
import { languages, wrapCode } from '../codeAPI/langauges';

function Main({}) {

    const [loading,setLoading] = useState(false);
    const [language,setLanguage] = useState(languages[1]);
    const [codeValue,setCodeValue] = useState("");
    const [output,setOutput] = useState("");


    function handleCodeValue(code)
    {
        setCodeValue(code);
    }

    async function submitCode()
    {
        setLoading(true);
        const res = await getCodeOutput(wrapCode(codeValue,language),language);
        setOutput(res.data.run.output);
        setLoading(false);
    }

    return (
        <div>
            <h1>Editor</h1>
            <Container>
                <Row>
                    <Col className='col-6 d-flex flex-column align-items-start gap-2'>
                        <div className='d-flex gap-3'>
                            <h4>Code</h4>
                            <LanguageSelect language={language} setLanguage={setLanguage} />
                        </div>
                        <div className='rounded-2 overflow-hidden w-100'>
                            <Editor
                            height="500px"
                            theme='vs-dark'
                            defaultLanguage='python'
                            language={language.code}
                            value={codeValue}
                            onChange={handleCodeValue}
                            >
                            </Editor>
                        </div>
                        <Button
                        className="mt-2 w-100"
                        onClick={()=>submitCode()}
                        >Submit</Button>

                    </Col>
                    <Col className='col-6 d-flex flex-column align-items-start gap-2'>
                        <h4>Output</h4>
                        <div className='bg-dark w-100 rounded-2 overflow-hidden d-flex justify-content-center align-items-center'
                        style={{height:"500px"}}>
                        {
                            !loading ?
                            <Form.Control
                            className='bg-dark text-white p-0 px-2'
                            as="textarea"
                            style={{minHeight:"500px",maxHeight:"500px",fontFamily:"monospace"}}
                            value={output}
                            readOnly/>
                            :
                            <Spinner variant='white' animation='border' className='border-5' style={{height:150,width:150}}  />
                        }
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Main;