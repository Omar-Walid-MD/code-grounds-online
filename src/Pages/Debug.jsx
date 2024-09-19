import React from 'react';
import CodeSubmit from '../Components/PlayComponents/CodeSubmit';
import { getCodeOutput, testCode } from '../codeAPI/api';
import { wrapCode } from '../codeAPI/langauges';
import { questions } from '../questions/questions';

function Debug({}) {


    async function onSubmit(codeValues,languageValues)
    {
        const question = questions[0]
        const result = await testCode(codeValues[0],languageValues[0],question);
        console.log(result);
    }


    return (
        <div className='page-container main-bg font-mono text-white px-3 d-flex flex-column align-items-center justify-content-center'>
           <CodeSubmit
           visible
           onSubmit={onSubmit}
           questions={[{something:"something"}]}
           questionIndex={0}
           solvedQuestions={[]}
           />
        </div>
    );
}

export default Debug;