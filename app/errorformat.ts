const arrow_right = " \u{2192} ";
const arrow_down = " \u{21B3} ";
const arrow_up = " ^ "

function spacer(size, char = ' ') {
    let str = "";
    for (let i = 0; i < size; i++) {
        str += char;
    }
    return str;
}

// const promSucc = () => new Promise(function (resolve, _reject) {
//     resolve("it worked!");
// });
// const promFail = () => new Promise(function (resolve, _reject) {
//     resolve("it worked!");
// });
// const promThrow = () => new Promise(function (_resolve, _reject) {
//     throw ("it threw!");
// });

// function wrapAll(fn_array) {
//     return (prev_output) => {
//         prev_output[prev_output.length - 1].unchain = true;
//         return Promise.all(fn_array.map(fn => fn(prev_output)))
//             .then((results) => {
//                 // console.log('results');
//                 // console.log(results);
//                 return [...prev_output, results];
//             })
//         // return [ ...prev_output, [ [{fun: 'foo', status: 'complete'}], [{fun: 'foo', status: 'complete'}] ] ];
//         // return Promise.all(fn_array.map(fn => wrapFn(fn(prev_output), '4.1')));
//     }
// }

// const exd2 =
//     Promise.all([
//         w(promSucc, 'reg0')().then(w(promSucc, 'reg1'))
//             .then(wrapAll([
//                 (prev) => w(promSucc, 'reg3/foo0')(prev).then(w(promSucc, 'reg3/foo1')),
//                 (prev) => w(promSucc, 'reg3/bar0')(prev).then(w(promSucc, 'reg3/bar1')).then(wrapAll([
//                     (prev) => w(promSucc, 'reg3/bar1/apple0')(prev).then(w(promSucc, 'reg3/bar1/apple1')),
//                     (prev) => w(promSucc, 'reg3/bar1/pear0')(prev)
//                 ]))
//                     .then(w(promSucc, 'final00000000'))
//                     .then(wrapAll([
//                         (prev) => w(promSucc, 'extra0')(prev),
//                         (prev) => w(promSucc, 'extra1')(prev)
//                     ]))

//             ])),
//         w(promSucc, 'ninja0')()
//     ]);


// const exd = [
//     [
//         {
//             "fun": "getToken",
//             "status": "completed",
//             "result": "***",
//             "error": null
//         },
//         [
//             [
//                 {
//                     "fun": "saveToken",
//                     "status": "completed",
//                     "result": 0,
//                     "error": null
//                 }
//             ],
//             [
//                 {
//                     "fun": "registerNumber",
//                     "status": "skipped",
//                     "result": null,
//                     "error": null
//                 }
//             ],
//             [
//                 {
//                     "fun": "subscribeWebhook",
//                     "status": "completed",
//                     "result": {
//                         "success": true
//                     },
//                     "error": null
//                 }
//             ]
//         ]
//     ],
//     [
//         {
//             "fun": "addUser",
//             "status": "completed",
//             "result": {
//                 "success": true
//             },
//             "error": null
//         }
//     ],
//     [
//         {
//             "fun": "shareLoc",
//             "status": "skipped",
//             "result": null,
//             "error": null
//         }
//     ]
// ];


// const example_data = [
//     [
//         { fun: "getToken", status: "completed" }, [
//             [{ fun: "saveToken", status: "completed" }],
//             [{ fun: "complicatedLongName", status: "completed" }, { fun: "register2", status: "completed" }, [
//                 [{ fun: "register1", status: "completed" }],
//                 [{ fun: "register2", status: "completed" }, { fun: "register2.1", status: "completed" }],
//                 [{ fun: "register2", status: "completed" }]
//             ], { fun: "lastOne", status: "completed" }]
//         ],
//     ],
//     [{ fun: "shareLoC", status: "completed" }, [[{ fun: "shareLoC", status: "completed" }], [{ fun: "shareLoC", status: "completed" }]]],
//     [{ fun: "addUser", status: "completed" }],
// ];

function parseP(str, indent, parallel) {
    parallel.forEach(function (serial, i) {
        if (i === 0) {
            str += arrow_right;
            str += parseS("", indent, serial);
        } else {
            str += indent + arrow_down;
            str += parseS("", indent, serial);
        }
    });
    return str;
}

function parseS(str, indent, serial) {
    serial.forEach(function (serialItem, i) {
        if (Array.isArray(serialItem)) {
            str += parseP("", indent, serialItem);
        } else {
            if (i > 0) str += arrow_right;
            const content = `${serialItem.status} (${serialItem.fun})`
            str += content;
            indent += spacer(content.length + 3);
            if (i === serial.length - 1) { // if last item of serial that's the end of the row
                str += "\n";
            }
        }
    });
    return str;
}

function formatErrors(data) {
    return parseP("", "", data)
};

function wrapFn(promise, label) {
    return promise
        .then(data => { return [{ fun: label, status: "completed", result: data, error: null }] })
        .catch(err => { console.error(err); return [{ fun: label, status: "failed", result: null, error: err }] });
}

function w(promise, label) {
    return (prev_result) => {
        let arg;
        if (!prev_result) prev_result = [];
        if (prev_result[prev_result.length - 1]) {
            arg = prev_result[prev_result.length - 1].result;
            if (prev_result[prev_result.length - 1]) {
                prev_result = [];
            }
        }
        return promise(arg)
            .then(data => { return [...prev_result, { fun: label, status: "completed", result: data, error: null }] })
            .catch(err => { return [...prev_result, { fun: label, status: "failed", result: null, error: err }] });
    };
}

// function w3(promise, label) {
//     return (prev_result) => {
//         const arg = prev_result[prev_result.length - 1] ? prev_result[prev_result.length - 1].result : undefined;
//         return promise(arg)
//             .then(data => { return [{ fun: label, status: "completed", result: data, error: null }] })
//             .catch(err => { return [{ fun: label, status: "failed", result: null, error: err }] });
//     };
// }

function skipProm(label) {
    return [{ fun: label, status: "skipped", result: null, error: null }]
}


export { formatErrors };
export { w };
export { wrapFn };
export { skipProm };






function parseP2(str, indent, parallel, _currentRow, potEnd, _postdent, isEnd) {
    const { maxWidth, _maxString } = maxWidthP(parallel, '');
    let totalRows = 0;
    parallel.forEach(function (serial, i) {
        const { s_str, maxRows } = parseS2("", indent, serial, i, potEnd, maxWidth, isEnd);
        totalRows += maxRows;
        str += s_str;
    });
    return { p_str: str, totalRows };
}

function parseS2(str, indent, serial, rowInParent, potEnd, parentMaxWidth, isParentEnd) {
    let maxRows = 1;
    const { width } = widthS(serial, '');
    serial.forEach(function (serialItem, i) {

        // item is an array
        if (Array.isArray(serialItem)) {
            const isEnd2 = serial.length - 1 === i;
            const { p_str, totalRows } = parseP2("", indent, serialItem, null, potEnd, parentMaxWidth, isEnd2);
            if (totalRows > maxRows) {
                maxRows = totalRows;
            }
            str += p_str;

            // you got to the end but it's an array, nest into the next one
            if (i === serial.length - 1) {
            }
        }

        // item is a node
        else {

            // if first item
            if (i === 0 && rowInParent === 0) {
                str += arrow_right;
            }
            else if (i === 0 && rowInParent > 0) {
                str += indent + arrow_down;
            }

            // if no the first item
            else if (i > 0) {
                str += arrow_right;
            }

            const content = toString(serialItem);
            str += content;
            indent += spacer(content.length + 3);

            // if last item of serial that's the end of the row
            if (i === serial.length - 1) {
                if (isParentEnd) {
                    const delta = parentMaxWidth - width;
                    const b = spacer(delta);
                    str += b + parentMaxWidth + ':' + width;
                    str += "END\n";
                }
            }
        }
    });
    return { s_str: str, maxRows };
}

const graph = []; // rows

function maxWidthP(parallel, str, globalIndent, rowOfParent, isEndInParentSeries) {
    let maxWidthSoFar = 0;
    let maxStringSoFar = null;
    let rowsSoFar = 0;
    const { maxWidth } = OmaxWidthP(parallel, str);
    parallel.forEach((item, index) => {
        const { width, string, rows } = widthS(item, str, globalIndent, rowOfParent + rowsSoFar, index, isEndInParentSeries, maxWidth);
        rowsSoFar += rows;
        if (maxWidthSoFar < width) {
            maxWidthSoFar = width;
            maxStringSoFar = string;
        }
    });
    return { maxWidth: maxWidthSoFar, maxString: maxStringSoFar, totalRows: rowsSoFar };
}

function widthS(serial, str, indentOfParent, globalRow, rowInParentParallel, isEndParentParallel, parentWidth) {
    let widthSoFar = 0;
    let stringSoFar = '';
    let maxRows = 1;
    serial.forEach((item, index) => {
        const currentIndent = widthSoFar + indentOfParent;
        const isCurrentEnd = index === serial.length - 1;

        // array split
        if (Array.isArray(item)) {
            const { maxWidth, maxString, totalRows } = maxWidthP(item, str, currentIndent, globalRow, isCurrentEnd);
            widthSoFar += maxWidth;
            stringSoFar += maxString;
            if (totalRows > maxRows) {
                maxRows = totalRows;
            }
        }

        // node
        else {

            let pre_buffer = 0;
            if (index === 0 && rowInParentParallel > 0) {
                pre_buffer = currentIndent;
            }

            const itemString = toString(item);
            widthSoFar += itemString.length + 3;
            stringSoFar += itemString + ' > ';


            let pre_symbol = arrow_right;
            if (rowInParentParallel > 0 && index === 0) {
                pre_symbol = arrow_down;
            }
            let is_end = false;
            if ((isEndParentParallel && isCurrentEnd && rowInParentParallel === 0) || (isCurrentEnd && rowInParentParallel > 0)) {
                is_end = true;
            }
            if (isCurrentEnd && rowInParentParallel > 0 && !isEndParentParallel) {
                const maxRows = OwidthS(serial.slice(index), '').rows;
                console.log('!!!!! ', + maxRows + ' ' + rowInParentParallel);
                if (maxRows >= rowInParentParallel) {
                    is_end = false;
                }
            }


            let post_symbol = "";
            if (isCurrentEnd && rowInParentParallel > 0 && !isEndParentParallel) {
                post_symbol = arrow_up;
            }
            let post_buffer = 0;
            if (isCurrentEnd) {
                post_buffer = parentWidth - widthSoFar;
            }



            if (!graph[globalRow]) graph[globalRow] = [];
            graph[globalRow].push({ currentIndent, globalRow, itemString, pre_symbol, is_end, post_symbol, post_buffer, pre_buffer, is_last_parallel: isEndParentParallel });
        }
    });
    return { width: widthSoFar, string: stringSoFar, rows: maxRows };
}

function toString(node) {
    return `${node.status} (${node.fun})`
}



// function formatErrors2(data) {
//     return parseP2("", "", data, 0, true, '', false)
// };




// exd2.then(data => {
//     // console.log(JSON.stringify(data, null, 2));
//     // console.log(formatErrors(data));
//     // console.log(maxWidthP(data, '', 0, 0, true));
//     console.log(graph);
//     console.log(formatter(graph));
// });







function OmaxWidthP(parallel, str) {
    let maxWidth = 0;
    let maxString = null;
    let rowsSoFar = 0;
    parallel.forEach((item, _index) => {
        const { width, string, rows } = OwidthS(item, str);
        rowsSoFar += rows;
        if (maxWidth < width) {
            maxWidth = width;
            maxString = string;
        }
    });
    return { maxWidth, maxString, totalRows: rowsSoFar };
}

function OwidthS(serial, str) {
    let widthSoFar = 0;
    let stringSoFar = '';
    let maxRows = 1;
    serial.forEach((item, _index) => {


        // array split
        if (Array.isArray(item)) {
            const { maxWidth, maxString, totalRows } = OmaxWidthP(item, str);
            widthSoFar += maxWidth;
            stringSoFar += maxString;
            if (totalRows > maxRows) {
                maxRows = totalRows;
            }
        }

        // node
        else {
            const itemString = toString(item);
            widthSoFar += itemString.length + 3;
            stringSoFar += itemString + ' > ';
        }
    });
    return { width: widthSoFar, string: stringSoFar, rows: maxRows };
}


// function formatter(data) {
//     let str = '';
//     let pre_buffer = 0;
//     let stringLenSoFar = 0;
//     data.forEach(row => {
//         row.forEach(node => {
//             pre_buffer += node.pre_buffer;
//             str += spacer(pre_buffer - stringLenSoFar) + node.pre_symbol + node.itemString;
//             if (!node.is_last_parallel) {
//                 if (node.post_buffer > 1) {
//                     str += ' ' + spacer(node.post_buffer - 1, '-') + node.post_symbol;
//                 } else {
//                     str += spacer(node.post_buffer, '-') + node.post_symbol;
//                 }
//             }
//             if (node.is_end) str += '\n';
//             stringLenSoFar += node.itemString.length + 3 + node.pre_buffer + node.post_buffer;
//             if (node.post_symbol === arrow_up) stringLenSoFar += pre_buffer + 3;
//         })
//         pre_buffer = 0;
//         stringLenSoFar = 0;
//     })
//     return str;
// }
