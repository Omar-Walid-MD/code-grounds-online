import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from '../Components/CodeEditor';
import LanguageSelect from '../Components/LanguageSelect';
import { codeSnippets, languages } from '../codeAPI/langauges';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { getCodeOutput } from '../codeAPI/api';

function CodeSubmit({visible=false,questions,onSubmit,questionIndex=0,solvedQuestions=[]}) {

    const editorRef = useRef();

    const [languageValues,setLanguageValues] = useState([]);
    const [codeValues,setCodeValues] = useState([]);
    const [inputValues,setInputValues] = useState([]);
    const [outputValues,setOutputValues] = useState([]);

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
        setCodeValues(c => c.map((x,i) => i===questionIndex ? codeSnippets[lang.code] : x));

    }

    function handleInput(e)
    {
        setInputValues(inputs => inputs.map((x,i) => i===questionIndex ? e.target.value : x));
    }

    async function runCode()
    {
        setTestLoading(true);
        const output = await getCodeOutput(codeValues[questionIndex],languageValues[questionIndex],inputValues[questionIndex]);
        setOutputValues(o => o.map((x,i) => i===questionIndex ? output.data.run.output : x));
        setTestLoading(false);    
    }

    useEffect(()=>{
        if(!languageValues.length)
        {
            setLanguageValues(questions.map((q)=>languages[1]));
            setInputValues(questions.map((x,i)=>"1\n"));
            setOutputValues(questions.map((x,i)=>""));
            setCodeValues(questions.map((q)=>codeSnippets["python"]));
        }
    },[questions]);

    useEffect(()=>{
        if(languageValues.length)
        {
            handleEditorChange(codeSnippets[languageValues[questionIndex].code]);
        }
    },[languageValues]);

    useEffect(()=>{
        handleEditorChange(codeValues[questionIndex]);
    },[questionIndex]);

    return (
        <div className={`h-100 p-1 ${visible ? "d-flex" : "d-none"} flex-column gap-3`}>
            <div className="d-flex gap-3">
                <LanguageSelect language={languageValues[questionIndex] || "python"} setLanguage={handleLanguage} />
                {
                    !testLoading ?
                    <Button className="main-button arrow secondary" onClick={()=>runCode()}>Run Code</Button>
                    :
                    <Button className="main-button secondary px-5 d-flex align-items-center justify-content-center"><Spinner className='border-4' style={{height:30,width:30}} /></Button>
                }
            </div>

            <Row className='w-100 g-0'>

                <Col className='col-12 col-md-8 p-0 pe-md-3 order-1 order-md-0'>
                    <div className='w-100 h-100'>
                        {
                            languageValues.length > 0  &&
                            <CodeEditor
                            handleEditorChange={handleEditorChange}
                            editorRef={editorRef}
                            height="300px"
                            defaultLanguage='python'
                            language={languageValues[questionIndex]}
                            />
                        }
                    </div>
                </Col>

                <Col className='col-12 col-md-4 overflow-hidden'>
                    <Row className='g-2 g-md-0'>
                        <Col className='col-6 col-md-12'>
                            <p className='w-100 text-center mb-0 bg-success py-1'>Input</p>
                            <textarea className='code-run-input w-100 textarea-input p-2'
                            value={inputValues[questionIndex]} onChange={(e)=>handleInput(e)}
                            ></textarea>
                        </Col>
                        <Col className='col-6 col-md-12'>
                            <p className='w-100 text-center mb-0 bg-success py-1'>Output</p>
                            <textarea className='code-run-output w-100 textarea-input p-2'
                            readOnly value={outputValues[questionIndex]}
                            ></textarea>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
                !resultLoading ?
                <Button
                className="main-button arrow w-100 fs-5"
                disabled={codeValues[questionIndex]==="" || solvedQuestions.includes(questionIndex)}
                onClick={async ()=>{
                    setResultLoading(true);
                    await onSubmit(codeValues,languageValues,questions);
                    setResultLoading(false);
                }}
                >Submit</Button>
                :
                <Button className="main-button w-100 d-flex align-items-center justify-content-center"><Spinner className='border-4' style={{height:30,width:30}} /></Button>

            }
        </div>
    );
}

export default CodeSubmit;