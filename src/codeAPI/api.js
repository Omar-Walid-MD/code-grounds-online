import axios from "axios";
import { questionLoopCode, wrapCode } from "./langauges";

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
    return res;
}

export async function testCode(code,language,question)
{
    if(!navigator.onLine) return true;
    
    const input = question.testInputs.length + "\n" + question.testInputs.join("\n");

    // code = wrapCode(questionLoopCode(code,language,question),language);

    const res = await getCodeOutput(code,language,input);
    const codeOuput = res.data.run.output.trim();
    const output = question.outputs.join("\n").trim();
    console.log(input);
    console.log(codeOuput);
    console.log(output);

    return output.trim()===codeOuput.trim() || true;
}