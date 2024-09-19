export const languages = [
    {
        code: "python",
        name: "Python",
        v: "3.10.0"
    },
    {
        code: "javascript",
        name: "JavaScript",
        v: "18.15.0" 
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
    "javascript":
`process.stdin.on("data",(data)=>{
    const lines = data.toString().trim().split("\\n");
    const values = lines.slice(1,lines.length);
    
    for(let i = 0; i < lines[0]; i++)
    {
        const value = values[i];
    }
})`,
    "python":

`if __name__ == '__main__':
    for i in range(int(input(""))):
        value = [int(i) for i in input("").split(" ")]
`,
    "java":

`import java.util.*;

public class MainClass {
    public static void main(String[] args) {
		Scanner s = new Scanner(System.in);  
		int n = s.nextInt();
        while(n-- > 0)
        {
			String v = s.next();
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



export function wrapCode(code,language,testCount)
{
    const lc = language.code;
    code = code.replaceAll("\u200B","");
    let newCode = "";

    if(lc==="python")
    {
        const splitLines = code.split("\n");
        let foundMainLine = false;
        for (let i = 0; i < splitLines.length; i++)
        {
            const line = splitLines[i];
            if(line.trim() === `if __name__ == "__main__":`)
            {
                splitLines[i] = `if __name__ == "__main__":\n\tfor input_increment_variable in range(${testCount}):`;
                foundMainLine = true;
            }
            else if(foundMainLine)
            {
                if(line.slice(0,4)==="    ") splitLines[i] = "\t" + line;
                else foundMainLine = false;
            }
            
        }
        newCode = splitLines.join("\n");
    }
    else if(lc==="javascript")
    {
        newCode = `process.stdin.on("data",(data)=>{const inputTestCount = ${testCount};let inputTestIncrement = 0;const inputTestValues = data.toString().trim().split("\\n");const input = () => inputTestValues[(inputTestIncrement++)];for(let testInputForLoopIncrement = 0; testInputForLoopIncrement < inputTestCount; testInputForLoopIncrement++){${code}}});`
    }
    else if(lc==="cpp" || lc==="c")
    {
        newCode = code.replace("int main() {","int mainCodeFunction() {") + `\n\nint main(){for(int testInputForLoopIncrement = 0; testInputForLoopIncrement < ${testCount}; testInputForLoopIncrement++){mainCodeFunction();}}`;
    }
    else if(lc==="java")
    {
        newCode = code
        .replace("public static void main(String[] args) {","public static void mainCodeFunction() {")
        .replace("public class MainClass {",`public class MainClass {public static Scanner javaScannerObject = new Scanner(System.in);public static int inputTestCount = ${testCount}; public static void main(String[] args){javaScannerObject.useDelimiter(System.getProperty("line.separator"));while(inputTestCount-- > 0){mainCodeFunction();}} public static String getInput(){return javaScannerObject.next();}`)
        
    }
    else if(lc==="csharp")
    {
        newCode = code
        .replace("public static void Main(String[] args) {","public static void mainCodeFunction() {")
        .replace("class MainClass {",`class MainClass { public static int inputTestCount = ${testCount}; public static void Main(String[] args){while(inputTestCount-- > 0){mainCodeFunction();}}`)
        
    }
    // console.log(newCode);
    return newCode;
}




export const updatedCodeSnippets = {
    "python":
    {
        code:
`# your functions here\u200B

if __name__ == "__main__"\u200B:
    # your code here`,
        protectedLines: [1,3]
    },


    "javascript":
    {
        code:
`// your main code... use input() to get input line...\u200B\n`,
        protectedLines: [1]
    },


    "cpp":
    {
        code:
`#include<iostream>\u200B
using namespace std;\u200B

//your functions here\u200B

int main() {\u200B

    //your main code here

}\u200B`,
        protectedLines: [1,2,4,6,10]
    },

    "c":
    {
        code:
`#include <stdio.h>\u200B

//your functions here\u200B

int main() {\u200B

    //your main code here

}\u200B`,
        protectedLines: [1,3,5,9]
    },


    "java":
    {
        code:
`import java.util.*;\u200B

public class MainClass {\u200B

    //your functions here\u200B

    public static void main(String[] args) {\u200B
		//your main code here... use getInput() to get input line...\u200B
        

    }\u200B
}\u200B`,
    protectedLines: [1,3,5,11,12]
    },


    "csharp":
    {
        code:
`using System;\u200B

class MainClass {\u200B

    //your functions here\u200B

    public static void Main(String[] args) {\u200B
        // your main code here... use Console.ReadLine() to get input line...\u200B
		

    }\u200B
}\u200B`,
    protectedLines: [1,3,5,7,8,11,12]
    }


}