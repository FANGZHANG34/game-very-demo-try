'use strict';
GM = GM.then(protoGM=>class GM extends protoGM{
    constructor(){
        super(...arguments);
        this.constTemp.tempImageArray.set('tempCanvas',this.constTemp.tempCanvas);
        this.setGameInterval('autoSL',3e5).onEvent = ()=>{
            this.gameMap.mapID && localStorage.setItem('saveDataArray',LZString.compress(JSON.stringify(this.gameFileSL.origin)));
        };
        this.setGameInterval('globalProcess',66);
        this.setGameInterval('dialogueProcess',100);
        this.setGameInterval('tempProcess',100);
        Object.assign(this.setGameInterval('playerMove',34,2),{
            paused: true,moveD: 0,step: 0,
            async stepFn(){return clearCanvas(protoGM.instance.gamePlayer.display).drawImage(
                await getImage(memoryHandle('characterArray.'+protoGM.instance.gamePlayer.id+'.display')),
                -this.step * 120, -protoGM.instance.gamePlayer.moveD * 120
            ),this.step > 0 && (this.step--, true);},
            defaultFn(){
                var temp,i;
                const moveD = GM.constTemp.moveDiraction,gamePlayer = protoGM.instance.gamePlayer;
                if(null !== gamePlayer.id && moveD._){
                    const previous = gamePlayer.xyz.concat();
                    for(gamePlayer.moveD = 0;gamePlayer.moveD < 4;gamePlayer.moveD++){
                        if(null !== (
                            moveD._ === (temp = moveD['sawd'[gamePlayer.moveD]])[2] ? temp[0] ?
                            previous[i = 0] = Math.min(Math.max(0,gamePlayer.xyz[0] + temp[0]),GM.limitWidth) :
                            previous[i = 1] = Math.min(Math.max(0,gamePlayer.xyz[1] + temp[1]),GM.limitHeight) : null
                        )){break;}
                    }
                    previous[i] !== gamePlayer.xyz[i] && protoGM.instance.gameMap.onDirectionEvent(previous) &&
                    (!protoGM.instance.gameMap.board.zone || protoGM.instance.gameMap.board.zone[previous[1]][previous[0]]) ? (
                        this.promise = gamePlayer.loader(gamePlayer.id,previous,true).
                        then(()=>protoGM.instance.gameMap.onPointEvent(previous)).catch(errorThrow),
                        this.step = 3
                    ) : this.stepFn();
                }
            }
        });
        this.gameBody.menu.board.openGame = {self: this.gameFileSL.self};
        this.gameBody.menu.board.config.loader();
        // 交互设置
        // document.onmousemove = e=>{const gameTip = this.gameBody.gameTip;gameTip.tipFn(e,false);};
        const constArray = {
            menuBoardChildren: this.gameBody.menu.board.self.children,
            mouseenter: [['loadSL','saveSL','deleteSL','saveConfig','resetConfig'],['option','SL','messageDialogue','messageChoice']],
            /**
             * .configScroll() scroll2set
             * @param {MouseEvent} e 
             */
            configScroll(e){
                const configStage = e.target.previousElementSibling;
                switch(e.target.parentElement.id){
                    case 'textSep': configStage.textContent = (10 ** (1 - e.target.scrollTop / 1000)).toFixed(1);break;
                    case 'modeHard': configStage.textContent = 10 - ~~(e.target.scrollTop / 100);break;
                    case 'worldSpeed': configStage.textContent = ~~(6 - e.target.scrollTop / 200);break;
                    default: configStage.textContent = 100 - ~~(e.target.scrollTop / 10);
                }
            }
        };
        document.addEventListener('scroll',e=>{
            // scroll2view
            const limit = getWindowWidth() * .5625 - getWindowHeight();
            limit < document.documentElement.scrollTop && window.scrollTo(0,limit);
        },true);
        document.addEventListener('click',async e=>{
            // 一维click2move
            var temp = e.target;
            'messageVideo' === temp.id || (this.clickAudio.currentTime = 0,this.clickAudio.play());
            switch(temp.id){
                case 'messageImage': ;break;
                case 'messageVideo': ;break;
                case 'messageNext': this.gameMessage.closer();break;
                case 'messageAuto':{
                    let previousTextLength = -1,nowTextLength;
                    const nowText = this.gameMessage.content.text,
                    autoDialogue = this.processArray.dialogueProcess.nowFn = ()=>(
                        nowTextLength = nowText.textContent.length,
                        !this.gameMessage.self.classList.contains('disappear') &&
                        !this.gameMessage.option.dialogue.classList.contains('disappear') ?
                        previousTextLength === nowTextLength ? (previousTextLength = -1,this.gameMessage.closer(),autoDialogue)
                        : (previousTextLength = nowTextLength,autoDialogue) : null
                    )
                    break;
                }
                case 'messageSkip':{
                    const skipDialogue = this.processArray.dialogueProcess.nowFn = ()=>(
                        !this.gameMessage.self.classList.contains('disappear') &&
                        !this.gameMessage.option.dialogue.classList.contains('disappear') &&
                        (this.gameMessage.closer(),skipDialogue)
                    );
                    break;
                }
                case 'messageNormal': this.processArray.dialogueProcess.nowFn = null;break;
                case 'loadSL': this.gameInfoSL.loader();break;
                case 'saveSL': '0' !== this.gameInfoSL.index ? this.gameInfoSL.saver() :
                    this.gameBody.gamePrompt.loader('自动存档不支持写入！');break;
                case 'deleteSL': '0' !== this.gameInfoSL.index ? this.gameInfoSL.deleter() :
                    this.gameBody.gamePrompt.loader('自动存档不支持删除！');break;
                case 'config':{
                    for(let i of Object.keys(this.configArray.globalArray)){
                        temp = [this.configArray.globalArray[i],this.gameBody.menu.board.config[i],null];
                        temp[2] = temp[1].nextElementSibling;
                        switch(i){
                            case 'textSep': temp[1].textContent = 100 / temp[0];temp[2].scrollTop = (Math.log10(temp[0]) - 1) * 1000;break;
                            case 'modeHard': temp[1].textContent = temp[0];temp[2].scrollTop = (10 - temp[0]) * 100;break;
                            case 'worldSpeed': temp[1].textContent = temp[0] / 30;temp[2].scrollTop = (6 - temp[0] / 30) * 200;break;
                            default: temp[1].textContent = temp[0] * 100;temp[2].scrollTop = (1 - temp[0]) * 1000;
                        }
                    }
                    for(let i of constArray.menuBoardChildren){i.classList.add('disappear');}
                    this.gameBody.menu.board.config.self.classList.remove('disappear');
                    break;
                }
                case 'saveConfig':{
                    for(let i of Object.keys(this.configArray.globalArray)){
                        temp = this.gameBody.menu.board.config[i];
                        switch(i){
                            case 'textSep': this.configArray.globalArray[i] = 100 / +temp.textContent;break;
                            case 'modeHard': this.configArray.globalArray[i] = +temp.textContent;break;
                            case 'worldSpeed': this.configArray.globalArray[i] = +temp.textContent * 30;break;
                            default: this.configArray.globalArray[i] = +temp.textContent / 100;
                        }
                    }
                    this.gameBody.menu.board.config.loader();
                    localStorage.setItem('configArray',LZString.compress(JSON.stringify(this.configArray)));
                    this.gameBody.gamePrompt.loader('设置保存成功！');config.click();
                    break;
                }
                case 'resetConfig':{
                    // const resetArrray = [.25,.25,.25,1,100,1,0],keyArray = Object.keys(this.configArray.globalArray);
                    // for(var i = keyArray.length - 1;i > -1;i--){
                    //     temp = [resetArrray[i],this.gameBody.menu.board.config[keyArray[i]],null];
                    //     temp[2] = temp[1].nextElementSibling;
                    //     switch(keyArray[i]){
                    //         case 'textSep': temp[1].textContent = 100 / temp[0];temp[2].scrollTop = (Math.log10(temp[0]) - 1) * 1000;break;
                    //         case 'modeHard': temp[1].textContent = temp[0];temp[2].scrollTop = (10 - temp[0]) * 100;break;
                    //         case 'worldSpeed': temp[1].textContent = temp[0] / 30;temp[2].scrollTop = (6 - temp[0] / 30) * 200;break;
                    //         default: temp[1].textContent = temp[0] * 100;temp[2].scrollTop = (1 - temp[0]) * 1000;
                    //     }
                    // }
                    // this.gameBody.menu.board.config.loader();
                    temp = this.gameBody.menu.board.config,Object.keys(this.configArray.globalArray).forEach(function(key,i){
                        const temp0 = this[i],temp1 = temp[key].nextElementSibling;
                        switch(key){
                            case 'textSep': temp1.scrollTop = (Math.log10(temp0) - 1) * 1000;break;
                            case 'modeHard': temp1.scrollTop = (10 - temp0) * 100;break;
                            case 'worldSpeed': temp1.scrollTop = (6 - temp0 / 30) * 200;break;
                            default: temp1.scrollTop = (1 - temp0) * 1000;
                        }
                    },[.25,.5,.25,.75,100,30,0]),temp.loader();
                    break;
                }
                default:{
                    // 二维click2move
                    var temp = e.target;
                    switch(temp.parentElement?.id){
                        case 'SL':{
                            this.gameInfoSL.temp = this.gameFileSL.origin[this.gameInfoSL.index = temp.textContent.at(-1)];
                            Array.prototype.forEach.call(this.gameFileSL.array,x=>x.classList.remove('focus'));
                            temp.classList.add('focus');
                            this.gameInfoSL.shower();
                            break;
                        }
                        case 'option':{
                            console.log(temp.id);
                            for(let i of constArray.menuBoardChildren){i.classList.add('disappear');}
                            switch(temp = temp.id){
                                case 'importGame': this.gameFileSL.importFileSL();break;
                                case 'exportGame':{
                                    const link = document.createElement('a');
                                    this.gameBody.gamePrompt.loader('即将下载json存档文件！\n是否继续？').then(()=>(
                                        link.href = window.URL.
                                        createObjectURL(new Blob([JSON.stringify(this.gameFileSL.origin,null,'\t')],{type: 'application/json'})),
                                        link.download = 'save.json',
                                        link.click()
                                    )).finally(()=>window.URL.revokeObjectURL(link.href));
                                    break;
                                }
                                case 'resetGame': this.gameBody.gamePrompt.loader('即将删除浏览器内的存档！\n是否继续？').
                                then(()=>(clearFileSL(),this.gameBody.gamePrompt.loader('删除成功！\n是否重启游戏？'))).
                                then(()=>location.reload(),()=>window.close());break;
                                case 'title': if(await this.gameBody.gamePrompt.loader('是否显示操作说明？').then(()=>false,()=>true)){break;}
                                default:{
                                    (temp = this.gameBody.menu.board[temp]).loader?.(),temp.self.classList.remove('disappear');
                                }
                            }
                            break;
                        }
                        case 'characterList': this.gameBody.menu.board.characterGame.checker(temp);break;
                        default:{
                            // 三维click2move
                            var temp = e.target;
                            switch(temp.parentElement?.parentElement?.id){
                                case 'gameMapBoard':{
                                    const previous = [
                                        (temp = this.gameMap.board.array.indexOf(temp)) % GM.mapWidth,
                                        ~~(temp / GM.mapWidth),
                                        this.gamePlayer.xyz[2]
                                    ];
                                    (!this.gameMap.board.zone || this.gameMap.board.zone[previous[1]][previous[0]])
                                    && this.gamePlayer.loader(this.gamePlayer.id,previous).then(()=>this.gamePlayer.focus());
                                    break;
                                }
                                case 'gamePrompt': this.gameBody.gamePrompt.checker(temp);break;
                                default: console.log(e.target.tagName+'#'+e.target.id);
                            }
                        }
                    }
                }
            }
        },true);
        document.addEventListener('mouseenter',e=>void(
            // hoverAudio
            (constArray.mouseenter[0].includes(e.target.id) || constArray.mouseenter[1].includes(e.target.parentElement?.id)) &&
            (this.hoverAudio.currentTime = 0,this.hoverAudio.play())
        ),true);

        document.addEventListener('keydown',e=>{
            // key2move
            if(this.gameBody.menu.self.classList.contains('disappear')){
                const moveD = this.constTemp.moveDiraction,key = e.key.toLowerCase();
                'sawd'.includes(key) && (moveD[key][2] ||= --moveD._);
            }
        },true);
        document.addEventListener('keyup',e=>{
            // stop&sth.
            const moveD = this.constTemp.moveDiraction,temp = e.key.toLowerCase(),gamePrompt = this.gameBody.gamePrompt;
            moveD[temp] && (moveD[temp][2] = 0,moveD._ = Math.min(moveD.a[2],moveD.s[2],moveD.d[2],moveD.w[2]));
            if(!gamePrompt.zone.classList.contains('disappear') && document.activeElement !== gamePrompt.resolveContent) gamePrompt.checker(
                'enter' === temp ? gamePrompt.resolveBtn : 'control' === temp ? gamePrompt.rejectBtn : {}
            ); else switch(temp){
                case 'c': this.gamePlayer.photo.self.classList.toggle('disappear');break;
                case 'q': this.gameMessage.self.classList.toggle('disappear');break;
                case 'control': this.gameMap.mapID && this.gameBody.menu.self.classList.toggle('disappear');break;
            }
        },true);
        for(let element of document.querySelectorAll('.scrollDiv')){element.onscroll = constArray.configScroll;}
        this.gameBody.self.animate([{marginLeft: '0',marginTop: '0'}],this.constTemp.moveConfig);
    }
    // gamePlayer 游戏主角
    // .id 主角编号
    // .display 显现元素<canvas>
    // .xyz 主角方位
    // photo 立绘
    // .loader() 加载主角方位
    // .focus() 聚焦主角方位
    static Character = class Character{
        constructor(isPlayer = false){
            this.self = isPlayer ? document.getElementById('player') : Character.tempNode.cloneNode(true);
            this.display = this.self.firstChild;
        }
        static photo = new class{
            self = document.getElementById('playerPhoto');
            loader(imageUrl){getImage(imageUrl).then(value=>clearCanvas(this.self).drawImage(value,0,0));}
        };
        /**
         * @type {HTMLDivElement}
         */
        static tempNode = '<div class="mapObject"><canvas width="120" height="120"></canvas></div>'.toDom();
        id;
        xyz = [];
        moveD = 0;
        /**
         * 
         * @param {Number} id 
         * @param {Number[] | undefined} xyz 
         * @returns {Promise<undefined>}
         */
        loader(id,xyz,isFocus = false){
            const moveKeyframes = GM.constTemp.moveKeyframes,appear = id !== this.id;
            (xyz ??= this.xyz)?.length && (
                [this.xyz[0],this.xyz[1],this.xyz[2]] = xyz,
                (!this.self.style.zIndex || xyz[2] !== +this.self.style.zIndex) && (this.self.style.zIndex = String(xyz[2])),
                moveKeyframes[0].translate = `${xyz[0] * GM.singleStepLength}px ${xyz[1] * GM.singleStepLength}px 0px`
            ),appear && (
                this.id = id,this.display = this.self.firstChild,moveKeyframes[1] = Object.assign({},moveKeyframes[0]),
                getImage(memoryHandle('characterArray.'+id+'.display')).then(value=>(
                    value ? clearCanvas(this.display).drawImage(value,0,0) : console.error('=> Wrong character display: '+id)
                ))
            ),this === protoGM.instance.gamePlayer && (
                protoGM.instance.gameFileSL.origin[0].id = id,
                Character.photo.loader(memoryHandle('characterArray.'+id+'.photo')),
                xyz?.length && protoGM.instance.gameMap.board.loader(memoryHandle('mapDataArray.'+protoGM.instance.gameMap.mapID+'.zoneArray')[xyz[2]])
            ),isFocus && this.focus();
            return this.self.animate(moveKeyframes.reverse(),GM.constTemp.moveConfig).finished;
        }
        focus(){
            const windowWidth = getWindowWidth(),windowHeight = windowWidth * 9 / 16;
            const gameBodyKeyframes = GM.constTemp.gameBodyKeyframes;
            gameBodyKeyframes[0].translate = -Math.min(
                Math.max(0,GM.singleStepLength * this.xyz[0] - (windowWidth - GM.singleStepLength) / 2),GM.mapRealWidth - windowWidth
            )+'px '+ -Math.min(
                Math.max(0,GM.singleStepLength * this.xyz[1] - (windowHeight - GM.singleStepLength) / 2),GM.mapRealHeight - windowHeight
            )+'px 0px';
            protoGM.instance.gameBody.self.animate(gameBodyKeyframes.reverse(),GM.constTemp.moveConfig);
        }
    };
    // .setWorldSpeed() 设置世界时间流速
    setWorldSpeed(num = 30){
        this.constTemp.moveConfig.duration = ~~(4000 / num);
        this.setGameInterval('playerMove',~~(1000 / num) + 1,2);
    }
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
    static singleStepLength = 60;
    static mapWidth = 32;
    static mapHeight = 18;
    static limitWidth = GM.mapWidth - 1;
    static limitHeight = GM.mapHeight - 1;
    static mapRealWidth = GM.mapWidth * GM.singleStepLength;
    static mapRealHeight = GM.mapHeight * GM.singleStepLength;

    get configArray(){return GM.configArray;}
    get singleStepLength(){return GM.singleStepLength;}
    get mapWidth(){return GM.mapWidth;}
    get mapHeight(){return GM.mapHeight;}
    get limitWidth(){return GM.mapWidth - 1;}
    get limitHeight(){return GM.mapHeight - 1;}
    get mapRealWidth(){return GM.mapWidth * GM.singleStepLength;}
    get mapRealHeight(){return GM.mapHeight * GM.singleStepLength;}
    // GM 游戏元素管理员，其属性包含了所有游戏元素
    // 大多数游戏元素都有self属性以指向其本体HTMLElement

    // GM 游戏管理者，游戏基框架的集合对象
    // .isgameTipping 布尔值，表示游戏提示元素是否显现，请勿修改！
    // .promiseArray 承诺数组
    // .constTemp 游戏常量对象集合
    // .hoverAudio 鼠标移动至选项而使用的音频元素
    // .clickAudio 鼠标点击而使用的音频元素
    // .makePromise() 在该脚本执行完后进行补丁操作
    // .setGameInterval() 设置游戏循环计时器的ID
    // .bgs() 一次性地使用游戏音效
    isgameTipping = false;
    static constTemp = new class{
        memory;
        tempCanvas = makeElement('canvas',{width: 1920,height: 1080});
        tempImageArray = new Map;
        tempAudioArray = new Map;
        moveDiraction = {_: 0,s: [0,1,0],a: [-1,0,0],w: [0,-1,0],d: [1,0,0]};
        moveKeyframes = [{},{}];
        gameBodyKeyframes = [{},{}];
        moveConfig = {duration: 133,fill: 'forwards'};
    };
    get constTemp(){return GM.constTemp;}
    hoverAudio = new Audio('./audio/1.ogg');
    clickAudio = new Audio('./audio/Cancel2.ogg');
    bgm = new class BGM{
        // bgm 背景音乐
        // .report() 报告音频
        // .next() 切换音频
        static self = Object.assign(new Audio(),{
            oncanplay(){
                const bgm = protoGM.instance.bgm;
                bgm.resolve?.(),bgm.onload.then(()=>this.play().finally(()=>bgm.onload = resolveVoid));
            },onplay: ()=>protoGM.instance.bgm.report(),onended: ()=>protoGM.instance.bgm.next()
        });
        get self(){return BGM.self;}
        index = 0;
        onload = resolveVoid;
        tempSrc;
        resolve;
        loader(audioUrl,mode = false){
            this.onload = this.onload.then(()=>new Promise(resolve=>callBack(()=>(this.resolve = resolve,this.setSrc(audioUrl,mode)))))
            // this.self.paused && this.self.play().catch(e=>{console.error(e),this.next();});
        }
        setSrc(audioUrl,mode){
            audioUrl === this.tempSrc ? mode && (this.self.currentTime = 0,this.self.play()) :
            typeof audioUrl[Symbol.iterator] === 'function' ? (this.tempSrc = audioUrl,this.self.src = './audio/'+this.tempSrc[this.index = 0]) :
            (this.self.src = './audio/'+(this.tempSrc = audioUrl))
        }
        report(){console.log(this.tempSrc?.[this.index] ?? this.tempSrc);}
        next(){
            Promise.resolve(
                typeof this.tempSrc[Symbol.iterator] === 'function'
                ? this.self.src = './audio/'+this.tempSrc[this.index = (this.index + 1) % this.tempSrc.length]
                : this.self.currentTime = 0,this.self.play()
            ).catch(e=>{console.error(e),this.index + 1 < this.tempSrc.length && this.ended();});
        }
    };
    bgs = (onended=>
        /**
         * bgs() 产生音效
         * @param {String} audioUrl 
         * @returns {Promise<void | false>}
         */
        audioUrl=>getAudio(audioUrl).then(value=>value && (
            value.volume = GM.configArray.globalArray.globalVolume * GM.configArray.globalArray.bgs,
            value.currentTime = 0,value.onended = onended,value
        ).play())
    )(function(){clearMedia(this);});

    // *.self *的本体元素
    // *.style *的当前样式

    // gameBody 游戏大元素集合
    // .menu 菜单元素
    // .gameTip 游戏提示
    // .menuBoard 选项对应面板对象
    // .gameTip.tipFn() 开关游戏提示
    gameBody = new class GameBody{
        static self = document.getElementById('gameBody');
        get self(){return GameBody.self;}
        menu = {
            self: document.getElementById('menu'),
            board: {
                self: document.getElementById('menuBoard'),
                title: {self: document.getElementById('guide')},
                characterGame: new class{
                    self = document.getElementById('characterBoard');
                    list = new RealElement({
                        self: document.getElementById('characterList'),
                        key: 'innerHTML',
                        initValue: [],
                        transform(value){
                            return value?.[Symbol.iterator] ? value.reduce(
                                (temp,id)=>(temp.push('<div>',memoryHandle('characterArray.'+id+'.name'),'</div>'),temp),[]
                                // ['<div>',memoryHandle('characterArray.'+protoGM.instance.gamePlayer.id+'.name'),'</div>']
                            ).join('') : '';
                        }
                    },{
                        set(value){
                            const temp = this.value,playerID = protoGM.instance.gamePlayer.id;
                            value = !value?.[Symbol.iterator] ? [playerID] : [playerID,...value];
                            return (temp.length !== value.length || !compareArray(temp,value,value.length)) &&
                            (this.proto.value = Array.from(value));
                        }
                    });
                    info = new RealElement({self: document.getElementById('characterInfo'),key: 'innerHTML'},{react(){this.set('');}});
                    itemBoard = document.getElementById('itemBoard');
                    photo = document.getElementById('characterPhoto');
                    partner;
                    nowCharacterID;
                    loader(){
                        if(!GM.constTemp.memory) return;
                        this.nowCharacterID = null;
                        this.list.value = this.partner = protoGM.instance.gameFileSL.origin[0].partner;
                    }
                    /**
                     * 
                     * @param {HTMLElement} element 
                     */
                    checker(element){
                        const characterID = GM.characterArray.list.indexOf(element.textContent),index = this.partner.indexOf(characterID);
                        characterID === protoGM.instance.gamePlayer.id ? this.shower(characterID) :
                        characterID === this.nowCharacterID ? this.changer(index) :
                        index < 0 || this.shower(characterID);
                    }
                    shower(characterID){
                        getImage(memoryHandle('characterArray.'+(this.nowCharacterID = characterID)+'.photo')).
                        then(value=>value && clearCanvas(this.photo).drawImage(value,0,0));
                    }
                    changer(index){this.partner[index] = protoGM.instance.gamePlayer.id,protoGM.instance.gamePlayer.loader(this.nowCharacterID),this.loader();}
                },
                gallery: {self: document.getElementById('myGallery')},
                config: new class{
                    constructor(){
                        for(var element of Array.from(this.self.children).slice(1)){this[element.id] = element.children[1];}
                    }
                    self = document.getElementById('myConfig');
                    loader(){
                        this.applyVolume(),
                        protoGM.instance.setWorldSpeed(GM.configArray.globalArray.worldSpeed);
                    }
                    applyVolume(){
                        protoGM.instance.gameMessage.content.video.volume = protoGM.instance.gameMessage.content.audio.volume =
                        GM.configArray.globalArray.globalVolume * GM.configArray.globalArray.dialogue,
                        protoGM.instance.bgm.self.volume = GM.configArray.globalArray.globalVolume * GM.configArray.globalArray.bgm,
                        protoGM.instance.hoverAudio.volume = protoGM.instance.clickAudio.volume =
                        GM.configArray.globalArray.globalVolume * GM.configArray.globalArray.bgs;
                    }
                }
            }
        };
        gameTip = new class GameTip{
            static self = document.getElementById('gameTip');
            get self(){return GameTip.self;}
            tipFn(mouseEvent,isTip = true){
                var x,y,temp;
                isTip ? (
                    x = (temp = mouseEvent.clientX) * 2 < (x = getWindowWidth()) ? temp + 32 : temp - 32 - x / 5,
                    y = (temp = mouseEvent.clientY) * 2 < (y = getWindowHeight()) ? temp + 18 : temp - 18 - this.self.scrollHeight,
                    this.self.style.translate = x+'px '+y+'px 0px',
                    GM.isgameTipping ||= (this.self.classList.remove('disappear'),true)
                ) : GM.isgameTipping &&= (this.self.classList.add('disappear'),false);
            }
        };
        gamePrompt = new class GamePrompt{
            constructor(){this.loader('是否开始游戏？').then(()=>console.clear(),()=>window.close());}
            zone = document.getElementById('gamePrompt');
            self = this.zone.firstElementChild;
            message = this.self.querySelector('pre');
            resolveContent = this.self.querySelector('textarea');
            resolveBtn = this.self.querySelector('button[name="confirm"]');
            rejectBtn = this.self.querySelector('button[name="cancel"]');
            resolve;
            reject;
            /**
             * 
             * @param {String} message 
             * @returns {Promise<String>}
             */
            loader(message){return new Promise((resolve,reject)=>(
                this.resolve = ()=>this.resolve = this.reject = resolve(this.resolveContent.value),
                this.reject = ()=>this.resolve = this.reject = reject(message),
                this.message.textContent = message,this.zone.classList.remove('disappear')
            ));}
            checker(element){
                if('button' === element.type){
                    switch(element){
                        case this.resolveBtn: element = this.resolve();break;
                        case this.rejectBtn: element = this.reject();break;
                    }
                }
                element ?? this.closer();
            }
            closer(){this.zone.classList.add('disappear'),this.message.textContent = this.resolveContent.value = '';}
        }
    };
    // gameMap 游戏地图
    // .mapConcat 地图元素集合
    // .loader() 加载地图
    // .onDirectionEvent() 检测某位置的前进方向是否触发什么事件
    // .onPointEvent() 检测某位置触发什么事件
    gameMap = new class{
        constructor(){
            for(let i of this.mapConcat){Object.assign(i,this.size).style.zIndex = i.id[3];}
            this.board.self.style.width = this.mapConcat[0].width+'px';
            var temp = ['<div></div>'];
            while(GM.mapWidth > temp.length){temp.push(temp[0]);}
            temp = ['<div>'+temp.join('')+'</div>'];
            while(GM.mapHeight > temp.length){temp.push(temp[0]);}
            this.board.self.innerHTML = temp.join('');
            this.board.self.classList.remove('disappear');
            this.board.array = Array.from(document.querySelectorAll('#gameMapBoard>div>div'));
        }
        mapID;
        size = {width: GM.singleStepLength * GM.mapWidth,height: GM.singleStepLength * GM.mapHeight};
        mapConcat = Array.from(document.getElementsByClassName('mapImg'));
        loader(mapID){
            const viewArray = memoryHandle('mapDataArray.'+(protoGM.instance.gameFileSL.origin[0].mapID = this.mapID = mapID)+'.viewArray');
            for(let i = 4;i --> 0;){
                const mapCtx = clearCanvas(this.mapConcat[i]);
                for(const [imgUrl,x0,y0,wLong,hLong] of viewArray[i]){
                    getImage('./img/map/'+imgUrl).then(value=>{
                        const imgX0 = x0 * GM.singleStepLength,imgY0 = y0 * GM.singleStepLength;
                        if(value){for(let w = wLong ?? 1;w --> 0;){
                            const imgRealX = imgX0 + w * GM.singleStepLength;
                            for(let h = hLong ?? 1;h --> 0;){
                                mapCtx.drawImage(value,imgRealX,imgY0 + h * GM.singleStepLength);
                            }
                        }}else{console.error('=> Wrong map imgUrl: '+imgUrl);}
                    });
                }
            }
            this.objectManager.characterLoader(memoryHandle('mapDataArray.'+mapID+'.characterArray'));
            protoGM.instance.processArray.globalProcess.nowFn = GM.eventArray.get(memoryHandle('mapDataArray.'+mapID+'.nowFn'))?.[1];
        }
        /**
         * 
         * @param {Array} xyz 
         * @returns {String}
         */
        onDirectionEvent(xyz){
            nodeArrayLoop: for(var nodeCharacter of this.objectManager.nodeArray){
                var temp = nodeCharacter.xyz,i;
                for(i = 0;i < 3;i++){if(temp[i] !== xyz[i]){continue nodeArrayLoop;}}
                GM.eventArray.get(memoryHandle('characterArray.'+(temp = nodeCharacter.id)+'.selfEvent') || '0')[1](temp);
                getImage(memoryHandle('characterArray.'+temp+'.display')).then(value=>(
                    clearCanvas(nodeCharacter.display).drawImage(value,0,-(nodeCharacter.moveD = (protoGM.instance.gamePlayer.moveD + 2) % 4) * 120)
                ));
                return memoryHandle('characterArray.'+temp+'.zone');
            };
            return true;
        }
        /**
         * 
         * @param {Array} xyz 
         * @returns {Boolean}
         */
        onPointEvent(xyz){
            mapEventLoop: for(var eventInfo of memoryHandle('mapDataArray.'+this.mapID+'.eventArray')){
                for(var i = 0;i < 3;i++){if(eventInfo[i] !== xyz[i] && null !== eventInfo[i]){continue mapEventLoop;}}
                GM.eventArray.get(eventInfo[3])[1]();
                return true;
            }
            return false;
        }
        // mapBoard 地图面板
        // .zone 地图通行区域
        // .array 单位区块子元素集合
        // .loader() 加载地图通行区域
        board = new class{
            self = document.getElementById('gameMapBoard');
            array;
            zone;
            /**
             * 
             * @param {Array} boardZoneArray 
             */
            loader(boardZoneArray){
                this.zone = [];
                for(let i of Object.keys(boardZoneArray)){
                    this.zone[i] = Array.from(boardZoneArray[i].toString(2)).map(i=>+i).reverse();
                    for(let j = GM.mapWidth - 1; j >= 0; j--){this.zone[i][j] = !this.zone[i][j];}
                }
            }
        };
        // mapObjectManager 地图对象管理者，地图上的对象集合
        // .array 地图对象集合
        // .nodeArray 地图对象元素集合
        // .nodeTemp 地图对象元素模板
        // .loader() 加载地图对象
        objectManager = new class{
            nodeArray = [];
            /**
             * 
             * @param {...{}} characterInfoArray 
             */
            characterLoader(characterInfoArray){
                var i,object;for(object of this.nodeArray){i.self.remove();}
                this.nodeArray = [];
                for(object of characterInfoArray){
                    protoGM.instance.gamePlayer.self.
                    insertAdjacentElement('beforebegin',(this.nodeArray[this.nodeArray.length] = i = new GM.Character).self);
                    i.loader(object.id,object.xyz);
                }
            }
        };
    };
    // gamePlayer 游戏主角
    // .id 主角编号
    // .display 显现元素<canvas>
    // .xyz 主角方位
    // photo 立绘
    // .loader() 加载主角方位
    // .focus() 聚焦主角方位
    gamePlayer = new GM.Character(true);
    // gameFileSL 游戏存档
    // .origin 存档管理元素
    // .array 存档元素的子元素集合
    // .importFileSL() 加载存档元素的子元素集合
    gameFileSL = new class{
        constructor(){for(var i of Object.keys(this.origin)){
            this.self.insertAdjacentElement('beforeend',makeElement('div',{textContent: ('0' === i ? '自动存档' : '手动存档')+i}));
        }}
        self = document.getElementById('SL');
        array = this.self.children;
        temp = makeElement('input',{type: 'file',accept: 'application/json',onchange(){
            Object.assign(new FileReader(),{onload(){
                protoGM.instance.gameFileSL.origin = JSON.parse(this.result),localStorage.setItem('saveDataArray',LZString.compress(this.result));
            }}).readAsText(tempFile.files[0]);
        }});
        origin = JSON.parse(LZString.decompress(localStorage.getItem('saveDataArray')));
        importFileSL(){this.temp.click(),this.self.classList.remove('disappear'),protoGM.instance.gameInfoSL.self.classList.add('disappear');}
    };
    // gameInfoSL 当前存档对象
    // .stage 当前存档浏览
    // .temp 当前存档信息
    // .saveDataTemp 用于替代的存档信息
    // .shower() 展示存档
    // .loader() 加载存档
    // .saver() 保存存档
    // .deleter() 删除存档
    gameInfoSL = new class gameInfoSL{
        self = document.getElementById('infoSL');
        stage = document.querySelector('#infoSL>pre');
        index;
        temp;
        static saveDataTemp = {
            mapID: '001',id: 0,xyz: [8,4,0],partner: [],switch: [],record: {},
            memory: {
                itemList: {
                    onceArray: {
                        '气血丹':1,
                        '绷带':1
                    },
                    twiceArray: {
                        '绷带':2
                    },onfitArray: {}
                },
                characterArray: {
                    1: {selfEvent: '4'}
                },mapDataArray: {}
            }
        };
        shower(){
            this.stage.textContent = '0' === this.index ? '（自动更新，只读）\n当前信息：' : '信息：';
            if(this.temp){for(var i of Object.values(this.temp)){this.stage.textContent += '\n'+String(i);}}
            else{this.stage.textContent += '\n'+'NULL'}
            this.self.classList.remove('disappear');
        }
        loader(mode = 1){
            const temp = this.temp || gameInfoSL.saveDataTemp;
            GM.constTemp.memory = (
                protoGM.instance.gameFileSL.origin[0] = Object.assign(copyObj(temp),{xyz: protoGM.instance.gamePlayer.xyz})
            ).memory,protoGM.instance.processArray.playerMove.paused &&= false;
            protoGM.instance.gameMessage.reset();
            protoGM.instance.gamePlayer.id = null,
            protoGM.instance.gameMessage.messageArray = [],
            GM.constTemp.moveKeyframes = [{},{}],
            GM.constTemp.gameBodyKeyframes = [{},{}];
            protoGM.instance.gameMap.loader(temp.mapID);
            protoGM.instance.gamePlayer.loader(temp.id,temp.xyz,true);
            mode && protoGM.instance.gameMap.board.self.classList.add('disappear');
            protoGM.instance.gameBody.menu.self.classList.add('disappear');
        }
        saver(){
            protoGM.instance.gameMap.mapID ? protoGM.instance.gameBody.gamePrompt.loader('确认覆盖存档？').then(()=>(
                this.temp = protoGM.instance.gameFileSL.origin[this.index] = copyObj(protoGM.instance.gameFileSL.origin[0]),
                localStorage.setItem('saveDataArray',LZString.compress(JSON.stringify(protoGM.instance.gameFileSL.origin))),
                this.shower()
            ),()=>protoGM.instance.gameBody.gamePrompt.loader('已取消保存。')) : protoGM.instance.gameBody.gamePrompt.loader('写入失败！\n因为您未开始游玩！');
        }
        deleter(){
            protoGM.instance.gameBody.gamePrompt.loader('确认删除存档？').then(()=>(
                this.temp = protoGM.instance.gameFileSL.origin[this.index] = 0,this.shower(),
                localStorage.setItem('saveDataArray',LZString.compress(JSON.stringify(protoGM.instance.gameFileSL.origin)))
            ),()=>protoGM.instance.gameBody.gamePrompt.loader('已取消操作。'));
        }
    }
    // gameMessage 游戏消息
    // .loader() 加载
    // .*.reset() 重置
    // .*.loader() 加载
    // .closer() 关闭
    gameMessage = new class{
        self = document.getElementById('gameMessage');
        messageArray = [];
        /**
         * 
         * @param {{name: String | undefined,faceUrl: String | undefined}} param0 
         * @param {{text: String | undefined,audioUrl: String | undefined,imageUrl: String | undefined,videoUrl: String | undefined}} param1 
         * @param {{string: any}} choiceArray
         * @param {(() => any) | undefined} finallyFn 
         */
        loader({name,faceUrl} = {},{text,audioUrl,imageUrl,videoUrl} = {},choiceArray = {},finallyFn){
            this.reset(),protoGM.instance.processArray.playerMove.paused ||= true,
            this.content.loader(text,audioUrl,imageUrl,videoUrl),this.sender.loader(name,faceUrl);
            var messageObj,messagePromise = new Promise(resolve=>{
                const nodeArray = this.option.setChoiceArray(choiceArray);
                var i = nodeArray.length;
                messageObj = this.messageArray[this.messageArray.length] = {
                    resolve(){this.isFulfilled || (this.isFulfilled = true,resolve());},
                    promise: messagePromise,finallyFn,isFulfilled: false
                };
                for(;i --> 0;){
                    const onclick = nodeArray[i].onclick;
                    nodeArray[i].onclick = ()=>onclick().then(()=>messageObj.resolve(),errorThrow);
                }
            }).catch(errorThrow);
            messageObj.promise = messagePromise;
            this.self.classList.remove('disappear');
        }
        reset(){this.self.classList.add('disappear'),this.sender.reset(),this.content.reset(),this.option.reset();}
        closer(){
            protoGM.instance.processArray.playerMove.paused &&= false,this.reset();
            if(0 === this.messageArray.length) return console.error('=> Useless closer() !');
            this.messageArray[this.messageArray.length - 1].resolve();
            return this.clearMessageArray();
        }
        async clearMessageArray(){
            while(this.messageArray[this.messageArray.length - 1]?.isFulfilled){await this.simpleClear();}
            console.log(this.messageArray.length);
        }
        simpleClear(){
            const {isFulfilled,finallyFn} = this.messageArray.pop();
            if(!isFulfilled) throw false; else return finallyFn instanceof Function && finallyFn();
        }
        /**
         * 
         * @param {()=>void} finallyFn 
         * @returns {gameMessage}
         */
        changeTailFinallyFn(finallyFn){
            const messageObj = this.messageArray.length ? this.messageArray[this.messageArray.length - 1] :
            this.messageArray[0] = {resolve: null,promise: null,finallyFn: null,isFulfilled: false};
            Object.assign(messageObj,{
                promise: messageObj.promise ?? new Promise(resolve=>{messageObj.resolve = function(){
                    this.isFulfilled || (this.isFulfilled = true,resolve()),
                    console.log(gameMessage.messageArray.indexOf(this));
                }}),finallyFn
            })
            return this;
        }
        /**
         * 
         * @param  {...String} eventArrayKeyList 
         * @returns {Promise}
         */
        loadMessageConcat(...eventArrayKeyList){
            const
            tempLength = this.messageArray.length,
            tempPromise = this.messageArray[this.messageArray.length - 1]?.promise ??
            this.changeTailFinallyFn(GM.eventArray.get(eventArrayKeyList.shift())[1]).messageArray[this.messageArray.length - 1].promise,
            messageConcat = eventArrayKeyList.reduce((tempPromise,eventKey)=>tempPromise.then(
                ()=>new Promise(resolve=>this.changeTailFinallyFn(()=>(GM.eventArray.get(eventKey)[1](),resolve())))
            ),Promise.resolve(tempPromise)).catch(errorThrow);
            return tempLength || this.closer(),messageConcat;
        }
        sender = new class{
            // sender 发送人
            // .name 名字
            // .face 表情
            self = document.getElementById('messageSenderInfo');
            name = document.getElementById('messageSenderName');
            face = Object.assign(document.getElementById('messageSenderStage'),{width: 300,height: 300});
            reset(){this.name.textContent = '',clearCanvas(this.face);}
            /**
             * 
             * @param {String | undefined} name 
             * @param {String | undefined} faceUrl 
             */
            loader(name,faceUrl){
                name && (this.name.textContent = name),getImage(faceUrl).then(value=>(
                    value ? this.face.getContext('2d').drawImage(value,0,0) :
                    faceUrl && console.error('=> Wrong faceUrl :'+faceUrl)
                ));
            }
        };
        content = new class{
            // content 内容
            // .textId 文本循环器ID
            // .text 文本
            // .image 图片对象
            // .video 视频
            // .audio 音频
            self = document.getElementById('messageContent');
            textObj;
            text = document.getElementById('messageText');
            TextClass = class{
                constructor(text){
                    const content = protoGM.instance.gameMessage.content;
                    this.text = String(text);
                    this.textId = setInterval(()=>this.main(content),GM.configArray.globalArray.textSep);
                }
                index = 0;textId;text;
                /**
                 * 
                 * @param {HTMLDivElement} textElement 
                 */
                main(content){
                    '\n' === content.text.textContent[this.index - 2] &&
                    content.self.scrollTo({top: content.self.scrollHeight,behavior: 'smooth'}),
                    this.text[this.index] ? content.text.textContent += this.text[this.index++] : this.close();
                }
                close(){protoGM.instance.gameMessage.content.textObj = clearInterval(this.textId);}
            };
            image = {self: Object.assign(document.getElementById('messageImage'),{width: 1920,height: 1080}),autoReset: true};
            audio = Object.assign(new Audio(),{oncanplay(){this.play();},onended(){protoGM.instance.gameMessage.closer();}});
            video = Object.assign(document.getElementById('messageVideo'),{
                oncanplay(){this.play(),protoGM.instance.bgm.self.pause(),classNameAddOrRemove('disappear',this,protoGM.instance.gameMessage.self);},
                onended(){protoGM.instance.gameMessage.closer(),protoGM.instance.bgm.loader(protoGM.instance.bgm.tempSrc,true);}
            });
            reset(){
                this.video.classList.add('disappear'),clearCanvas(this.image.self).canvas.classList.add('disappear');
                clearMedia(this.audio),clearMedia(this.video),this.textObj?.close(),this.text.textContent = '';
            }
            /**
             * 
             * @param {String | undefined} text 
             * @param {String | undefined} audioUrl 
             * @param {String | undefined} imageUrl 
             * @param {String | undefined} videoUrl 
             */
            loader(text,audioUrl,imageUrl,videoUrl){
                const autoReset = this.image.autoReset,image = this.image.self;
                this.video.volume = this.audio.volume = GM.configArray.globalArray.globalVolume * GM.configArray.globalArray.dialogue,
                text && (this.textObj = new this.TextClass(text)),
                imageUrl && (image.classList.remove('disappear'),getImage(imageUrl).then(value=>(
                    value && (autoReset ? clearCanvas(image) : image.getContext('2d')).drawImage(value,0,0)
                ))),
                videoUrl && (this.video.src = videoUrl),audioUrl && (this.audio.src = audioUrl);
            }
        }
        // option 阅读选项
        // .ended 对话结束标识
        // .dialogue 对话选项总元素
        // .choice 分支选项总元素
        // .choiceArray 分支选项子元素集合
        // .setChoiceArray() 设置对话分支选项
        option = new class{
            dialogue = document.getElementById('messageDialogue');
            choice = document.getElementById('messageChoice');
            resolveArray = [];
            // choiceArray: temp.children,ended: true,finallyFn: null,
            // isEnded: ()=>this.ended ? this.finallyFn || (()=>{gameMessage.closer();}) : this.isEnded,
            reset(){
                classNameAddOrRemove('disappear',this.dialogue,this.choice);
                for(var i of Array.from(this.choice.children)){i.remove();}
            }
            /**
             * 
             * @param {{string: any}} choiceArray 
             * @returns {HTMLDivElement[]}
             */
            setChoiceArray(choiceArray){
                const nodeArray = [];
                for(let i of Object.keys(choiceArray)){
                    nodeArray.push(this.choice.insertAdjacentElement('beforeend',makeElement(
                        'div',{textContent: i,onclick: ()=>Promise.resolve(choiceArray[i]())}
                    )));
                }
                return nodeArray.length && classNameAddOrRemove('disappear',this.choice,this.dialogue),nodeArray;
                // const isEnded = GM.processArray.dialogueProcess.nowFn = ()=>this.ended ? this.finallyFn || (()=>{gameMessage.closer();}) : isEnded;
                // this.ended = false,finallyFn && (this.finallyFn = finallyFn);
            }
        };
    }
});
'main1.js'