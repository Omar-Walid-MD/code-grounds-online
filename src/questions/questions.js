export const questions = [
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
    }
];

export const answers = [
`n = [int(n) for n in input("").split(" ")]
print(sum(n))`,

`n = [int(n) for n in input("").split(" ")]
p = 1;
for i in n:
    p *= i
print(p)`,

`n = [int(n) for n in input("").split(" ")]
max = n[0];
for i in n:
    if i > max:
        max = i
print(max)`,

`n = [int(n) for n in input("").split(" ")]
print(int(sum(n)/len(n)))`,

`n = [int(n) for n in input("").split(" ")]
n = list(sorted(n))
print(n[len(n)-2])`
]