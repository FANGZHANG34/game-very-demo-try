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
EventTarget.prototype.getIndexWithin = {
    getIndexWithin(){for(var i = 0,temp = this;temp = temp.previousElementSibling;i++);return i;}
}.getIndexWithin;
RealElement.addCSSRules('',{
    '*':{
        'margin':'0',
        'padding':'0',
        'border':'0',
        '-webkit-user-select':'none',
        '-moz-user-select':'none',
        '-ms-user-select':'none',
        'user-select':'none',
    },
    ':root':{
        '--mapWidth':'1920px',
        '--halfBlack':'rgba(0, 0, 0, 0.5)',
        '--halfWhite':'rgba(225, 225, 225, 0.5)',
        '--noColor':'rgba(0, 0, 0, 0)',
    },
    'html':{
        'cursor':'default',
        'background-color':'black',
        'color':'white',
    },
    'body':{
        'transform':'rotate(0)',
        'transform-origin':'50vmin 50vmin',
        'width':'100vmax',
        'height':'calc((var(--mapWidth) - 100vmax) * 9 / 16 + 100vmin)',
        'overflow':'hidden scroll',
    },
    'body>*':{'position':'absolute',},
    'hr':{'border':'1px solid white,'},
    '::-webkit-scrollbar':{'display':'none',},
})('.coverBody',{
    '':{'width': '100vmax','height':'56.25vmax'},
})('.noDisplay',{
    '':{'display':'none'},
})('.disappear',{
    '':{'visibility':'hidden'},
})('.listDown',{
    '':{'writing-mode':'horizontal-tb'},
    '>*':{'position':'relative','display':'block'},
})('.listRight',{
    '':{'writing-mode':'vertical-lr'},
    '>*':{'position':'relative','display':'block'},
})('.listDownListRight',{
    '':{'writing-mode':'horizontal-tb'},
    '>*':{'position':'relative','display':'block','writing-mode':'vertical-lr'},
    '>*>*':{'position':'relative','display':'block'},
})('.listRightListDown',{
    '':{'writing-mode':'vertical-lr'},
    '>*':{'position':'relative','display':'block','writing-mode':'horizontal-tb'},
    '>*>*':{'position':'relative','display':'block'},
})('div.listClose',{
    '':{'writing-mode':'horizontal-tb'},
    '>*':{'position':'absolute'},
    '>:nth-child(1)':{'z-index':'1'},
    '>:nth-child(2)':{'z-index':'2'},
    '>:nth-child(3)':{'z-index':'3'},
    '>:nth-child(4)':{'z-index':'4'},
    '>:nth-child(5)':{'z-index':'5'},
    '>:nth-child(6)':{'z-index':'6'},
    '>:nth-child(7)':{'z-index':'7'},
    '>:nth-child(8)':{'z-index':'8'},
    '>:nth-child(9)':{'z-index':'9'},
    '>:nth-child(10)':{'z-index':'10'},
    '>:nth-child(11)':{'z-index':'11'},
    '>:nth-child(12)':{'z-index':'12'},
    '>:nth-child(13)':{'z-index':'13'},
    '>:nth-child(14)':{'z-index':'14'},
    '>:nth-child(15)':{'z-index':'15'},
})('div.listFar',{
    '':{'writing-mode':'horizontal-tb'},
    '>*':{'position':'absolute'},
    '>:nth-last-child(1)':{'z-index':'1'},
    '>:nth-last-child(2)':{'z-index':'2'},
    '>:nth-last-child(3)':{'z-index':'3'},
    '>:nth-last-child(4)':{'z-index':'4'},
    '>:nth-last-child(5)':{'z-index':'5'},
    '>:nth-last-child(6)':{'z-index':'6'},
    '>:nth-last-child(7)':{'z-index':'7'},
    '>:nth-last-child(8)':{'z-index':'8'},
    '>:nth-last-child(9)':{'z-index':'9'},
    '>:nth-last-child(10)':{'z-index':'10'},
    '>:nth-last-child(11)':{'z-index':'11'},
    '>:nth-last-child(12)':{'z-index':'12'},
    '>:nth-last-child(13)':{'z-index':'13'},
    '>:nth-last-child(14)':{'z-index':'14'},
    '>:nth-last-child(15)':{'z-index':'15'},
})('.onhover',{
    ':hover':{'background':'linear-gradient(#fff,#000,#000,#fff)'}
})('.relativeSquare',{
    '':{'width':'20vmin','height':'20vmin'},
})('.fontTitle',{
    '':{'font-size':'20vmin'},
})('.fontHead',{
    '':{'font-size':'10vmin'},
})('.fontNormal',{
    '':{'font-size':'3vmin'},
})('.scrollY',{
    '':{'overflow':'hidden scroll'}
})('.scrollX',{
    '':{'overflow':'scroll hidden'}
})('.scrollXY',{
    '':{'overflow':'scroll'}
})('.scrollNone',{
    '':{'overflow':'hidden'}
})('.centerCenter',{
    '':{
        'text-align':'center',
        'align-content':'center',
    }
})
;
var GM = timeRecord(new Promise(r=>window.onload = r)).then(result=>(console.log('=> Load window in',result.time,'ms'),class protoGM{
    constructor(){protoGM.instance = this;}
    /**@type {protoGM} */
    static instance;
    static t0 = Date.now();
    // 设置全局的函数、常量和变量

    // configArray 本地配置
    // hoverAudio 鼠标音效元素
    // clickAudio 点击音效元素
    // singleStepLength 单位长度
    // mapWidth,mapHeight 地图相对长度
    // limitWidth,limitHeight 地图坐标限制
    // mapRealWidth,mapRealHeight 地图实际长度
    /**
     * @type {{globalArray: {
     * globalVolume: .25,bgm: .5,bgs: .25,dialogue: .75,
     * textSep: 50,worldSpeed: 30,modeHard: 0
     * }}}
     */
    static configArray = JSON.parse(LZString.decompress(localStorage.getItem('configArray')));
    hoverAudio = new Audio('./audio/1.ogg');
    clickAudio = new Audio('./audio/Cancel2.ogg');
    static singleStepLength = 60;
    static mapWidth = 32;
    static mapHeight = 18;
    static get limitWidth(){return protoGM.mapWidth - 1;}
    static get limitHeight(){return protoGM.mapHeight - 1;}
    static get mapRealWidth(){return protoGM.mapWidth * protoGM.singleStepLength;}
    static get mapRealHeight(){return protoGM.mapHeight * protoGM.singleStepLength;}

    get configArray(){return protoGM.configArray;}
    get singleStepLength(){return protoGM.singleStepLength;}
    get mapWidth(){return protoGM.mapWidth;}
    get mapHeight(){return protoGM.mapHeight;}
    get limitWidth(){return protoGM.limitWidth;}
    get limitHeight(){return protoGM.limitHeight;}
    get mapRealWidth(){return protoGM.mapRealWidth;}
    get mapRealHeight(){return protoGM.mapRealHeight;}
    static setDefaultStyle(){
        RealElement.addCSSRules('.simpleSquare',{
            '':{'width':this.singleStepLength+'px','height':this.singleStepLength+'px'},
        })('.twiceSquare',{
            '':{'width':this.singleStepLength * 2+'px','height':this.singleStepLength * 2+'px'},
        })('.tripleSquare',{
            '':{'width':this.singleStepLength * 3+'px','height':this.singleStepLength * 3+'px'},
        })('.mapBlock',{
            '':{'width':this.mapRealWidth+'px','height':this.mapRealHeight+'px'},
        })
        ;
    }
    static screenControl = (
        RealElement.addCSSRules('.rotate-90-deg',{'':{'transform':'rotate(90deg)','transform-origin':'50vmin 50vmin'}}),
        new class{
            intervalID = setInterval(
                ()=>getWindowWidth() > getWindowHeight() ? document.body.classList.remove('rotate-90-deg') :
                document.body.classList.add('rotate-90-deg'),4
            );
            destroy(){clearInterval(this.intervalID);}
        }
    );
    static realWorld = new function(){
        var temp,i;
        protoGM.setDefaultStyle();
        document.body.innerHTML = '';
        document.body.classList.add('coverBody','scrollNone');
        // document.body.classList.add('scrollXY');
        (this.self = new RealDivList('mainBody',true,[
            ((this.map = new RealDivList('gameMap',true,[
                new RealCanvas,new RealCanvas,new RealCanvas,new RealCanvas,
                '<canvas id="gameEffect"></canvas>',
                ((this.mapBoard = new RealDivList(
                    'gameMapBoard',
                    true,
                    Array(protoGM.mapHeight).fill(Array(protoGM.mapWidth).fill('<div></div>').join(''))
                )).addClassName('listDownListRight'),this.mapBoard.applyCSS('>*>*','simpleSquare'),this.mapBoard.applyCSS('>*>*','onhover'),this.mapBoard.self),
            ])).addClassName('listClose'),this.map.self),
            '<canvas id="playerPhoto"></canvas>',
            '<canvas id="messageImage"></canvas>',
            '<video id="messageVideo"></video>',
            '<div id="gameBorder"></div>',
            '<div id="gameMessage"></div>',
            '<canvas id="gameMenuBG"></canvas><div id="gameMenu0"></div><div id="gameMenu1"></div>',
            '<div id="gameTip"></div>',
            '<div id="gamePrompt"></div>',
        ])).addClassName('listClose','noDisplay');
        this.self.addClassName('coverBody','scrollNone');
        document.body.appendChild(this.self.self);
        this.mainDict = this.self.getIdDict(true);
        this.mainDict.messageImage.addClassName('disappear');
        this.mainDict.messageVideo.addClassName('disappear');
        // this.mainDict.gameBorder.addClassName('disappear');
        this.mainDict.gameMessage.addClassName('disappear');
        this.mainDict.gameTip.addClassName('disappear');
        this.mainDict.gamePrompt.addClassName('disappear');
        // map
        this.mapArray = this.map.childrenList.flat().slice(0,i = 5);
        temp = {width: protoGM.mapRealWidth,height: protoGM.mapRealHeight};
        while(i --> 0){Object.assign(this.mapArray[i],temp);}
        this.mapArray.pop();
        // message
        (this.message = new RealDivList('gameMessage',true,[
            '<div></div><canvas></canvas>',
            '<pre></pre>',
            '<div id="messageDialogue"></div><div id="messageChoice"></div>',
        ])).addClassName('listRight');
        
        /**@type {RealElement[]} */
        this.messageDict = this.message.getRealEmentList();
        this.messageDict[0].addClassName('listDown');
        this.messageDict[0].addClassName('listClose');
        this.messageDialogue = new RealDivList('messageDialogue',false,['继续','自动','跳过','正常']);
        this.messageChoice = new RealDivList('messageChoice');
        // menu
        /**@type {[RealDivList,RealDivList,RealElement]} */
        this.menu = [
            new RealDivList('gameMenu0',false,['DEMO','打开存档','人物面板','成就','设置','导入存档','导出存档','重置游戏']),
            new RealDivList('gameMenu1',true,[
                '<pre id="gameGuide"></pre>',
                '<div id="gameSL"></div><div id="gameInfoSL"></div>',
                '<div id="characterBoard"></div>',
                '<div id="gameGallery"></div>',
                '<div id="gameConfig"></div>',
                '<div id="gameImport"></div>',
                '<div id="gameExport"></div>',
                '<div id="gameReset"></div>',
            ]),
            new RealElement({self: document.getElementById('gameMenuBG')},{
                info: Object.assign(new Image,{onload(){clearCanvas(protoGM.realWorld.menu[2].self).drawImage(this,0,0)}}),
                set(value){return this.proto.value = this.info.src = String(value),false;},
            }),
        ];
        this.menu[2].applyCSS('',{'':{'position':'absolute'}});
        this.menu[2].addClassName('coverBody');
        RealElement.makeElement(this.menu[2].self,temp);
        this.menu[2].value = './img/bg.png';
        this.menu1Array = this.menu[1].getRealEmentList();
        temp = this.menu1Array.length;
        while(temp --> 0) this.menu1Array[temp].addClassName('disappear');
        this.menu[0].info.classList.add('listRightListDown');
        this.menu[0].applyCSS('>*','onhover');
        this.menu[0].self.onclick = (e)=>{
            var i = this.menu1Array.length,temp;
            while(i --> 0) this.menu1Array[i].addClassName('disappear');
            for(i = 0,temp = e.target;temp = temp.previousElementSibling;i++);
            // this.menu1Array[i].removeClassName('disappear');
            this.menu1Array[e.target.getIndexWithin()].removeClassName('disappear');
        };
        this.menu[0].applyCSS('',{'':{'width':'30vmax','height':'56.25vmax'}});
        this.menu[0].applyCSS('>*','centerCenter');
        this.menu[0].addClassName('fontHead','scrollY');
        this.menu[1].addClassName('listClose','fontNormal');
        this.menu[1].applyCSS('>*>*>*','onhover');
        this.menu[1].applyCSS('',{
            '':{'width':'60vmax','height':'56.25vmax'},
            '>*':{'width':'60vmax','height':'56.25vmax'},
            '>*>*':{'height':'56.25vmax'},
        });
        this.menuDict = Object.assign({SL: new RealElement({self: this.menu[1].proto.list[1]})},this.menu[1].getIdDict(true));
        console.log(this.menuDict.SL.self);
        this.menuDict.gameGuide.self.firstElementChild.textContent = `
                        游戏说明
操作方法：
    一、菜单面板
        （一）DEMO：游戏标题，点击可以打开游戏说明
        （二）打开存档：共计21个存档位，存档0为自动存档
        （三）人物面板：（未完成）
        （四）成就：（未完成）
        （五）设置：可以通过上下滑动红蓝条调节音量和语速，预留难度位（未完成），只有点击“应用”后才能保存设置
        （六）导入存档：导入一个特定的JSON文件作为存档
        （七）导出存档：导出一个特定的JSON文件用来转移存档
        （八）重置游戏：清理游戏的浏览器缓存并重启游戏
    二、游玩界面
        （一）键位
         1. W-S-A-D 上下左右移动
         2. Q 显示-隐藏对话消息框（对话期间无法移动）
         3. C 显示-隐藏立绘（没上好图...）
         4. 空格 在看视频时可以开启-关闭进度条（实验中）
         5. Ctrl 弹出菜单
        （二）鼠标
            点击地图可以无视限制移动，但无法触发任何事件
        （三）内容
            听歌、看片（正经）、看动画
            用 W-S-A-D 移动到左上角可以触发事件（实验中）
            丁真有碰撞体积
        `;
        this.menuDict.gameGuide.applyCSS('',{'>*':{'width':'60vmax','white-space':'pre-wrap'}});
        this.menuDict.gameGuide.addClassName('scrollY');
        this.menuDict.SL.addClassName('listRightListDown');
        this.gameSL = new RealDivList('gameSL',false,[...new Array(21).keys()]);
        (this.gameInfoSL = new RealDivList('gameInfoSL',true,[
            '<div>读取</div><div>写入</div><div>删除</div>',
            '<pre></pre>',
        ])).addClassName('listDownListRight');
        this.gallery = new RealImgList('gameGallery').addClassName('listDown');
        (this.config = new RealDivList('gameConfig',true,[
            '<div>应用</div><div>重置</div>',
            '<div>总音量</div><div><div></div></div>',
            '<div>背景音乐</div><div><div></div></div>',
            '<div>音效</div><div><div></div></div>',
            '<div>对话</div><div><div></div></div>',
            '<div>语速</div><div><div></div></div>',
            '<div>时间流速</div><div><div></div></div>',
            '<div>难度</div><div><div></div></div>',
        ])).addClassName('listRightListDown');
        // gameTip
        (this.tip = new RealDivList('gameTip',true)).addClassName('listDownListRight');
        // prompt
        (this.prompt = new RealDivList('gamePrompt',true,[
            '<pre></pre>',
            '<textarea placeholder="此处输入"></textarea>',
            '<div>取消</div><div>确认</div>',
        ])).addClassName('listDownListRight');
        this.border = new RealDivList('gameBorder',false,(this.borderCTR = [
            new RealDivList('',true,[
                '<div>C<br>T<br>R</div>',
                '<div>Q</div><div>A</div><div>Z</div>',
                '<div>W</div><div>S</div><div>X</div>',
                '<div>E</div><div>D</div><div>C</div>',
            ]),
            new RealDivList('',true,[
                '<div>Q</div><div>A</div><div>Z</div>',
                '<div>W</div><div>S</div><div>X</div>',
                '<div>E</div><div>D</div><div>C</div>',
                '<div>C<br>T<br>R</div>',
            ]),
        ]).map(RN=>RN.self),false);
        /**@type {RealElement[]} */
        this.borderList = this.border.value.map(element=>new RealElement({self: element}));
        this.border.addClassName('listRight');
        this.border.applyCSS('>*>*>*>*','onhover');
        this.border.applyCSS('>*>*>*>*','fontHead');
        this.border.applyCSS('>*>*>*>*','centerCenter');
        this.border.applyCSS('>*>*>*>*','relativeSquare');
        this.border.applyCSS('>*>*',{'':{'background-color':'black','opacity':'0.5'}});
        this.borderCTR[0].addClassName('listRightListDown');
        this.borderCTR[0].applyCSS('>:nth-child(1)',{'>*':{'height':'60vmin'}});
        this.borderList[0].applyCSS('',{'':{'transform':'translate3d(0px,40vmin,0px)'}});
        this.borderCTR[1].addClassName('listRightListDown');
        this.borderCTR[1].applyCSS('>:nth-last-child(1)',{'>*':{'height':'60vmin'}});
        this.borderList[1].applyCSS('',{'':{'transform':'translate3d(calc(100vmax - 160vmin),40vmin,0px)'}});

        this.self.removeClassName('noDisplay');
    };
    /**
     * @type {protoGM}
     */
    static instance;
    static Map_list = class Map_list extends Map{
        /**
         * 
         * @param {(value,key,map)=>void} callback 
         * @param  {...} param 
         */
        constructor(list,callback,...param){
            super(...param);
            this.list = list;
            typeof callback === 'function' && this.forEach(callback,this.list);
        }
    };
    // .promiseArray 承诺数组
    // .makePromise() 在该脚本执行完后进行补丁操作
    // .setGameInterval() 设置游戏循环计时器的ID
    // .bgs() 一次性地使用游戏音效
    /**
     * makePromise() 作出承诺
     * @param {()=>*} fn 
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
    promiseArray = [];
    get realWorld(){return protoGM.realWorld;}
    // .isgameTipping 布尔值，表示游戏提示元素是否显现，请勿修改！
    static isgameTipping = false;
    // .gameTip 游戏提示
    // .gameTip.tipFn() 开关游戏提示
    gameTip = new class GameTip{
        static self = new RealDivList('gameTip');
        get self(){return GameTip.self.self;}
        get node(){return GameTip.self;}
        tipFn(mouseEvent,isTip = true){
            var x,y,temp;
            isTip ? (
                x = (temp = mouseEvent.clientX) * 2 < (x = getWindowWidth()) ? temp + 32 : temp - 32 - x / 5,
                y = (temp = mouseEvent.clientY) * 2 < (y = getWindowHeight()) ? temp + 18 : temp - 18 - this.self.scrollHeight,
                this.self.style.translate = x+'px '+y+'px 0px',
                protoGM.isgameTipping ||= (this.self.classList.remove('disappear'),true)
            ) : protoGM.isgameTipping &&= (this.self.classList.add('disappear'),false);
        }
    };
    static Process = class Process{
        paused = false;
        intervalID;
        timeSep;
        onEvent;
        nowFn;
        gameIntervalFn(){
            this.onEvent?.();this.nowFn = typeof this.nowFn === 'function' ? this.nowFn() : void this.defaultFn?.();
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
            typeof temp[exMode] === 'function' ? (
                temp.timeSep = timeSep,Number === temp.intervalID?.constructor && clearInterval(temp.intervalID),
                temp.intervalID = setInterval(()=>temp[exMode](),timeSep),console.log(type,timeSep)
            ) : errorThrow(new Error('=> Wrong exMode when setGameInterval "'+String(type)+'" !'))
        ),temp;
    }
    /**
     * 
     * @param {(String | Symbol)[]} keyList 
     * @param {{[text: String]: String,length: Number}} temp 
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
    processArray = {};
}));