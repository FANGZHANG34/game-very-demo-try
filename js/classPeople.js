'use strict';
/**
 * 
 * @param {{
 * symbol?: any,
 * info?: {} | undefined,
 * self?: {} | undefined,
 * key?: any,
 * value?: any,
 * checkSet?: (value: any)=>Boolean,
 * get?: ()=>any,
 * react?: ()=>void
 * }} param0 
 * @param  {...RealNode} contactRealNodes 
 */
function RealNode({symbol,info,self,key,value,checkSet,get,react} = {},...contactRealNodes){
    if(!new.target) throw new Error('=> Need "new" before !');
    this.react = this.key = this.self = this.info = null;
    this.constructorCheck(this,{info,self,key,checkSet,get,react});
    this.value = self?.[key];
    this.id = Symbol(symbol);
    this.contactRealNodes = [];
    this.appear();
    RealNode.makeContact([this],contactRealNodes);
    value && this.set(value);
}
{
    RealNode.resolveVoid = Promise.resolve();
    RealNode.sys = new Map();
    /**
     * 
     * @param {Symbol} id 
     * @returns {RealNode | undefined}
     */
    RealNode.get = function(id){return this.sys.get(id);};
    /**
     * 
     * @param {(RealNode | Symbol)[]} realNodes 
     * @param {(RealNode | Symbol)[]} contactRealNodes 
     */
    RealNode.makeContact = function(realNodes,contactRealNodes){
        if(typeof realNodes[Symbol.iterator] !== 'function') throw new Error('=> "realNodes" must be ArrayLike !');
        if(typeof contactRealNodes[Symbol.iterator] !== 'function') throw new Error('=> "contactRealNodes" must be ArrayLike !');
        realNodes = realNodes.concat(),contactRealNodes = contactRealNodes.concat();
        for(var i = realNodes.length,j;i --> 0;){
            if(!(realNodes[i] instanceof RealNode) && Symbol !== realNodes[i]?.constructor){
                throw new Error('=> All items in "realNodes" must be RealNode or Symbol !');
            }
            if(!((realNodes[i] = RealNode.get(realNodes[i].id ?? realNodes[i])) instanceof RealNode)) throw new Error('=> Wrong RealNodeID: realNodes['+i+']');
            for(j = contactRealNodes.length;j --> 0;){
                if(!(contactRealNodes[j] instanceof RealNode) && Symbol !== contactRealNodes[j]?.constructor){
                    throw new Error('=> All items in "contactRealNodes" must be RealNode or Symbol !');
                }if((realNodes[i].id ?? realNodes[i]) === (contactRealNodes[j] = contactRealNodes[j].id ?? contactRealNodes[j])){throw new Error(
                    `=> Wrong RealNode in both "realNodes" and "contactRealNodes" !\n    realNodes[${i}] contactRealNodes[${j}]`
                );}
                realNodes[i].contactRealNodes.includes(contactRealNodes[j]) || realNodes[i].contactRealNodes.push(contactRealNodes[j]);
            }
        }
        return realNodes;
    };
}
{
    RealNode.prototype.appear = function(){RealNode.sys.set(this.id,this);};
    /**
     * 
     * @param {{
     * key?: any,
     * checkSet?: (value: any)=>Boolean,
     * get?: ()=>any,
     * react?: ()=>void
     * }} param0 
     * @param  {...RealNode} contactRealNodes 
     */
    RealNode.prototype.callPartner = function({symbol,info,key,checkSet,get,react} = {},...contactRealNodes){
        return new RealNode(this.constructorCheck(
            {},{symbol,info,self: this.self ?? void 0,key,value: this.self?.[key],checkSet,get,react}
        ),...contactRealNodes);
    };
    /**
     * 
     * @returns {Boolean}
     */
    RealNode.prototype.checkSelf = function(){return !this.self || this.value === this.self[this.key];};
    RealNode.prototype.checkSet = function(){return true;};
    /**
     * 
     * @param {{}} thisArg 
     * @param {{
     * info?: {} | undefined,
     * self?: {} | undefined,
     * key?: any,
     * checkSet?: (value: any)=>Boolean,
     * get?: ()=>any,
     * react?: ()=>void
     * }} param1 
     */
    RealNode.prototype.constructorCheck = function(thisArg,{info,self,key,checkSet,get,react}){
        if(info instanceof Object) this.info = info;
        else if(void 0 !== info) throw new Error('=> "info" must be Object !');
        if(self instanceof Object){
            if(key === this.key) throw new Error('=> Please set another "key" !');
            else thisArg.self ??= self,thisArg.key ??= key;
        }else if(void 0 !== self) throw new Error('=> "self" must be Object !');
        if(checkSet instanceof Function) thisArg.checkSet = checkSet;
        else if(void 0 !== checkSet) throw new Error('=> "checkSet" must be Function !');
        if(get instanceof Function) thisArg.get = get;
        else if(void 0 !== get) throw new Error('=> "get" must be Function !');
        if(react instanceof Function) thisArg.react = react;
        else if(void 0 !== react) throw new Error('=> "react" must be Function !');
        return thisArg;
    };
    RealNode.prototype.disappear = function(){return RealNode.sys.delete(this.id);};
    RealNode.prototype.fix = function(){this.checkSelf() || (this.self[this.key] = this.value);};
    RealNode.prototype.get = function(){return this.value;};
    /**
     * 
     * @returns {Number}
     */
    RealNode.prototype.notify = function(){
        for(var i = this.contactRealNodes.length;i --> 0;){
            try{RealNode.get(this.contactRealNodes[i]).react?.();}
            catch(e){console.error('=> Can not find RealNode: '+String(this.contactRealNodes[i]));}
        }
        return i;
    };
    RealNode.prototype.set = function(value,reactMode = true,fixMode = false){
        const i = value !== this.value && this.checkSet(value) &&
        (this.value = value,this.checkSelf() || (this.self[this.key] = value),reactMode && this.react?.(),this.notify());
        return fixMode && this.fix(),-1 === i;
    };
    /**
     * 
     * @param {any} value 
     * @param {Boolean} fixMode 
     */
    RealNode.prototype.thenSet = function(value,fixMode){return RealNode.resolveVoid.then(()=>this.set(value,fixMode));};
}
/**
 * 
 * @param {{"key": RealNode | Symbol}} realNodeListObj 
 * @param {...(RealNodePerson | Symbol)} contactPeople 
 */
function RealNodePerson(realNodeListObj,...contactPeople){
    if(!new.target) throw new Error('=> Need "new" before !');
    if(!(realNodeListObj instanceof Object)) throw new Error('=> "realNodeListObj" must be Object !');
    var i;
    const list = Symbol.for('list'),self = Symbol.for('self'),contactList = Symbol.for('contactPeople');
    for(i = (this[contactList] = contactPeople).length;i --> 0;){
        contactPeople[i]?.id && (contactPeople[i] = contactPeople[i].id);
        if(!RealNodePerson.get(contactPeople[i])) throw new Error('=> "contactPeople['+i+']" is not RealNodePerson !');
    }
    this[list] = [];
    this[self] = {};
    for(i of Reflect.ownKeys(realNodeListObj)){
        if(i in this[self]) throw new Error('=> Please use key except '+String(i)+' in "realNodeListObj" !');
        if(RealNode.get(realNodeListObj[i]?.id ?? realNodeListObj[i])){this[list].push(i);this[self][i] = realNodeListObj[i];}
        else if(i instanceof String) throw new Error('=> No found Person "realNodeListObj['+i+']" !');
    }
    this.id = Symbol();
    this.appear();
}
{
    RealNodePerson.aWait = Promise.resolve();
    /**
     * 
     * @this RealNodePerson
     * @param {Symbol} id 
     * @returns {RealNodePerson | undefined}
     */
    RealNodePerson.find = function(id){return this.gov.get(id);}
    RealNodePerson.gov = new Map();
}
{
    RealNodePerson.prototype.appear = function(){RealNodePerson.gov.set(this.id,this);};
    RealNodePerson.prototype.disappear = function(){return RealNodePerson.gov.delete(this.id);};
    RealNodePerson.prototype.get = function(key){return this.search(key).get();};
    RealNodePerson.prototype.fix = function(key){this.search(key).fix();};
    /**
     * 
     * @param {Symbol} id 
     * @param {Symbol[]} realNodeIDs 
     * @param {RealNode} thisArg 
     * @returns {Boolean | never}
     */
    RealNodePerson.prototype.keyReact = function(id,i = -1,realNodeIDs,thisArg = this){
        if(0 > i){
            if(Symbol !== id?.constructor) throw new Error('=> "id" must be Symbol !');
            if(typeof realNodeIDs[Symbol.iterator] !== 'function') throw new Error('=> "realNodeIDs" must be ArrayLike !');
            if(!(this instanceof RealNode || thisArg instanceof RealNode)) throw new Error('=> Either this or "thisArg" must be RealNode !');
        }
        return this instanceof RealNode
        ? realNodeIDs.includes(id) && (this.contactRealNodes.includes(id) || RealNode.get(id).react?.())
        : this.keyReact.call(thisArg,key,0,realNodeIDs,thisArg);
    };
    RealNodePerson.prototype.notify = function(){for(var i of this[Symbol.for('contactPeople')]){RealNodePerson.find(i)?.react?.();}};
    RealNodePerson.prototype.react = function(){
        const self = this[Symbol.for('self')];
        for(var i of this[Symbol.for('list')]){RealNode.get(self[i])?.react?.();}
    };
    RealNodePerson.prototype.search = function(key){
        // return RealNode.get(this[Symbol.for('self')][key]) ?? errorThrow(new Error('=> Can not find RealNode: this['+key+'] !'));
        const realNode = RealNode.get(this[Symbol.for('self')][key]);
        if(realNode) return realNode; else throw new Error('=> Can not find RealNode: this['+key+'] !');
    };
    /**
     * 
     * @returns {Boolean}
     */
    RealNodePerson.prototype.set = function(key,value,fixMode = false){
        var realNode = this.search(key);
        return realNode.set(value,false,fixMode) && (Object.values(this).forEach(this.keyReact,realNode),true);
    };
    /**
     * 
     * @param {Boolean} fixMode 
     * @returns {Promise<Boolean>}
     */
    RealNodePerson.prototype.thenSet = function(key,value,fixMode){
        RealNode.resolveVoid.then(()=>this.search(key)).then(realNode=>realNode.set(value,fixMode),errorThrow);
    };
    RealNodePerson.prototype.toEntries = function(){
        // return Object.entries(this).reduceRight((n,entry,i,arr)=>(entry[1] = RealNode.get(entry[1]).get(),i || arr),0);
        for(var arr = Object.entries(this[Symbol.for('self')]),i = arr.length;i --> 0;){arr[i][1] = RealNode.get(arr[i][1]).get();}
        return arr;
    };
    RealNodePerson.prototype.toObj = function(){return Object.assign({},this[Symbol.for('list')]);};
}
(a=>console.log(a)??console.log(Object.keys(a),RealNodePerson.find(a.id)))(new RealNodePerson({}));