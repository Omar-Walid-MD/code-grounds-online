import React, { useEffect, useRef } from 'react';
import { Editor, loader } from '@monaco-editor/react';
import { codeSnippets } from '../codeAPI/langauges';

function CodeEditor({editorRef,handleEditorChange,height,defaultLanguage="python",language}) {


    loader.init().then((monaco) => {
        monaco.editor.defineTheme('editor-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#000000',
                'editor.lineHighlightBorder': '#000000'
            },
        });

        monaco.editor.addKeybindingRule({
            keybinding: monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
            command: null
        })
    });

    return (
        <Editor
        height={height}
        theme='editor-theme'
        options={{
            minimap:{enabled:false}        
        }}
        
        
        defaultLanguage={defaultLanguage}
        language={language.code}
        onChange={handleEditorChange}
        onMount={(e)=>{
            editorRef.current = e;
            handleEditorChange(codeSnippets[language.code]);
        }}
        >
        </Editor>
    );
}

export default CodeEditor;