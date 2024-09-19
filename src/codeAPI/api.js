import axios from "axios";
import { questionLoopCode, wrapCode } from "./languages";

const api = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
});

export async function getCodeOutput(code,language,input="")
{
    const res = await api.post("/execute",{
        "language": language.code,
        "version": language.v,
        "files": [
            {
                "content": code,
            }
        ],
        "stdin": input

    });
    return res.data.run.output;
}

export async function getCodeAnswerResult(code,language,question)
{
    if(!navigator.onLine) return true;
    
    const input = question.testInputs.join("\n");
    const wrappedCode = wrapCode(code,language,question.testInputs.length);
    const res = await getCodeOutput(wrappedCode,language,input);
    
    const codeOuput = res.trim();
    const output = question.outputs.join("\n").trim();

    // console.log(input);
    // console.log(codeOuput);
    // console.log(output);

    return output.trim()===codeOuput.trim() //|| true;
}

export async function testCode(code,language,input)
{
    if(!navigator.onLine) return true;
    
    const wrappedCode = wrapCode(code,language,1);
    const res = await getCodeOutput(wrappedCode,language,input);
    
    return res.trim();
}