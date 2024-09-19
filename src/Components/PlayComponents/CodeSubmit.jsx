import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import LanguageSelect from './LanguageSelect';
import { updatedCodeSnippets, languages, wrapCode } from '../../codeAPI/languages';
import { Col, Row, Spinner } from 'react-bootstrap';
import { getCodeOutput, testCode } from '../../codeAPI/api';
import Button from '../Button';
import Loading from '../Loading';

function CodeSubmit({visible,questions,onSubmit,questionIndex=0,solvedQuestions=[]}) {

    const editorRef = useRef();

    const [languageValues,setLanguageValues] = useState([]);
    const [codeValues,setCodeValues] = useState([]);
    const [inputValues,setInputValues] = useState([]);
    const [outputValues,setOutputValues] = useState([]);

    const [protectedLines,setProtectedLines] = useState([]);


    const [testLoading,setTestLoading] = useState(false);
    const [resultLoading,setResultLoading] = useState(false);

    const handleEditorChange = (newValue) => {

        const editor = editorRef.current;
        if(editor)
        {
            handleCodeValue(newValue);
            const currentValue = editor.getValue();
        
            if (currentValue !== newValue) {
                const range = editor.getModel().getFullModelRange();
                const edits = [{ range, text: newValue }];
                editor.executeEdits('', edits);
            }

        }
    };

    function handleCodeValue(code)
    {
        setCodeValues(c => c.map((x,i) => i===questionIndex ? code : x));
    }

    function handleLanguage(lang)
    {
        setLanguageValues(l => l.map((x,i) => i===questionIndex ? lang : x));
        setCodeValues(c => c.map((x,i) => i===questionIndex ? updatedCodeSnippets[lang.code].code : x));

    }

    function handleInput(e)
    {
        setInputValues(inputs => inputs.map((x,i) => i===questionIndex ? e.target.value : x));
    }

    async function runCode()
    {
        setTestLoading(true);
        const output = await testCode(codeValues[questionIndex],languageValues[questionIndex],inputValues[questionIndex]);
        setOutputValues(o => o.map((x,i) => i===questionIndex ? output : x));
        setTestLoading(false);
    }

    useEffect(()=>{
        if(!languageValues.length)
        {
            setLanguageValues(questions.map((q)=>languages[0]));
            setInputValues(questions.map((x,i)=>""));
            setOutputValues(questions.map((x,i)=>""));
            setCodeValues(questions.map((q)=>updatedCodeSnippets[languages[0].code].code));
            setProtectedLines(updatedCodeSnippets[languages[0].code].protectedLines);
        }
    },[questions]);

    useEffect(()=>{
        if(languageValues.length)
        {
            handleEditorChange(updatedCodeSnippets[languageValues[questionIndex].code].code);
            setProtectedLines(updatedCodeSnippets[languageValues[questionIndex].code].protectedLines);
        }
    },[languageValues]);

    useEffect(()=>{
        handleEditorChange(codeValues[questionIndex]);
        if(languageValues.length)
        {
            setProtectedLines(updatedCodeSnippets[languageValues[questionIndex].code].protectedLines);
        }
    },[questionIndex]);


    return (
        //using visible instead of not rendering the element to preserve state of codes, languages, etc...
        <div className={`${visible ? "d-flex" : "d-none"} w-100 flex-column`}>
            <p className="fs-5 bg-primary m-0 px-3">Code</p>
            <div className='w-100 h-100 ps-3 pt-3 d-flex flex-column gap-3'>
                <div className="d-flex gap-3">
                    <LanguageSelect language={languageValues[questionIndex] || "python"} setLanguage={handleLanguage} />
                    {
                        !testLoading ?
                        <Button arrow bordered onClick={()=>runCode()}>Run Code</Button>
                        :
                        <Button variant='secondary' className="d-flex align-items-center justify-content-center"><Loading className='fs-6 text-white' /></Button>
                    }
                </div>

                <Row className='w-100 g-0'>

                    <Col className='col-12 col-md-8 p-0 order-1 order-md-0'>
                        <div className='w-100 h-100 container-border border-end-0 pt-3 bg-black'>
                            {
                                languageValues.length > 0  &&
                                <CodeEditor
                                handleEditorChange={handleEditorChange}
                                editorRef={editorRef}
                                height="400px"
                                defaultLanguage='python'
                                language={languageValues[questionIndex]}
                                questionIndex={questionIndex}
                                protectedLines={protectedLines}
                                />
                            }
                        </div>
                    </Col>

                    <Col className='col-12 col-md-4'>
                        <div className='h-100 w-100 d-flex flex-column justify-content-start align-items-stretch'>
                            <div className='h-100 w-100 d-flex flex-column'>
                                <p className='w-100 text-center mb-0 bg-primary py-1'>Input</p>
                                <textarea className='h-100 w-100 textarea-input p-2 container-border'
                                value={inputValues[questionIndex]} onChange={(e)=>handleInput(e)}
                                placeholder='>> Your Input Here'
                                ></textarea>
                            </div>
                            <div className='h-100 w-100 d-flex flex-column'>
                                <p className='w-100 text-center mb-0 bg-primary py-1'>Output</p>
                                <textarea className='h-100 w-100 textarea-input p-2 container-border'
                                readOnly value={outputValues[questionIndex]}
                                placeholder='>> Your Output Here'
                                ></textarea>
                            </div>
                        </div>
                    </Col>
                </Row>
                {
                    !resultLoading ?
                    <Button
                    className="w-100 fs-5"
                    arrow
                    disabled={codeValues[questionIndex]==="" || solvedQuestions.includes(questionIndex)}
                    onClick={async ()=>{
                        setResultLoading(true);
                        await onSubmit(codeValues,languageValues,questions);
                        setResultLoading(false);
                    }}
                    >Submit</Button>
                    :
                    <Button className="main-button w-100 d-flex align-items-center justify-content-center">
                        <Loading className='text-white' />
                    </Button>

                }
            </div>
        </div>
    );
}

export default CodeSubmit;