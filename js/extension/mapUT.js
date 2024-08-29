'use strict';
GM = GM.then(protoGM=>class GM extends protoGM{
    get mapArrayUT(){return GM.mapArrayUT;}
    static mapArrayUT = new protoGM.Map_list({},function(value,key){this[value[0]] = key;},[
        ['_',['./img/bg.png','./img/林元.jpg','./img/林元.jpg',,'./img/林元.jpg']]
    ])
});