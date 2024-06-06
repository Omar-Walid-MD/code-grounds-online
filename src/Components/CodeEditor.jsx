import React from 'react';
import { Editor, loader } from '@monaco-editor/react';

function CodeEditor({height,defaultLanguage="python",language,value,onChange}) {

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
    });

    return (
        <Editor
        height={height}
        theme='editor-theme'
        options={{minimap:false}}
        
        
        defaultLanguage={defaultLanguage}
        language={language.code}
        value={value}
        onChange={onChange}
        >
        </Editor>
    );
}

export default CodeEditor;