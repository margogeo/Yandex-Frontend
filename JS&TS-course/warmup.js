'use strict';
 
/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    if (Number.isInteger(a) && Number.isInteger(b)) {
        return a + b;
    } else {
        throw new TypeError();
    }
}
 
/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
 function centuryByYearProblem(year) {
    if (typeof(year) == 'number') {
        if (year <= 0 || !Number.isInteger(year)) {
            throw new RangeError();
        }
        return Math.ceil(year/100);
    } else {
        throw new TypeError();
    }
}
 
/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
 function colorsProblem(hexColor) {
    if (typeof(hexColor) == "string") {
        if (hexColor.length != 7 && hexColor.length != 4 || hexColor[0] != "#") {
            throw new RangeError();
        }
        let a = [0, 0, 0];
        let hex = "#";
        if (hexColor.length == 4) {
            for (let i = 1; i < 4; i++) {
                hex += hexColor[i] + hexColor[i];
            }
        } else {
            hex = hexColor;
        }
        for (let i = 1; i < hex.length; i++) {
            if (hex[i] >= '0' && hex[i] <= '9') {
                a[Math.floor((i - 1) / 2)] += Math.pow(16, i % 2) * parseInt(hex[i], 16);
                continue;
            }
            if (hex[i].toUpperCase() >= 'A' && hex[i].toUpperCase() <= 'F') {
                a[Math.floor((i - 1) / 2)] += Math.pow(16, i % 2) * parseInt(hex[i], 16);
                continue;  
            }
            throw new RangeError();  
        }
        let answer = "(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
        return answer;
    } else {
        throw new TypeError();
    }
}
 
/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    if (typeof(n) == "number") {
        if (!Number.isInteger(n) || n < 1) {
            throw new RangeError();
        }
        let f = 1, s = 1, index = 3;
        if (n == 1 || n == 2)
            return 1;
        for (;index <= n; index++) {
            let temp = s;
            s = s + f;
            f = temp;
        }
         return s;
    } else {
        throw new TypeError();
    }
}
 
/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
 function matrixProblem(matrix) {
    let ans = [];
if (Array.isArray(matrix)) {
let n = matrix.length;
let m;
for (let i = 0; i < n; i++) {
if (Array.isArray(matrix[i])) {
    m = matrix[i].length;
    continue;
}
throw new TypeError(); 
}
for (let i = 0; i < m; i++) {
ans.push(new Array(n));
}
for (let i = 0; i < matrix.length; i++) {
for (let j = 0; j < matrix[i].length; j++) {
    ans[j][i] = matrix[i][j];
}
}
return ans;
} else {
throw new TypeError();
}
}
 
/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    if (typeof(n) == "number" && typeof(targetNs) == "number") {
        if (!Number.isInteger(targetNs) || targetNs < 2 || targetNs > 36) {
            throw new RangeError();
        }
        return n.toString(targetNs);
    } else {
        throw new TypeError();
    }
}
 
/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
 function phoneProblem(phoneNumber) {
    if (typeof(phoneNumber) == "string") {
        if (phoneNumber.length == 15 && phoneNumber.substr(0, 6) == "8-800-"
         && phoneNumber[9] == "-" && phoneNumber[12] == "-" 
         && phoneNumber[6] >= "0" && phoneNumber[6] <= "9"
         && phoneNumber[7] >= "0" && phoneNumber[7] <= "9"
         && phoneNumber[8] >= "0" && phoneNumber[8] <= "9"
         && phoneNumber[10] >= "0" && phoneNumber[10] <= "9"
         && phoneNumber[11] >= "0" && phoneNumber[11] <= "9"
         && phoneNumber[13] >= "0" && phoneNumber[13] <= "9"
         && phoneNumber[14] >= "0" && phoneNumber[14] <= "9") {
            return true;
        } else {
            return false;
        }
    } else {
        throw new TypeError();
    }
}
 
/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    if (typeof(text) == "string") {
        let num = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] == ":") {
                if (i < text.length - 2 && text[i + 1] == "-" && text[i + 2] == ")") {
                    num++;
                    i += 2;
                }
            }
            if (text[i] == "(") {
                if (i < text.length - 2 && text[i + 1] == "-" && text[i + 2] == ":") {
                    num++;
                    i += 2;
                }
            }
        }
        return num;
    } else {
        throw new TypeError();
    }
}
 
/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    for (let i = 0; i < 3; i++) {
        let sum1 = 0;
        let sum2 = 0;
        for (let j = 0; j < 3; j++) {
            if(field[i][j] == field[i][0])
               sum1++;
            if(field[j][i] == field[0][i])
               sum2++;
        }
        if (sum1 == 3 && (field[i][0] == 'x' || field[i][0] == 'o'))
            return field[i][0];
        if (sum2 == 3 && (field[0][i] == 'x' || field[0][i] == 'o'))
            return field[0][i];
    }
    let sum1 = 0;
    let sum2 = 0;
    for (let i = 0; i < 3; i++) {
        if (field[i][i] == field[0][0])
            sum1++;
        if (field[i][2 - i] == field[0][2])
            sum2++;
    }
    if (sum1 == 3 && (field[0][0] == 'x' || field[0][0] == 'o'))
        return field[0][0];
    if (sum2 == 3 && (field[0][2] == 'x' || field[0][2] == 'o'))
        return field[0][2];
    return 'draw';
}
 
module.exports = {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};