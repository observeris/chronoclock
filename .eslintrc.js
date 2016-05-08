module.exports = {
    "extends": "google",
    "rules": {
        indent: [2, 4],
        "eol-last": 2,
        "quote-props": 0,
        "no-multiple-empty-lines": [1, {
            "max": 1
        }],
        "max-depth": 0, // specify the maximum depth that blocks can be nested (off by default)
        "max-len": [2, 120], // specify the maximum length of a line in your program (off by default)
        "max-params": [0, 7], // limits the number of parameters that can be used in the function declaration.
        "max-statements": 0, // specify the maximum number of statement allowed in a function (off by default)
        "no-bitwise": 1, // disallow use of bitwise operators (off by default)
        "no-plusplus": 1, // disallow use of unary operators, ++ and -- (off by default)
        "new-cap": 0,
        "padded-blocks": 0,
        "space-in-parens": 0,
        "arrow-parens": 0
    },
    "globals": {
        "angular": true,
        "jasmine": true, // Lots of jasmine stuff here
        "expect": true,
        "describe": true,
        "it": true,
        "beforeEach": true,
        "afterEach": true,
        "spyOn": true
    }

};
