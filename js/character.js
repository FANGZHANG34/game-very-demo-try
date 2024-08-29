'use strict';
GM = GM.then(protoGM=>class GM extends protoGM{
    get characterArray(){return GM.characterArray;}
    static characterArray = new class extends Map{
        list = [];
        /**
         * 
         * @param {String} name 
         * @param {undefined | String} key 
         * @returns {{} | any}
         */
        getByName(name,key){
            const id = this.list.indexOf(name);
            return key ? memoryHandle('characterArray.'+id+'.'+key) : this.get(id);
        }
        constructor(){
            super(...arguments);
            this.forEach(function(value,key){this[key] = value.name;},this.list);
        }
    }([
        [0,{
            zone: false,
            selfEvent: null,
            name: '无名剑客',
            display: './img/wmjk.png',
            face: './img/actor0.jpg',
            photo: './img/actor0.jpg'
        }],
        [1,{
            zone: false,
            selfEvent: null,
            name: '林元',
            display: './img/actor1.jpg',
            face: './img/actor1.jpg',
            photo: './img/actor1.jpg'
        }]
    ]);
});