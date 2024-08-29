'use strict';
GM = GM.then(protoGM=>class GM extends protoGM{
    get itemArray(){return GM.itemArray;}
    static listItemArray(value,key){this[value.type].push(key);}
    static itemArray = {
        onceArray: new protoGM.Map_list({
            '恢复': [],
            '成长': [],
            '功能': [],
            '战斗': [],
            '材料': [],
            '杂类': []
        },GM.listItemArray,[
            ['绷带',{
                type: '恢复',
                display: './img/无名剑客.jpg',
                note: '',
                fn(){}
            }],
            ['气血丹',{
                type: '成长',
                display: './img/林元.jpg',
                note: '',
                fn(){}
            }]
        ]),
        twiceArray: new protoGM.Map_list({
            '恢复': [],
            '成长': [],
            '功能': [],
            '战斗': [],
            '道具': []
        },GM.listItemArray,[
            ['绷带',{
                type: '恢复',
                display: './img/无名剑客.jpg',
                note: '',
                fn(){}
            }],
            ['气血丹',{
                type: '成长',
                display: './img/林元.jpg',
                note: '',
                fn(){}
            }]
        ]),
        onfitArray: new protoGM.Map_list({
            '头部': [],
            '饰品': [],
            '上肢': [],'上衣': [],'内衣': [],
            '下肢': [],'下裤': [],'内裤': [],
            '足部': []
        },GM.listItemArray,[
            ['绷带',{
                type: '上肢',
                display: './img/无名剑客.jpg',
                note: '',
                fn(){}
            }],
            ['长袍',{
                type: '上衣',
                display: './img/林元.jpg',
                note: '',
                fn(){}
            }]
        ])
    };
});