'use strict';
// makeClass = ((tempFn,tempObj)=>
//     (className,instanceObj)=>
//         [String,Symbol].includes(className?.constructor) && instanceObj instanceof Object ? (
//             tempFn(instanceObj,tempObj = {constructor: {},method: {},initAttr: {}}),
//             Object.assign(
//                 (window[className] = function(newObj = tempObj.constructor){
//                     Object.assign(this,tempObj.initAttr,tempObj.constructor,newObj)
//                 }).prototype,
//                 tempObj.method
//             ),
//             console.log(className,window[className]),
//             window[className]
//         ) : console.error('')
// )((instanceObj,tempObj)=>{
//     for(var [key,value] of Object.entries(instanceObj)){
//         const {constructor,method,initAttr} = tempObj;
//         switch(value?.constructor){
//             case undefined:constructor[key] = undefined;break;
//             case Function:method[key] = value;break;
//             default:initAttr[key] = value;
//         }
//     }
// });
String.prototype.toDom = (template=>
    function(){template.innerHTML = this; return template.content.firstElementChild;}
)(document.createElement('template'));
var GM = timeRecord(new Promise(r=>window.onload = r)).then(({time})=>class protoGM{
    static tBefore = time;
    static t0 = Date.now();
    constructor(){Object.defineProperty(protoGM,'instance',{enumerable: false,get: ()=>this});}
    /**
     * @type {protoGM}
     */
    static instance;
    static Map_list = class Map_list extends Map{
        /**
         * 
         * @param {(value,key,map)=>void} callback 
         * @param  {...any} param 
         */
        constructor(list,callback,...param){
            super(...param);
            this.list = list;
            callback instanceof Function && this.forEach(callback,this.list);
        }
    };
    promiseArray = [];
    processArray = {};
    /**
     * makePromise() 作出承诺
     * @param {()=>any} fn 
     */
    makePromise(fn){console.log('! promiseCount:',this.promiseArray.push(
        new Promise(resolve=>setTimeout(()=>resolve(timeRecord(fn)))).
        then(({time})=>console.log('- promiseCount:',time,'ms'))
    ));}
    /**
     * completeSelf() 独善其身
     * @param {String} pathStr 
     * @returns {Promise<protoGM | Error>}
     */
    completeSelf(pathStr,forgot = true){return timeRecord(Promise.all(this.promiseArray)).then(
        ({time})=>(console.log(pathStr,'用时',time,'ms'),forgot && (this.promiseArray = []),this),
        ({message: e})=>{throw console.error(e = new Error(String(pathStr)+'\n'+e)),e;}
    );}
    static Process = class Process{
        intervalID;
        timeSep;
        paused = false;
        onEvent;
        nowFn;
        gameIntervalFn(){
            this.onEvent?.();this.nowFn = this.nowFn instanceof Function ? this.nowFn() : void this.defaultFn?.();
        }
        [0](){this.paused || this.gameIntervalFn();}
        [1](){
            this.paused || Promise.resolve(this.promise).
            then(()=>(this.promise = false,this.gameIntervalFn())).
            catch(e=>console.error(e));
        }
        [2](){
            this.paused || Promise.resolve(this.promise && this.stepFn?.()).
            then(value=>{if(value){throw value;}else{return;}}).
            then(()=>(this.promise = false,this.gameIntervalFn())).
            catch(e=>e instanceof Error && console.error(e));
        }
    };
    /**
     * setGameInterval() 设置游戏循环计时器
     * @param {String | Symbol} type 
     * @param {Number} timeSep 
     * @returns {protoGM.Process}
     */
    setGameInterval(type,timeSep,exMode = 0){
        if(!(timeSep > 0)) throw new Error('=> "timeSep" must be legal !');
        /**
         * @type {protoGM.Process}
         */
        const temp = this.processArray[type] ??= new protoGM.Process;
        exMode && (temp.promise ??= false),exMode > 1 && (temp.step ??= 0);
        return 0 !== (timeSep = +timeSep) && isFinite(timeSep) && timeSep !== temp.timeSep && (
            temp[exMode] instanceof Function ? (
                temp.timeSep = timeSep,Number === temp.intervalID?.constructor && clearInterval(temp.intervalID),
                temp.intervalID = setInterval(()=>temp[exMode](),timeSep),console.log(type,timeSep)
            ) : errorThrow(new Error('=> Wrong exMode when setGameInterval "'+String(type)+'" !'))
        ),temp;
    }
    /**
     * 
     * @param {(String | Symbol)[]} keyList 
     * @param {{}} temp 
     * @returns {temp}
     */
    searchSelf(keyList = [],temp){
        var obj = this,key,value;
        temp ??= Object.create({},{length: {get(){return Object.keys(this).length;}}});
        for(key of keyList) obj = obj[key];
        'self' in obj && (temp[keyList.join('.')] = obj.self);
        for(key in obj){
            value = obj[key];
            value instanceof EventTarget || value instanceof Function || !(value instanceof Object) ||
            value?.__proto__?.__proto__?.__proto__?.__proto__?.__proto__ ||
            void this.searchSelf([...keyList,key],temp);
        }
        return temp;
    }
});