const fs = require('fs');
[
    'main0.js',
    'main1.js',
    'fn.js',
    'init.js',
    'classPeople1.js',
    'extension\\undertale-like-system.js',
].map(str=>'.\\gameTry\\js\\'+str).reduce((s,path)=>fs.readFile(path,'utf-8',(e,value)=>{
    const testReg = /^[\s\t]{0,}[/*]/,testReg1 = /^[\s\t]{0,}[)}];?$/;
    console.log(
        path,e ?? value.split(/[\n\r\t]/).
        reduce((c,str)=>(str && ((testReg.test(str) || testReg1.test(str)) ? c[1]++ : c[0]++),c),[0,0]).
        reduce((s,v,i,arr)=>i === 1 ? [...arr,arr[0] / (arr[0] + arr[1])] : s)
    );
}),0);
/**
 * console.log(testReg.test(str) , typeof str,str),
 */