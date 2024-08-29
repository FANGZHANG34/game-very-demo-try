const fs = require('fs');
['.\\js\\main0.js','.\\js\\main1.js','.\\js\\fn.js','.\\js\\classPeople.js','.\\js\\classPeople1.js','.\\js\\extension\\undertale-like-system.js'].
reduce((s,path)=>fs.readFile(path,'utf-8',(e,value)=>{
    const testReg = /^[\s\t]{0,}[/\*]/;
    console.log(
        path,e ?? value.split(/\n|\r/).
        reduce((c,str)=>(str && (testReg.test(str) ? c[1]++ : c[0]++),c),[0,0]).
        reduce((s,v,i,arr)=>i === 1 ? [...arr,arr[0] / (arr[0] + arr[1])] : s)
    );
}),0);
/**
 * console.log(testReg.test(str) , typeof str,str),
 */