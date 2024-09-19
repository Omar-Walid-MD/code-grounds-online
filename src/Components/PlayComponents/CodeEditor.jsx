import React, { useEffect, useRef, useState } from 'react';
import { Editor, loader } from '@monaco-editor/react';
import { codeSnippets, updatedCodeSnippets } from '../../codeAPI/langauges';

function CodeEditor({editorRef,handleEditorChange,height,defaultLanguage="python",language,protectedLines=[]}) {

    const protectedLinesRef = useRef([]);
    const previousValue = useRef("");
    const languageChanged = useRef(true);

    function getProtectedLineIndexes()
    {
        const indexes = [];
        const splitLines = previousValue.current.split("\n");
        for (let i = 0; i < splitLines.length; i++)
        {
            const line = splitLines[i].trim();
            if(protectedLinesRef.current.includes(line)) indexes.push(i+1);
            
        }
        return indexes;
    }

    loader.init().then((monaco) => {
        monaco.editor.defineTheme('editor-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#000000',
                'editor.lineHighlightBorder': '#000000',
                'editorWhitespace.foreground': '#000000' // Set the color for whitespace characters
            },
            
        });

        monaco.editor.addKeybindingRule({
            keybinding: monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
            command: null
        });
        

    });

    useEffect(()=>{
        protectedLinesRef.current = protectedLines.map((lineIndex) => updatedCodeSnippets[language.code].code.split("\n")[lineIndex-1].trim());
    },[protectedLines]);

    useEffect(()=>{

        languageChanged.current = true;
        if(previousValue.current)
        {
            previousValue.current = updatedCodeSnippets[language.code].code;
        }
        

    },[language]);

    useEffect(()=>{
        if(editorRef.current)
        {
            editorRef.current.getDomNode().addEventListener('copy',(event)=>{
                event.preventDefault();
                const selection = editorRef.current.getModel().getValueInRange(editorRef.current.getSelection());
                const cleanedSelection = selection.replace(/\u200B/g, '');
                event.clipboardData.setData('text/plain', cleanedSelection);
            });
        }
    },[editorRef.current])

    return (
        <Editor
        height={height}
        theme='editor-theme'
        options={{
            minimap:{enabled:false},
            scrollBeyondLastLine:false,
            fontSize: "16rem",
            unicodeHighlight:
            {
                invisibleCharacters: false
            }   
        }}
        
        
        defaultLanguage={defaultLanguage}
        language={language.code}
        onChange={handleEditorChange}
        onMount={(e)=>{

            editorRef.current = e;
            let isUndoing = false;
            e.onDidChangeModelContent((event)=>{
                if(isUndoing || languageChanged.current)
                {
                    languageChanged.current = false;
                    return;
                };

                const model = editorRef.current.getModel();

                if(protectedLinesRef.current.length)
                {

                    const {range,rangeLength,text} = event.changes[0];

                    const previousLineCurrent = previousValue.current.split("\n")[range.startLineNumber-1].trim();

                    if(
                        !(text==="\r\n" && range.startColumn===1 && range.endColumn===1)
                        &&
                        !(text === "" && rangeLength > 0 && range.startColumn===1 && range.endColumn===1)
                        &&
                        !(text.includes("\r\n") && text.trim()==="" && range.startColumn===previousLineCurrent.length+1 && range.endColumn===previousLineCurrent.length+1)
                    )
                    {
                        let doUndo = false;
    
                        const indexes = getProtectedLineIndexes();
                        for (let i = 0; i < indexes.length; i++)
                        {
                            const index = indexes[i];
                            if(index >= range.startLineNumber && index <= range.endLineNumber)
                            {
                                doUndo = true;
                                break;
                            }
                            
                        }
    
                        if(doUndo)
                        {
                            isUndoing = true;
                            model.undo();
                            isUndoing = false;
                        }
                    }


                }
                console.log("huh");
                previousValue.current = e.getValue();
            });

            handleEditorChange(updatedCodeSnippets[language.code].code);
            previousValue.current = updatedCodeSnippets[language.code].code;

        }}
        >
        </Editor>
    );
}

export default CodeEditor;