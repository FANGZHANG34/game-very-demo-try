'use strict';
class RealNode{
    /**@throws */
    static error(message){throw new Error(message);}
    static proto = class AntiNode{
        /**@type {()=>any} */
        get;
        /**@type {()=>void} */
        set;
        /**@type {()=>Boolean} */
        react;
        /**@type {Symbol} */
        id;
        info;
        value;
    };
    /**@type {Map<Symbol,RealNode>} */
    static sys = new Map;
    static afterNow = ((now = Promise.resolve())=>/**@param {()=>void} fn */fn=>now.then(fn))();
    /**
     * 
     * @param {Symbol} id 
     */
    static search(id){return this.sys.get(id);}
    /**@this {RealNode} */
    static protoGet(){return this.value;}
    /**@this {RealNode} */
    static protoSet(value){return value !== this.proto.value && (this.proto.value = value,true);}
    proto = new RealNode.proto;
    /**@type {Symbol[]} */
    relativeRNs = [];
    disappear(){return RealNode.sys.delete(this.id);}
    appear(){return RealNode.sys.set(this.id,this),this;}
    /**
     * 
     * @param {Boolean} react 
     * @param {Boolean} notify 
     * @returns {Boolean}
     */
    realSet(value,react,notify){return this.proto.set.call(this,value) && (react && this.react,notify && this.notify(),true);}
    notify(){for(var realNode of this.relativeRNs){
        realNode = RealNode.search(id);
        realNode && (realNode?.react(),RealNode.afterNow(()=>this.notify()));
    }}
    /**
     * 
     * @param  {...(RealNode | Symbol)} relativeRNs 
     */
    relate(...relativeRNs){
        var id;
        while(relativeRNs.length){
            id = relativeRNs.pop();
            typeof id === 'symbol' || (id instanceof RealNode ? id = id.id : RealNode.error(
                '=> "relativeRNs['+relativeRNs.length+']" is not legal id !'
            ));
            RealNode.search(id) && this.relativeRNs.push(id);
        }
    }
    get id(){return this.proto.id;}
    get info(){return this.proto.info;}
    get set(){return this.realSet;}
    get react(){return this.proto.react;}
    get value(){return this.proto.get();}
    set info(info){this.proto.info = info;}
    /**@param {()=>any} get  */
    set get(get){this.proto.get = typeof get === 'function' ? get : this.constructor.protoGet;}
    set set(set){this.proto.set = typeof set === 'function' ? set : this.constructor.protoSet;}
    set react(react){this.proto.react = typeof react === 'function' ? react : null;}
    set value(value){this.set(value,true,true);}
    /**
     * 
     * @param {{get?: ()=>any,set?: ()=>Boolean,react?: ()=>void,id?: Symbol,info?: any,value?: any}} config 
     * @param  {...(Symbol | RealNode)} relativeRNs 
     */
    constructor(config,...relativeRNs){
        const {get,set,react,id,info,value} = config;
        this.proto.id = Symbol(id ?? (typeof info === 'object' ? info.id : info));
        Object.defineProperty(this,'proto',{enumerable: false,writable: false}).appear().info = info;
        this.get = get;
        this.set = set;
        this.react = react;
        this.relate(...relativeRNs);
        'value' in config && (this.value = value);
    }
}
class RealElement extends RealNode{
    static proto = class AntiHTMLNode extends RealNode.proto{
        /**@type {HTMLElement} */
        self;
        /**@type {(value)=>any} */
        transform;
    };
    static idSet = new Set;
    /**
     * 
     * @this {RealElement}
     * @param {never} value 
     * @returns {never}
     */
    static protoTransform(value){return value;}
    /**
     * 
     * @param {String} tagName 
     * @param {{}} config 
     * @returns {HTMLElement}
     */
    static makeElement(tagName,config){return Object.assign(document.createElement(tagName),config);}
    static addId(id){
        id && (
            typeof id !== 'string' ? RealNode.error('=> Please use String "id" !') :
            RealElement.idSet.has(id) ? RealNode.error('=> Please use another "id" !') :
            RealElement.idSet.add(id)
        );
    }
    static deleteId(id){
        return typeof id !== 'string' ? RealNode.error('=> Please use String "id" !') : RealElement.idSet.delete(id);
    }
    fix(){return this.self[this.key] = this.transform(this.proto.value),this;}
    /**
     * 
     * @param {Boolean} react 
     * @param {Boolean} notify 
     * @returns {Boolean}
     */
    realSet(value,react,notify){
        return this.proto.set.call(this,value) && (this.fix(),react && this.react,notify && this.notify(),true);
    }
    get self(){return this.proto.self;}
    get transform(){return this.proto.transform;}
    set self(self){self && typeof self === 'object' ? this.proto.self = self : RealElement.error('=> "self" must be HTMLElement !');}
    /**@param {(value: {})=>String} transform  */
    set transform(transform){this.proto.transform = typeof transform === 'function' ? transform : RealElement.protoTransform;}
    /**
     * 
     * @param {{self: HTMLElement,key: any,transform?: (value)=>any},initValue: any} param0 
     * @param {{get?: ()=>any,set?: ()=>Boolean,react?: ()=>void,id?: Symbol,info?: any,value?: any}} config 
     * @param  {...RealNode} relativeRNs 
     */
    constructor({self,key,transform,initValue},config,...relativeRNs){
        super(config,...relativeRNs);
        Object.defineProperty(this,'proto',{value: Object.assign(new RealElement.proto,this.proto)}).self = self;
        this.proto.value = initValue;
        this.key = key;
        this.transform = transform;
    }
}
class RealDivList extends RealElement{
    /**
     * 
     * @param {(HTMLElement | String)[]} value 
     */
    static protoSet(value){return this.proto.value = value.concat(),true;}
    /**
     * @this {RealDivList}
     * @param {Array} value 
     * @returns {HTMLElement[]} 
     */
    static protoTransform(value){
        var list = [],temp;
        if(!value?.[Symbol.iterator]) throw new Error('=> "value" must be Arraylike !'); else{
            const iter = value.values();
            switch(this.mode){
                case 'Element':{
                    while(!(temp = iter.next()).done){
                        (list[list.length] = document.createElement('div')).insertAdjacentElement('beforeend',temp.value);
                    }
                    break;
                }
                case 'HTML':{
                    while(!(temp = iter.next()).done){list.push(makeElement('div',{innerHTML: String(temp.value)}));}
                    break;
                }
                default:{
                    while(!(temp = iter.next()).done){list.push(makeElement('div',{textContent: String(temp.value)}));}
                    break;
                }
            }
            return list;
        }
    }
    fix(){
        this.self.innerHTML = '';
        var i = 0;
        const list = this.list = this.transform(this.value);
        while(i < list.length){this.self.insertAdjacentElement('beforeend',list[i++]);}
        return this;
    }
    get transform(){return this.proto.transform;}
    /**@param {(value: (HTMLElement | String)[])=>HTMLDivElement[]} transform  */
    set transform(transform){this.proto.transform = typeof transform === 'function' ? transform : RealDivList.protoTransform;}
    /**
     * 
     * @param {String} id 
     * @param {"Element" | "HTML" | "Text"} mode 
     * @param {(value: (HTMLElement | String)[])=>HTMLDivElement[]} transform 
     * @param {(event: Event)=>void} onclick 
     * @param {(HTMLElement | String)[]} optionList 
     */
    constructor(id,mode,transform,onclick,optionList){
        RealElement.addId(id);
        this.mode = mode;
        super({self: RealElement.makeElement('select',{id,onclick}),transform,initValue: optionList.concat()},{id});
        this.fix();
    }
}
class RealSelect extends RealElement{
    /**
     * 
     * @param {{}} value 
     */
    static protoSet(value){return this.proto.value = Object.assign({},value),true;}
    /**
     * @this {RealSelect}
     * @param {Array} value 
     */
    static protoTransform(value){
        this.self.multiple || (value = Object.assign({_: ''},value));
        var now;
        const innerHTML = [],iterator = Object.entries(value).values();
        while(!(now = iterator.next()).done)
            innerHTML.push(`<option value="${String(now.value[1])}" ${now.value[0] === '_' ? 'selected' : ''}>${now.value[0]}</option>`);
        return innerHTML.join('');
    }
    get transform(){return this.proto.transform;}
    /**@param {(value: {})=>String} transform  */
    set transform(transform){this.proto.transform = typeof transform === 'function' ? transform : RealSelect.protoTransform;}
    /**
     * 
     * @param {String | null} id 
     * @param {(value: {})=>String} transform 
     * @param {Boolean} isMultiple 
     * @param {(e: Event)=>void} onchange 
     * @param {{}} optionConfig 
     */
    constructor(id,isMultiple,transform,onchange,optionConfig){
        RealElement.addId(id);
        super({
            self: RealElement.makeElement('select',{id,multiple: isMultiple,onchange}),
            key: 'innerHTML',transform,initValue: Object.assign({},optionConfig)
        },{id});
        this.fix();
    }
}