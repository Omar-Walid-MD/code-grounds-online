export const languages = [
    {
        code: "javascript",
        name: "Javascript",
        v: "18.15.0" 
    },
    {
        code: "python",
        name: "Python",
        v: "3.10.0"
    },
    {
        code: "java",
        name: "Java",
        v: "15.0.2"
    },
    {
        code: "csharp",
        name: "C#",
        v: "6.12.0"
    },
    {
        code: "cpp",
        name: "C++",
        v: "10.2.0"
    },
    {
        code: "c",
        name: "C",
        v: "10.2.0"
    }
]

export const codeSnippets = {
    // "javascript": ``,
    "python":

`if __name__ == '__main__':
    for i in range(int(input(""))):
        `,
    "java":

`import java.util.*;

public class MainClass {
    public static void main(String[] args) {
		Scanner s = new Scanner(System.in);  
		int n = s.nextInt();
        while(n-- > 0)
        {
			
        }
        
    }
}`,
    "csharp":

`using System;

class MainClass {
    static public void Main(String[] args) {
        int n = int.Parse(Console.ReadLine());
		while(n-- > 0)
		{
			
		}
    }
}`,
    "c":

`#include <stdio.h>
    
int main() {
    int n; scanf("%d",&n);
	while(n--)
	{
		
	}
}`,
    "cpp":
`#include<iostream>
using namespace std;

int main() {
	int n; std::cin >> n;
	while(n--)
	{
		
	}
}`
}

const codeWrappers = {
    // "javascript": ["",""],
    "python": [`if __name__ == '__main__':\n`,""],
    "java": [`public class MainClass {public static void main(String[] args){`,"}}"],
    "csharp": [`using System;\nclass MainClass {\nstatic public void Main(String[] args){\n`,"}\n}"],
    "c": [`#include <stdio.h>\n void main(){`,"}"],
    "cpp": [`#include<iostream>\n using namespace std; int main(){`,"}"]
}



export function wrapCode(code,language)
{
    const wrappedCode = `${codeWrappers[language.code][0]}${code}${codeWrappers[language.code][1]}`;

    return wrappedCode;
}

export function questionLoopCode(code,language,question)
{
    const n = question.testInputs.length;
    if(language.code==="python")
    {
        let codeLines = code.split("\n");
        code = codeLines.map((c) => "\t\t"+c).join("\n");
    }

    const loopWrapper = {
        // "javascript": [`const inputN = ${n};while(inputN--){`,'}'],
        "python": [`\tfor inputN in range(${n}):\n`,"\n"],
        "java": [`int inputN = ${n};while(inputN--){`,"}"],
        "csharp": [`int inputN = ${n};while(inputN--){`,"}"],
        "c": [`int inputN = ${n};while(inputN--){`,"}"],
        "cpp": [`int inputN = ${n};while(inputN--){`,"}"]
    }

    return `${loopWrapper[language.code][0]}${code}${loopWrapper[language.code][1]}`;
}