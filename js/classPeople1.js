'use strict';
var HTMLElement = HTMLElement ?? function(){},setInterval = setInterval ?? function(){};
var t0 = (performance.now(),0);
class RealNode{
    /**@throws {Error} */
    static error(message){throw new Error(this.name+' : '+message);}
    /**@type {Map<Symbol,RealNode>} */
    static sys = new Map;
    static t0 = Date.now();
    static now = Promise.resolve();
    static eventLoop = new class EventLoop{
        destroy(){clearInterval(this.intervalId);}
        /**
         * 
         * @param {()=>*} fn 
         * @returns {Promise<*,Error>}
         */
        then(fn,thisArg,...argArray){return new Promise(r=>this.fnArray.unshift(()=>r(fn.apply(thisArg,argArray))));}
        constructor(timeSep = 10,...fnArray){
            RealNode.eventLoop?.destroy?.();
            /**@type {(()=>*)[]} */
            this.fnArray = fnArray;
            this.intervalId = setInterval(()=>{
                const fn = this.fnArray.pop();
                try{fn?.();}catch(e){console.error(e,fn);}
            },timeSep);
        }
    }(4);
    /**
     * @typedef {{
     * tryRealNode: Boolean,
     * childRNs: ({info: [RealNode,String[],String[]]} & RealNode)[],
     * _get()=>*,
     * _set(value)=>Boolean,
     * react()=>Boolean,
     * id: Symbol,
     * value,
     * }} AntiNode 
     */
    static proto = class AntiNode{
        tryRealNode;
        /**@type {(RealNode  &  {info: [RealNode,String[],String[]]})[]} */
        childRNs = [];
        /**@type {()=>*} */
        _get;
        /**@type {(value)=>Boolean} */
        _set;
        /**@type {()=>Boolean} */
        react;
        /**@type {Symbol} */
        id;
        value;
    };
    /**
     * 
     * @param {Symbol} id 
     */
    static search(id){return this.sys.get(id);}
    /**
     * 
     * @param {()=>*} fn 
     * @returns {Promise}
     */
    static justNow(fn,thisArg,...argArray){return RealNode.now.then(fn.bind(thisArg,...argArray));}
    /**
     * 
     * @param {RealNode} realNode 
     */
    static check(realNode){for(const temp of this.sys.entries()) if(realNode === temp[1]) return realNode.id === temp[0];}
    /**
     * 
     * @param {()=>*} fn 
     * @param {Boolean} keepNow 
     * @returns {Promise}
     */
    static afterNow(fn,keepNow,thisArg,...argArray){
        const temp = this.eventLoop.then(fn,thisArg,...argArray);
        return keepNow || (this.now = temp.finally()),temp;
    }
    /**@method @type {(promise: (()=>*) | Promise)=>Promise<{value: * | Error,time: Number}>} */
    static time = (temp=>promise=>{
        const t0 = performance.now();
        return Promise.resolve('function' === typeof promise ? promise() : promise).
        then(temp,temp).then(value=>({value,time: performance.now() - t0}));
    })(e=>e);
    /**@method */
    static copyObj = function copyObj(obj){
        if(obj === Object(obj)){
            const newObj = Array.isArray(obj) ? [] : {};
            for(const i of Object.keys(obj)){95 === i.charCodeAt(0) || (newObj[i] = copyObj(obj[i]));}
            return newObj;
        }else return new.target ? Object(obj) : obj;
    }
    /**
     * 
     * @this {RealNode}
     * @param {RealNode} realNode 
     */
    static react(realNode,react = true,notify = true,noSelf = true){var value;try{
        const temp = this.getPositionsOfChildRN(realNode);
        while(temp.length){
            const position = temp.pop().reverse();
            if(!position.length) return this.realSet(realNode.value,react,notify,noSelf);else{
                value = this.proto.value;
                while(position.length > 1) value = value[position.pop()];
                realNode.value === value[position[0]] || (value[position[0]] = realNode.value);
            }
        }
        return react && this.react(noSelf),notify && this.notify(noSelf),true;
    }catch(e){
        if(this instanceof RealNode) throw e;
        this.error('Please avoid using method "react" of typeof '+this?.name+' !\n'+e.message);
    }}
    /**
     * 
     * @param {()=>*} get 
     */
    static protoCreate(get,...argArray){
        const temp = new RealNode({get});
        temp.proto.value = argArray;
        return temp;
    }
    /**@method @type {((...args)=>RealNode)} */
    static createString = this.protoCreate.bind(null,function(){
        if(Array.isArray(this.proto.value)){
            const temp = this.proto.value.concat();
            for(var i = temp.length;i --> 0;) if(temp[i] instanceof RealNode) temp[i] = temp[i].value;
            return temp.join('');
        }else return String(this.proto.value instanceof RealNode ? this.proto.value.value : this.proto.value);
    });
    /**@method @type {((...args)=>RealNode)} */
    static createNumber = this.protoCreate.bind(null,function(temp = 0){
        if(!Array.isArray(this.proto.value)) return +(this.proto.value instanceof RealNode ? this.proto.value.value : this.proto.value);
        else for(const i of this.proto.value) temp +=+(i instanceof RealNode ? i.value : i);
        return temp;
    });
    protoGet(){return this.proto.value;}
    log(...message){console.log(this+' :',...message);}
    done(){return RealNode.justNow(this.protoDone,this);}
    // done(keepNow){return RealNode.afterNow(this.protoDone,keepNow,this);}
    /**
     * 
     * @returns {Boolean}
     */
    protoSet(value){return value !== this.proto.value && (this.proto.value = value,true);}
    clearChildRNs(){while(this.proto.childRNs.length){this.proto.childRNs.pop().display = false;}return this;}
    error(message){throw new Error("RealNode "+(this.id.description ?? '')+'\n"""\n'+String(message)+'\n"""');}
    [Symbol.toPrimitive](hint){return 'number' === hint ? Number(this.value) : '[object '+this.constructor.name+']{ '+this.id.description+' }';}
    /**
     * 
     * @returns {Promise[][]}
     */
    async protoDone(){
        var i = 0;
        while(i < this.notifyArray.length) await Promise.allSettled(this.notifyArray[i++]);
        i = this.notifyArray;
        this.notifyArray = [];
        return i;
    }
    /**
     * 
     * @param {Boolean} noSelf 
     * @param {RealNode} [thisArg] 
     * @param {number} [count] 
     * @returns {0 | Promise<void>}
     */
    notify(noSelf,thisArg,count){return this.relativeRNs.length && this.done().finally(this.protoNotify.bind(this,noSelf,thisArg,count));}
    /**
     * 
     * @param {Boolean} react 
     * @param {Boolean} notify 
     * @param {Boolean} noSelf 
     * @returns {Boolean}
     */
    realSet(value,react,notify,noSelf){
        var temp;
        return this.proto._set.call(
            this,
            this.proto.tryRealNode && (temp = this.computePositionsOfRNs(value)).length ?
            this.dealWithPositionsOfRNs(temp,value) : value
        ) && (react && this.react?.(),notify && this.notify(noSelf),true);
    }
    /**
     * 
     * @param {RealNode} realNode 
     * @returns {String[][]}
     */
    getPositionsOfChildRN(realNode){
        const childRNs = this.proto.childRNs,temp = [];
        for(var i = childRNs.length,iter;i --> 0;) iter = childRNs[i].info.values(),realNode === iter.next().value && temp.push(...iter);
        return temp;
    }
    /**
     * 
     * @param {Boolean} noSelf 
     * @param {RealNode} [thisArg] 
     * @param {number} [count] 
     */
    protoNotify(noSelf,thisArg,count = 0){
        !thisArg ? thisArg = this : count++;
        (thisArg.notifyArray[count] ??= []).push(new Promise(r=>{
            for(var id of this.relativeRNs){
                !(noSelf && id === this.id) && (id = RealNode.search(id)) && (id.react?.(),id.notify(noSelf,thisArg,count));
            }
            r();
        }));
    }
    /**
     * 
     * @param  {...(RealNode | Symbol)} relativeRNs 
     */
    relate(...relativeRNs){
        var id = relativeRNs[relativeRNs.length - 1];
        const temp = RealNode.search(id?.id ?? id);
        while(relativeRNs.length){
            id = relativeRNs.pop();
            'symbol' === typeof id || (id instanceof RealNode ? id = id.id : this.error(
                '=> "relativeRNs['+relativeRNs.length+']" is not legal id !'
            ));
            RealNode.search(id) && !this.relativeRNs.includes(id) && this.relativeRNs.push(id);
        }
        return temp;
    }
    /**
     * 
     * @param  {...(RealNode | Symbol)} unrelativeRNs 
     */
    unrelate(...unrelativeRNs){
        if(!unrelativeRNs.length) return false;
        const temp = this.relativeRNs.concat();
        var i = unrelativeRNs.length;
        this.relativeRNs.splice(0);
        while(i --> 0) 'symbol' === typeof unrelativeRNs[i] || (unrelativeRNs[i] = unrelativeRNs[i]?.id);
        for(i = temp.length;i --> 0;) unrelativeRNs.includes(temp[i]) || this.relativeRNs.push(temp[i]);
        return temp.length !== this.relativeRNs.length;
    }
    /**
     * 
     * @param {String[]} [position] 
     * @returns {[RealNode, ...string[]][]} 
     */
    computePositionsOfRNs(value,deep = 2,position = [],count = 0){
        /**@type {[RealNode, ...string[]][]} */
        var temp = [],i,keys;
        if(value instanceof RealNode) return temp.push((position.unshift(value),position)),temp;
        else if(count < deep && 'object' === typeof value && value) for(i = (keys = Reflect.ownKeys(value)).length;i --> 0;){
            temp = temp.concat(this.computePositionsOfRNs(value[keys[i]],deep,[...position,keys[i]],count + 1));
        }
        return temp;
    }
    /**
     * 
     * @param {[RealNode, ...string[]][]} realNodeMap 
     */
    dealWithPositionsOfRNs(realNodeMap,expression){
        const temp = this.clearChildRNs().proto.childRNs,list = [];
        var value,i,end;
        while(realNodeMap.length){
            /**@type {[RealNode, ...string[]]} */
            const [realNode,...dir] = realNodeMap.pop();
            if(!dir.length) expression = realNode.value;else{
                for(value = expression,i = 0,end = dir.length - 1;i < end;i++) value = value[key];
                value[dir[i]] = realNode.value;
            }
            i = list.indexOf(realNode);
            i < 0 ? (list.push(realNode),temp.push(realNode.relate(
                new RealNode({info: [realNode,dir],react: this.constructor.react.bind(this,realNode)})
            ))) : temp[i].info.push(dir);
        }
        return expression;
    }
    get childRNs(){return this.proto.childRNs;}
    get display(){return RealNode.sys.has(this.id);}
    get tryRealNode(){return this.proto.tryRealNode;}
    /**@type {Symbol} */
    get id(){return this.proto.id;}
    get set(){return this.realSet;}
    get get(){return this.proto._get;}
    /**@type {()=>void} */
    get react(){return this.proto.react;}
    get value(){return this.get();}
    set display(display){display ? RealNode.sys.set(this.id,this) : RealNode.sys.delete(this.id);}
    set tryRealNode(tryRealNode){
        var i;
        tryRealNode = (this.proto.tryRealNode = Boolean(tryRealNode)) ? 'appear' : 'disappear';
        for(i = this.proto.childRNs.length;i --> 0;) this.proto.childRNs[tryRealNode]();
    }
    /**@param {()=>*} get  */
    set get(get){this.proto._get = 'function' === typeof get ? get : this.protoGet;}
    set set(set){this.proto._set = 'function' === typeof set ? set : this.protoSet;}
    set react(react){this.proto.react = 'function' === typeof react ? react : null;}
    set value(value){this.realSet(value,true,true);}
    /**@type {Symbol[]} */
    relativeRNs = [];
    /**@type {Promise[][]} */
    notifyArray = [];
    /**
     * 
     * @param {{get?: ()=>*,set?: (value)=>Boolean,react?: ()=>void,id?,info?,value?}} config 
     * @param  {...(Symbol | RealNode)} relativeRNs 
     */
    constructor(config,tryRealNode = true,...relativeRNs){
        const {get,set,react,id,info} = Object(config);
        /**@type {AntiNode} */
        this.proto = new this.constructor.proto;
        this.proto.id = Symbol(String(id ?? info?.id ?? ''));
        Reflect.defineProperty(this,'notifyArray',{enumerable: false});
        Reflect.defineProperty(this,'proto',{enumerable: false,writable: false});
        this.display = true;
        this.info = info;
        this.get = get;
        this.set = set;
        this.react = react;
        this.relate(...relativeRNs);
        this.tryRealNode = tryRealNode;
        if('value' in config) this.value = config.value;
        // for(var keys = Reflect.ownKeys(this.proto),i = keys.length;i --> 0;) Reflect.defineProperty(this.proto,keys[i],{enumerable: false});
    }
}
class RealElement extends RealNode{
    /**@typedef {AntiNode & {self: HTMLElement,isElement: Boolean,transform(value)=>*}} AntiHTMLNode */
    static proto = class AntiHTMLNode extends RealNode.proto{
        /**@type {HTMLElement} */
        self;
        /**@type {Boolean} */
        isElement;
        /**@type {(value)=>*} */
        transform;
    };
    static idSet = new Set;
    static myStyle = new Map;
    /**@method @type {(innerHTML: String)=>HTMLElement | null}*/
    static getDomByString = (template=>innerHTML=>{
        template.innerHTML = innerHTML;
        return template.content.firstElementChild;
    })('document' in globalThis ? document.createElement('template') : {content: {}});
    static findId(id){return this.idSet.has(id);}
    static deleteId(id){return typeof id !== 'string' ? this.error('=> Please use String "id" !') : this.idSet.delete(id);}
    /**
     * 
     * @param {String | HTMLElement} tagName 
     * @param {{[attr: String]: String}} [config] 
     * @param {{[attr: String]: String}} [cssConfig] 
     * @returns {HTMLElement}
     */
    static makeElement(tagName,config,cssConfig){
        tagName instanceof HTMLElement || (tagName = document.createElement(tagName));
        return Object.assign(Object.assign(tagName,config).style,cssConfig),tagName;
    }
    static addId(id,strict = true){id && (
        typeof id !== 'string' ? this.error('=> Please use String "id" !') :
        this.idSet.has(id) ? strict && this.error('=> Please use another "id" !') :
        this.idSet.add(id)
    );}
    static getRandomId(){
        for(var temp;this.idSet.has(temp = 'C3'+Math.floor(Math.random() * 1e14).toString(36)););
        return temp;
    }
    /**
     * 
     * @this {RealElement}
     * @param {RealNode} realNode 
     */
    static react(realNode,react = true,notify = true,noSelf = true){var value;try{
        const temp = this.getPositionsOfChildRN(realNode);
        while(temp.length){
            const position = temp.pop().reverse();
            if(!position.length) return this.realSet(realNode.value,react,notify,noSelf);else{
                value = this.proto.value;
                while(position.length > 1) value = value[position.pop()];
                realNode.value === value[position[0]] || (value[position[0]] = realNode.value);
            }
        }
        return this.fix(),react && this.react(noSelf),notify && this.notify(noSelf),true;
    }catch(e){
        if(this instanceof RealElement) throw e;
        this.error('Please avoid using method "react" of typeof '+this?.name+' !\n'+e.message);
    }}
    /**@typedef {(prefix: String,ruleObjObj: {[selector: String]: {[styleName: String]: String}})=>addCSSRules} addCSSRules */
    /**@method @type {addCSSRules} */
    static addCSSRules = (()=>{if('document' in globalThis){
        document.getElementsByTagName("head")[0].
        appendChild(document.createElement("style"))[!window.createPopup && "appendChild"]?.(document.createTextNode(""));
        const myCSS = document.styleSheets[document.styleSheets.length - 1];
        const testReg = /^\.([A-Za-z][A-Z0-9a-z]{0,})$/;
        const strReg0 = /[A-Za-z]$/,strReg1 = /^[A-Za-z]/;
        const getKeys = obj=>obj && 'object' === typeof obj ? Object.keys(obj) : [];
        /**@type {(selector: String,rulesStr: String)=>Number} */
        const tempInsertRule = !myCSS.insertRule ? (selector,rulesStr)=>myCSS.addRule(selector,rulesStr,-1) :
        (selector,rulesStr)=>myCSS.insertRule(selector+"{\n"+rulesStr+"}",myCSS.cssRules.length);
        return function addCSSRules(prefix,ruleObjObj){
            'string' === typeof prefix || RealElement.error('"prefix" in addCSSRules must be String !');
            for(const selector of getKeys(ruleObjObj)){
                const ruleObj = ruleObjObj[selector],temp = [];
                for(const key of getKeys(ruleObj)){temp.push(key,':',String(ruleObj[key]),';\n');}
                tempInsertRule(prefix+(strReg0.test(prefix) && strReg1.test(selector) ? ' ' : '')+selector+' ',temp.join(''));
            }
            const cssName = testReg.exec(prefix)?.[1];
            cssName && RealElement.myStyle.set(cssName,Object.assign({},RealElement.myStyle.get(cssName),ruleObjObj));
            return addCSSRules;
        };
    }})();
    getIndexWithin(){
        for(var i = 0,temp;temp = this.self.previousElementSibling;i++);
        return i;
    }
    protoTransform(value){return value;}
    fix(){return this.self[this.key] = this.transform(this.proto.value),this;}
    clearClassName(){return this.proto.isElement && (this.self.className = '',true);}
    /**@param {...String} */
    addClassName(){return this.proto.isElement && (this.self.classList.add(...arguments),true);}
    /**@param {String} className */
    toggleClassName(className){return this.proto.isElement && this.self.classList.toggle(className);}
    /**@param {...String} */
    removeClassName(){return this.proto.isElement && (this.self.classList.remove(...arguments),true);}
    rememberParent(){if(this.self instanceof HTMLElement) this.info = this.self.parentElement;return this;}
    /**
     * 
     * @param {HTMLElement} element 
     */
    appendIn(element){return element.appendChild(this.self) && this.rememberParent();}
    /**
     * 
     * @param {Boolean} react 
     * @param {Boolean} notify 
     * @param {Boolean} noSelf 
     * @returns {Boolean}
     */
    realSet(value,react,notify,noSelf){
        var temp;
        return this.tryRealNode && (temp = this.computePositionsOfRNs(value)).length ? this.dealWithPositionsOfRNs(temp,value) :
        this.proto._set.call(this,value) && (this.fix(),react && this.react,notify && this.notify(noSelf),true);
    }
    /**
     * 
     * @param {String} selfSelector 
     * @param {String | {[selector: String]: {[styleName: String]: String}}} classNameOrRuleObjObj 
     */
    applyCSS(selfSelector,classNameOrRuleObjObj){
        const strReg = /^[A-Za-z]/;
        if(this.self instanceof HTMLElement){
            'string' === typeof selfSelector || this.error('"selfSelector" must be String');
            const id = '' === this.self.id ? this.self.id = RealElement.getRandomId() : this.self.id;
            'string' === typeof classNameOrRuleObjObj ? classNameOrRuleObjObj = RealElement.myStyle.get(classNameOrRuleObjObj) :
            classNameOrRuleObjObj = Object(classNameOrRuleObjObj);this.log(RealElement.myStyle)
            return !classNameOrRuleObjObj ? false : (RealElement.addCSSRules(
                '#'+id+(strReg.test(selfSelector) ? ' ' : '')+selfSelector,classNameOrRuleObjObj
            ),RealElement.addId(id,false),true);
        }else this.error('I am not Element !');
    }
    /**
     * 
     * @param {Boolean} keepValue 
     * @param {Boolean} fix 
     * @param {Boolean} [deepCopyRelativeRNs] 
     */
    clone(keepValue,fix,deepCopyRelativeRNs){
        const self = this.self instanceof HTMLElement ? this.self.cloneNode() :
        Object.assign(Object.create(Reflect.getPrototypeOf(this.self)),this.self);
        const param0 = {self,key: this.key,transform: this.transform};
        if(keepValue) param0.initValue = this.proto.value;
        const temp = new RealElement(param0,{
            get: this.proto._get,
            set: this.proto._set,
            react: this.proto.react,
            id: this.id.description+'-clone',
            info: this.info,
        });
        Reflect.setPrototypeOf(temp,Reflect.getPrototypeOf(this));
        if(null == deepCopyRelativeRNs) temp.relativeRNs = deepCopyRelativeRNs ? this.relativeRNs : this.relativeRNs.concat();
        if(fix) temp.fix();
        return temp;
    }
    get self(){return this.proto.self;}
    get isElement(){return this.proto.isElement;}
    get transform(){return this.proto.transform;}
    /**@param {(value)=>*} transform  */
    set transform(transform){this.proto.transform = 'function' === typeof transform ? transform : this.protoTransform;}
    set self(self){
        self && 'object' === typeof self ? this.proto.isElement = (this.proto.self = self) instanceof HTMLElement :
        this.error('=> "self" must be HTMLElement !');
    }
    /**
     * 
     * @param {{self: HTMLElement,key,transform?: (value)=>*},initValue} param0 
     * @param {{get?: ()=>*,set?: (value)=>Boolean,react?: ()=>void,id?,info?,value?}} [config] 
     * @param {Boolean} [tryRealNode] 
     * @param  {...RealNode} relativeRNs 
     */
    constructor({self,key,transform,initValue},config = {},tryRealNode,...relativeRNs){
        super(config,tryRealNode,...relativeRNs);
        /**@type {AntiHTMLNode} */this.proto;
        this.proto.value = initValue;
        this.self = self;
        this.key = key;
        this.transform = transform;
    }
}
class RealCanvas extends RealElement{
    /**@typedef {AntiHTMLNode & {self: HTMLCanvasElement,ctx: CanvasRenderingContext2D,img: HTMLImageElement}} AntiCanvas */
    static proto = class AntiCanvas extends RealElement.proto{
        img = new Image;
        isElement = true;
        /**@type {CanvasRenderingContext2D} */
        ctx = this.self.getContext('2d');
    }
    fix(){(this.clearBeforeDraw ? this.clear() : this.proto.ctx).drawImage(this.proto.img,0,0);}
    clear(){return this.proto.ctx.clearRect(0,0,this.proto.self.width,this.proto.self.height),this.proto.ctx.closePath(),this.proto.ctx;}
    protoSet(src){
        return loaded = this.loaded.then(()=>new Promise((r,e)=>Object.assign(this.proto.img,{onload: r,onerror: e}).src = src))
        .then(()=>(this.proto.value = src,true),e=>(console.error(e ? e : this+': Fail to load by src !'),false));
    }
    realSet(value,react,notify,noSelf){
        var temp;
        return Promise.resolve(this.proto._set.call(
            this,
            this.proto.tryRealNode && (temp = this.computePositionsOfRNs(value)).length ?
            this.dealWithPositionsOfRNs(temp,value) : value
        )).then(value=>value && (this.fix(),react && this.react?.(),notify && this.notify(noSelf),true));
    }
    get ctx(){return this.proto.ctx;}
    get img(){return this.proto.img;}
    get self(){return this.proto.self;}
    get width(){return this.proto.self.width;}
    get height(){return this.proto.self.height;}
    get imgW(){return this.proto.img.naturalWidth;}
    get imgH(){return this.proto.img.naturalHeight;}
    get opacity(){return this.proto.ctx.globalAlpha;}
    set width(width){this.proto.self.width = width ?? 640;}
    set opacity(opacity){this.proto.ctx.globalAlpha = opacity;}
    set height(height){this.proto.self.height = height ?? 360;}
    loaded = RealNode.now;
    clearBeforeDraw = true;
    constructor(id,width,height,...relativeRNs){
        id = String(id);
        const self = document.getElementById(id);
        if(self && !(self instanceof HTMLCanvasElement)) throw new Error('=> RealCanvas with id "'+id+'" is not HTMLCanvasElement !');
        super({self: self ?? RealElement.makeElement('canvas',{id})},{id},true,...relativeRNs);
        /**@type {AntiCanvas} */
        this.proto;
        this.width = width;
        this.height = height;
    }
}
class RealDivList extends RealElement{
    /**@typedef {AntiHTMLNode & {list: HTMLElement[],childrenList: HTMLElement[][]}} AntiList */
    static proto = class AntiList extends RealElement.proto{
        /**@type {HTMLDivElement[]} */
        list = [];
        /**@type {HTMLElement[][]} */
        childrenList = [];
    }
    /**
     * 
     * @param {Number} length 
     * @param {String} tagName 
     * @param {String} [id] 
     * @param {{[attr: String]: (event: Event)=>void}} [selfAssign] 
     */
    static createList(length = 0,tagName,id,selfAssign){
        const temp = [];
        while(length --> 0) temp.push(document.createElement(tagName));
        return new RealDivList(id,true,temp,true,selfAssign);
    }
    /**
     * 
     * @this {RealDivList}
     * @param {RealNode} realNode 
     */
    static react(realNode,react = true,notify = true,noSelf = true){var value;try{
        const temp = this.getPositionsOfChildRN(realNode);
        while(temp.length){
            const position = temp.pop().reverse(),tempValue = realNode.value;
            if(!position.length) return this.realSet(tempValue,react,notify,noSelf);else{
                value = this.proto.value;
                while(position.length > 1) value = value[position.pop()];
                tempValue === value[position[0]] || (value[position[0]] = tempValue);
                value === this.proto.value && ((position[1] = this.proto.list[position[0]]).innerHTML = '');
                tempValue instanceof HTMLElement ? position[1].appendChild(tempValue) :
                position[1][this.tryHTML ? 'innerHTML' : 'textContent'] = tempValue;
            }
        }
        return react && this.react(noSelf),notify && this.notify(noSelf),true;
    }catch(e){
        if(this instanceof RealDivList) throw e;
        this.error('Please avoid using method "react" of typeof '+this?.name+' !\n'+e.message);
    }}
    /**
     * 
     * @returns {HTMLElement[]}
     */
    protoGet(){return this.proto.list;}
    /**
     * 
     * @param {(HTMLElement | String)[]} value 
     */
    protoSet(value){return this.proto.value = Array.from(value),true;}
    /**
     * 
     * @param {Array} value 
     */
    protoTransform(value){
        var list = [],temp;
        if(!value?.[Symbol.iterator]) throw new Error('=> "value" must be Arraylike !'); else{
            const iter = value[Symbol.iterator]();
            while(!(temp = iter.next()).done){
                list.push(temp.done = document.createElement('div'));
                temp.value instanceof HTMLElement ? temp.done.appendChild(temp.value) :
                temp.done[this.tryHTML ? 'innerHTML' : 'textContent'] = String(temp.value);
            }
            return list;
        }
    }
    /**
     * 
     * @param {Boolean} [toRealElement] 
     * @param {String} [key] 
     * @returns {{[id: String]: HTMLElement} | {[id: String]: RealElement}}}
     */
    getIdDict(toRealElement,key){
        /**@type {{[id: String]: HTMLElement} | {[id: String]: RealElement}} */
        const list = Object.create(null);
        var i = this.proto.list.length,temp;
        if(toRealElement) while(i --> 0) (temp = this.proto.childrenList[i]).length > 1 || !temp[0]?.id ||
        (list[temp[0].id] = new RealElement({self: this.proto.list[i],key}));
        else while(i --> 0) (temp = this.proto.childrenList[i]).length > 1 || !temp[0]?.id ||
        (list[temp[0].id] = this.proto.list[i]);
        return list;
    }
    /**
     * 
     * @returns {RealElement[]}
     */
    getRealEmentList(){
        const temp = this.proto.list.concat();
        for(var i = temp.length;i --> 0;) temp[i] = new RealElement({self: temp[i]});
        return temp;
    }
    fix(){
        var i = 0;
        this.self.classList.add('disappear');
        this.self.innerHTML = '';
        /**@type {HTMLDivElement[]} list */
        const list = this.proto.list = this.transform(this.proto.value),childrenList = this.proto.childrenList = [];
        while(i < list.length){childrenList.push(Array.from(this.self.appendChild(list[i++]).children));}
        this.self.classList.remove('disappear');
        return this;
    }
    /**@type {HTMLElement[][]} */
    get childrenList(){return this.proto.childrenList;}
    /**
     * 
     * @param {String} id 
     * @param {Boolean} tryHTML 
     * @param {(HTMLElement | String)[]} optionList 
     * @param {Boolean} [tryRealNode] 
     * @param {{[attr: String]: (event: Event)=>void}} [selfAssign] 
     */
    constructor(id,tryHTML,optionList,tryRealNode,selfAssign){
        const self = ('string' === typeof id || (id = '',false)) && document.getElementById(id);
        console.log(id,self?.parentElement);
        RealElement.addId(id,!self);
        super({
            self: self || RealElement.makeElement('div',{id}),
            initValue: !optionList?.[Symbol.iterator] ? [] : Array.from(optionList)
        },{id},tryRealNode);
        /**@type {AntiList} */this.proto;
        this.tryHTML = tryHTML;
        Object.assign(this.fix().rememberParent().self,selfAssign);
    }
}
class RealImgList extends RealDivList{
    /**
     * 
     * @this {RealImgList}
     * @param {(HTMLElement | String)[]} value 
     */
    static protoSet(value){
        if(!value?.[Symbol.iterator]) throw new Error('=> "value" must be Arraylike !'); else{
            /**@type {IterableIterator<HTMLImageElement | String>} */
            const iter0 = this.proto.value[Symbol.iterator]();
            const iter1 = value[Symbol.iterator]();
            /**@type {[IteratorResult<HTMLImageElement>,IteratorResult<HTMLImageElement>]} */
            const temp = Array(2);
            while((temp[0] = iter0.next(),temp[1] = iter1.next(),!temp[0].done ^ temp[1].done)){
                if(temp[0].done) break;
                if((temp[0].value?.src ?? String(temp[0].value)) !== (temp[0].value?.src ?? String(temp[0].value))){
                    return this.proto.value = Array.from(value),true;
                }
            }
            return false;
        }
    }
    /**
     * 
     * @this {RealImgList}
     * @param {RealNode} realNode 
     */
    static react(realNode,react = true,notify = true,noSelf = true){var value;try{
        const temp = this.getPositionsOfChildRN(realNode);
        while(temp.length){
            const position = temp.pop().reverse(),tempValue = realNode.value;
            if(!position.length) return this.realSet(tempValue,react,notify,noSelf);else{
                value = this.proto.value;
                while(position.length > 1) value = value[position.pop()];
                tempValue === value[position[0]] || (value[position[0]] = tempValue);
                if(value === this.proto.value) this.proto.childrenList[position[0]][0].src = String(tempValue?.src ?? tempValue);
            }
        }
        return react && this.react(noSelf),notify && this.notify(noSelf),true;
    }catch(e){
        if(this instanceof RealImgList) throw e;
        this.error('Please avoid using method "react" of typeof '+this?.name+' !\n'+e.message);
    }}
    /**
     * 
     * @returns {HTMLImageElement[]}
     */
    cloneImgList(){
        const temp = this.childrenList.concat();
        for(var i = temp.length;i --> 0;) temp[i] = temp[i][0].cloneNode();
        return temp;
    }
    /**
     * 
     * @param {Array} value 
     */
    protoTransform(value){
        var list = [],temp;
        if(!value?.[Symbol.iterator]) throw new Error('=> "value" must be Arraylike !'); else{
            const iter = value[Symbol.iterator]();
            while(!(temp = iter.next()).done){
                list.push(temp.done = document.createElement('div'));
                temp.done.appendChild(temp.value instanceof Image ? temp.value : Object.assign(new Image(),{src: String(temp.value)}));
            }
            return list;
        }
    }
    /**
     * 
     * @param {String} id 
     * @param {(HTMLElement | String)[]} srcList 
     * @param {Boolean} [tryRealNode] 
     * @param {{[attr: String]: (event: Event)=>void}} [selfAssign] 
     */
    constructor(id,srcList,tryRealNode,selfAssign){super(id,true,srcList,tryRealNode,selfAssign);}
}
class RealSelect extends RealElement{
    /**@typedef {AntiHTMLNode & {list: HTMLOptionElement[]}} AntiSelect */
    static proto = class AntiSelect extends RealElement.proto{
        /**@type {HTMLOptionElement[]} */
        list = [];
    };
    /**
     * 
     * @this {RealSelect}
     * @param {RealNode} realNode 
     */
    static react(realNode,react = true,notify = true,noSelf = true){var value,i;try{
        const temp = this.getPositionsOfChildRN(realNode);
        while(temp.length){
            const position = temp.pop().reverse(),tempValue = realNode.value;
            if(!position.length) return this.realSet(tempValue,react,notify,noSelf);else{
                value = this.proto.value;
                while(position.length > 1) value = value[position.pop()];
                tempValue === value[position[0]] || (value[position[0]] = tempValue);
                if(value === this.proto.value){
                    i = 0;
                    fix:for(const key of Object.keys(value)) if(key !== position[0]) i++;else{
                        this.proto.list[i].value = String(tempValue);
                        break fix;
                    }
                }
            }
        }
        return react && this.react(noSelf),notify && this.notify(noSelf),true;
    }catch(e){
        if(this instanceof RealSelect) throw e;
        this.error('Please avoid using method "react" of typeof '+this?.name+' !\n'+e.message);
    }}
    /**
     * 
     * @param {{[text: String]: String}} value 
     */
    protoSet(value){return this.proto.value = Object.assign({},value),true;}
    fix(){
        this.self[this.key] = this.proto.value;
        this.proto.list = Array.from(this.self.children);
    }
    /**
     * 
     * @returns {String[]}
     */
    protoGet(){
        const valueArray = [],list = this.proto.list,end = list.length;
        for(var i = 0;i < end;i++){list[i].selected && valueArray.push(list[i].value);}
        return valueArray;
    }
    /**
     * 
     * @param {Array} value 
     */
    protoTransform(value){
        var now;
        this instanceof RealSelect && !this.self.multiple && (value = Object.assign({_: ''},value));
        const innerHTML = [],iterator = Object.entries(value).values();
        while(!(now = iterator.next()).done)
            innerHTML.push(`<option value="${String(now.value[1])}" ${now.value[0] === '_' ? 'selected' : ''}>${now.value[0]}</option>`);
        return innerHTML.join('');
    }
    /**@returns {HTMLElement[]} */
    get list(){return this.proto.list;}
    /**
     * 
     * @param {String | null} id 
     * @param {(value: {[text: String]: String})=>String} transform 
     * @param {Boolean} multiple 
     * @param {(e: Event)=>void} onchange 
     * @param {{[text: String]: String}} optionConfig 
     * @param {Boolean} [tryRealNode] 
     */
    constructor(id,multiple,transform,onchange,optionConfig,tryRealNode){
        const self = ('string' === typeof id || (id = '',false)) && document.getElementById(id);
        console.log(id,self?.parentElement);
        self && (
            self.tagName.toLocaleLowerCase() === 'select' ? Object.assign(self,{multiple,onchange}) :
            RealNode.error('=> "id" exists but not within an HTMLSelectElement !')
        );
        RealElement.addId(id,!self);
        super({
            self: self || RealElement.makeElement('select',{id,multiple,onchange}),
            key: 'innerHTML',
            transform,
            initValue: Object.assign({},optionConfig)
        },{id},tryRealNode);
        this.fix().rememberParent();
    }
}
class RealGroup{
    error(message,...proof){console.log(...proof);throw new Error('RealGroup """\n'+String(message)+'\n"""');}
    /**
     * 
     * @param {String[]} [without] 
     * @param {String[]} [within] 
     */
    fix(without,within){for(const realNode of this[Symbol.iterator](without,within,true)) realNode.fix?.();}
    /**
     * 
     * @param {String[]} [without] 
     * @param {String[]} [within] 
     */
    react(without,within){for(const realNode of this[Symbol.iterator](without,within,true)) realNode.react?.();}
    /**
     * 
     * @returns {Promise<(0 | void)[]>}
     */
    notify(){
        const temp = Reflect.ownKeys(this.dict);
        for(var i = temp.length;i --> 0;) temp[i] = this.dict[temp[i]].notify(true);
        return Promise.all(temp);
    }
    /**
     * 
     * @param {{[key: String]: RealNode}} realNodeDict 
     * @returns {RealGroup}
     */
    extra(realNodeDict){
        return realNodeDict && 'object' === typeof realNodeDict ?
        new RealGroup(Object.assign(Object.create(null),this.dict,realNodeDict)) :
        this.error('=> "realNodeDict" must be Object !');
    }
    /**
     * 
     * @param {String[]} [without] 
     * @param {String[] | IterableIterator<String>} [within] 
     * @param {Boolean} [all] 
     */
    *[Symbol.iterator](without,within,all){
        Array.isArray(without) || (without = []);
        for(const key of (within[Symbol.iterator] ? within : all ? Reflect.ownKeys(this.dict) : this.keys)){
            without.includes(key) || (yield [key,this.dict[key]]);
        }
    }
    /**
     * 
     * @param {{[key: String]}} value 
     * @param {Boolean} react 
     * @param {Boolean} notify 
     * @returns {Boolean}
     */
    set(value,react,notify){
        if(value && 'object' === typeof value){
            const temp = [];
            for(const [,realNode] of this[Symbol.iterator](null,Reflect.ownKeys(value),true)) realNode.realSet(value[key],react) && temp.push(realNode);
            temp.length && (react && this.react(keys1),notify && this.notify());
            return temp;
        }else this.error('=> "value" must be Object !');
    }
    get value(){
        const temp = {},keys = Object.keys(this.dict);
        for(var i = keys.length;i --> 0;) temp[keys[i]] = this.dict[keys[i]].value;
        return temp;
    }
    /**@param {{[key: String]}} value */
    set value(value){this.set(value,true,true);}
    /**@type {readonly {[key: String]: RealNode}} */
    dict = Object.create(null);
    /**@type {String[]} */
    keys;
    /**
     * 
     * @param {{[key: String]: RealNode}} realNodeDict 
     */
    constructor(realNodeDict){var i;if(realNodeDict && 'object' === typeof realNodeDict){
        Reflect.defineProperty(this,'dict',{enumerable: false,writable: false,configurable: false});
        const temp = Reflect.ownKeys(realNodeDict);
        for(i = temp.length;i --> 0;) realNodeDict[temp[i]] instanceof RealNode && (this.dict[temp[i]] = realNodeDict[temp[i]]);
        // this.error('=> Value ['+String(temp[i])+'] in "realNodeDict" must be RealNode !');
        Object.freeze(this.dict);
        Reflect.defineProperty(this,'keys',{value: Object.freeze(Object.keys(this.dict)),writable: false,configurable: false});
    }else this.error('=> "realNodeDict" must be Object !');}
}
console.log(performance.now() - t0,'ms');
'document' in globalThis || (1 === 10
? RealNode.eventLoop.destroy() : RealNode.time(new Promise(r=>{
    test1:{
        // console.log(realNode - 1,realNode+'',!realNode,realNode+realNode);
        // console.log((Math.sqrt(5) - 1) / 2);
        // realNode.proto.tryRealNode = false;
        // realNode.value = realNode.dealWithPositionsOfRNs([[realNode]]);
    }
    test2:{
        // const realNode = new RealNode({id: 213,info: [0,0],value: 0,react(){
        //     Math.random() > Math.random() ? this.info[0]++ : this.info[1]++;
        // },set(value){return 1e6 > value ? ((this.proto.value = value + 1),true) : r(realNode.info);}});
        // realNode.value = realNode;
    }
    test3:{
        const f = new RealNode({id: 'Marry',value: 0}),m = new RealNode({id: 'Mike',value: 0});
        m.relate(f.relate(new RealNode({id: 'Mr. White',react(){
            m < 1e6 && f < 1e6 ? Math.random() * 1 > Math.random() ? f.value++ : m.value++ : r((m > f ? m : f)+': +'+Math.abs(f-m));
        }}))).react();
    }
    // const tempFn = ()=>(RealNode.afterNow(tempFn,true),console.log(realNode.value));
    // RealNode.afterNow(tempFn,true);
})).then(({value,time})=>(console.log(value,'in',time,'ms'),RealNode.eventLoop.destroy())));
// (()=>{
//     var t0 = performance.now(),i = 1e8,temp = [0,0];
//     while(i --> 0) Math.random() > Math.random() ? temp[0]++ : temp[1]++;
//     console.log(temp,performance.now() - t0);
// })()
