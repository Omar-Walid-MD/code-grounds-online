const questions = [
    {
        title: "Array Sum",
        question: "Given a string of integers separated by spaces, return the sum of the elements.",
        testInputs: [
            "1 2 3 4 5",
            "10 20 30 40 50",
            "-1 -2 -3 -4 -5",
            "0 0 0 0 0"
        ],
        outputs: [
            "15",
            "150",
            "-15",
            "0"
        ]
    },
    {
        title: "Array Product",
        question: "Given a string of integers separated by spaces, return the product of the elements.",
        testInputs: [
            "1 2 3 4",
            "5 6 7 8",
            "-1 2 -3 4",
            "0 1 2 3"
        ],
        outputs: [
            "24",
            "1680",
            "24",
            "0"
        ]
    },
    {
        title: "Array Maximum",
        question: "Given a string of integers separated by spaces, return the maximum value in the array.",
        testInputs: [
            "1 2 3 4 5 6",
            "10 20 30 40 50 60",
            "-10 -20 -30 -40 -50 -60",
            "0 0 0 0 0 1"
        ],
        outputs: [
            "6",
            "60",
            "-10",
            "1"
        ]
    },
    {
        title: "Array Average",
        question: "Given a string of integers separated by spaces, return the average value of the elements (rounded down to the nearest integer).",
        testInputs: [
            "1 2 3",
            "10 20 30",
            "5 10 15",
            "-3 0 3"
        ],
        outputs: [
            "2",
            "20",
            "10",
            "0"
        ]
    },
    {
        title: "Array 2nd Largest",
        question: "Given a string of integers separated by spaces, return the second largest value in the array.",
        testInputs: [
            "1 3 5 7",
            "10 20 30 40",
            "-1 -2 -3 -4",
            "0 1 2 3"
        ],
        outputs: [
            "5",
            "30",
            "-2",
            "2"
        ]
    },
    {
        "title": "Reverse Words",
        "question": "Given a string of words separated by spaces, return a string with the words in reverse order.",
        "testInputs": [
            "hello world",
            "openai is amazing",
            "code everyday",
            "keep learning"
        ],
        "outputs": [
            "world hello",
            "amazing is openai",
            "everyday code",
            "learning keep"
        ]
    },
    {
        "title": "Unique Characters",
        "question": "Given a string, return a string with only the unique characters from the input, preserving their first occurrence.",
        "testInputs": [
            "programming",
            "aabbcc",
            "hello world",
            "abcdefg"
        ],
        "outputs": [
            "progamin",
            "abc",
            "helo wrd",
            "abcdefg"
        ]
    },
    {
        "title": "Sum of Even Numbers",
        "question": "Given a list of integers separated by spaces, return the sum of the even numbers.",
        "testInputs": [
            "1 2 3 4 5 6",
            "10 15 20 25 30",
            "7 8 9 10 11",
            "0 2 4 6 8"
        ],
        "outputs": [
            "12",
            "60",
            "18",
            "20"
        ]
    },
    {
        "title": "Longest Word",
        "question": "Given a string of words separated by spaces, return the longest word. If there are multiple words of the same maximum length, return the first one.",
        "testInputs": [
            "find the longest word",
            "hello world",
            "coding in python",
            "openai chatgpt"
        ],
        "outputs": [
            "longest",
            "hello",
            "coding",
            "chatgpt"
        ]
    },
    {
        "title": "Palindrome Check",
        "question": "Given a string, return 'yes' if the string is a palindrome and 'no' otherwise. A palindrome is a word that reads the same backward as forward.",
        "testInputs": [
            "racecar",
            "hello",
            "madam",
            "openai"
        ],
        "outputs": [
            "yes",
            "no",
            "yes",
            "no"
        ]
    },
    {
        "title": "Count Vowels",
        "question": "Given a string, return the number of vowels (a, e, i, o, u) in the string.",
        "testInputs": [
            "hello world",
            "programming is fun",
            "openai",
            "abcdefghijklmnopqrstuvwxyz"
        ],
        "outputs": [
            "3",
            "5",
            "3",
            "5"
        ]
    },
    {
        "title": "Factorial Calculation",
        "question": "Given a non-negative integer n, return the factorial of n.",
        "testInputs": [
            "5",
            "0",
            "3",
            "7"
        ],
        "outputs": [
            "120",
            "1",
            "6",
            "5040"
        ]
    },
    {
        "title": "Capitalize Words",
        "question": "Given a string of words separated by spaces, return a string with each word capitalized.",
        "testInputs": [
            "hello world",
            "openai is amazing",
            "capitalize each word",
            "good morning"
        ],
        "outputs": [
            "Hello World",
            "Openai Is Amazing",
            "Capitalize Each Word",
            "Good Morning"
        ]
    },
    {
        "title": "Prime Numbers",
        "question": "Given a number n, return a list of all prime numbers less than n.",
        "testInputs": [
            "10",
            "20",
            "30",
            "50"
        ],
        "outputs": [
            "2 3 5 7",
            "2 3 5 7 11 13 17 19",
            "2 3 5 7 11 13 17 19 23 29",
            "2 3 5 7 11 13 17 19 23 29 31 37 41 43 47"
        ]
    },
    {
        "title": "String Compression",
        "question": "Given a string, return a compressed version of the string where consecutive duplicates of characters are replaced with the character followed by the count of repetitions. If the compressed string is not shorter, return the original string.",
        "testInputs": [
            "aabcccccaaa",
            "abcdef",
            "aaabb",
            "aabbcc"
        ],
        "outputs": [
            "a2b1c5a3",
            "abcdef",
            "a3b2",
            "aabbcc"
        ]
    },
    {
        "title": "Sum of Digits",
        "question": "Given a non-negative integer, return the sum of its digits.",
        "testInputs": [
            "12345",
            "678",
            "0",
            "9999"
        ],
        "outputs": [
            "15",
            "21",
            "0",
            "36"
        ]
    },
    {
        "title": "Balanced Parentheses",
        "question": "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.",
        "testInputs": [
            "()",
            "()[]{}",
            "(]",
            "([)]",
            "{[]}"
        ],
        "outputs": [
            "true",
            "true",
            "false",
            "false",
            "true"
        ]
    },
    {
        "title": "GCD of Two Numbers",
        "question": "Given two integers, return their greatest common divisor (GCD).",
        "testInputs": [
            "48 18",
            "100 10",
            "7 3",
            "81 27"
        ],
        "outputs": [
            "6",
            "10",
            "1",
            "27"
        ]
    },
    {
        "title": "Fibonacci Sequence",
        "question": "Given an integer n, return the first n numbers of the Fibonacci sequence.",
        "testInputs": [
            "5",
            "8",
            "1",
            "10"
        ],
        "outputs": [
            "0 1 1 2 3",
            "0 1 1 2 3 5 8 13",
            "0",
            "0 1 1 2 3 5 8 13 21 34"
        ]
    },
    {
        "title": "Anagram Check",
        "question": "Given two strings, return 'yes' if they are anagrams of each other and 'no' otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.",
        "testInputs": [
            "listen silent",
            "hello world",
            "anagram nagaram",
            "rat car"
        ],
        "outputs": [
            "yes",
            "no",
            "yes",
            "no"
        ]
    }   
];

function getQuestions(n)
{
    let allQuestions = [...questions];
    const chosenQuestions = [];
    for(let i = 0; i < n; i++)
    {
        const questionIndex = Math.floor(Math.random()*allQuestions.length);
        chosenQuestions.push(allQuestions[questionIndex]);
        allQuestions = allQuestions.filter((q,i) => i !== questionIndex);
    }

    return chosenQuestions;
}

module.exports = {getQuestions};