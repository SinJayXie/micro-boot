import * as Chalk from 'chalk';

export const success = function (str: string) {
    console.log(Chalk.hex('#FF00FF').bgGreen(str));
};

export const error = function (str: string) {
    console.log(Chalk.hex('#00FFFF').bgRed(str));
};


export const warn = function (str: string) {
    console.log(Chalk.hex('#0040ff').bgHex('#ffbf00')(str));
};

