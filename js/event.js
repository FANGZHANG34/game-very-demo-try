'use strict';
GM = GM.then(protoGM=>class GM extends protoGM{
    get eventArray(){return GM.eventArray;}
    static eventArray = new class extends Map{
        list = {};
        /**
         * 
         * @param {String} beginEventName 
         */
        getStoryByEvent(beginEventName){
            const story = [beginEventName];
            while(true){
                if(!this.get(story.at(-1))){return story;}else{story.push(this.get(story.at(-1))[2]);}
                if(story.at(-2) === (story.at(-1) || story.at(-2))){return story;}
            }
        }
        constructor(){
            super(...arguments);
            this.forEach(function(value,key){this[key] = value[0];},this.list);
        }
    }([
        ['0',[
            '开始',(id = 1)=>{
                protoGM.instance.bgm.loader([
                    '刀郎 - 风向朝西.opus','刀郎 - 奇台三十里.opus'
                ]),
                protoGM.instance.gameMessage.loader(
                    {name: memoryHandle('characterArray.'+id+'.name'),faceUrl: memoryHandle('characterArray.'+id+'.face')},
                    {text: `想要做什么事？`,audioUrl: '',videoUrl: '',imageUr: ''},
                    {
                        听歌: GM.eventArray.get('1')[1],
                        看片: GM.eventArray.get('2')[1],
                        看动画: GM.eventArray.get('3')[1],
                        战斗: GM.eventArray.get('4')[1],
                        无: ()=>(memoryHandle('mapDataArray.001.nowFn','w','mainLine'),protoGM.instance.gameMessage.changeTailFinallyFn().closer())
                            // protoGM.instance.playerMove.paused = false;
                            // protoGM.instance.gameMessage.option.finallyFn = null;
                            // protoGM.instance.gameMessage.option.ended = true;
                    },
                    GM.eventArray.get('0')[1]
                );
            },
            '0'
        ]],
        ['1',[
            '听歌',()=>protoGM.instance.gameMessage.loader(
                {name: '林元',faceUrl: memoryHandle('characterArray.'+1+'.face')},
                {text: 
`又到了一更时分身后传来敲门声
总在失魂散乱的夜里出现两个人
一阵儿欢心一阵儿惊惧
这命中带着病啊
只是春风吹乱了桃花林
错把痰唾上了身
这是个临行前的盛会一杯接一杯
我们开始纵情地哀嚎不再躬身肃立
总是在回忆总是在希冀
没有一刻能停啊
于是青冢邂逅了公子笑
从此薤露世上珍
君既不能解我忧 为何问我夜独行
穷途哪有星月光 公子为何慕皮囊
空荡泉台寂无声 执笔采花做凡尘
等过畅往烟消云散 世上少见有心人`,audioUrl: './audio/100-画皮.opus',videoUrl: '',imageUrl: './img/art_bg.png'},
                {}
            )
        ]],
        ['2',[
            '看片',()=>protoGM.instance.gameMessage.loader(
                {name: '林元',faceUrl: memoryHandle('characterArray.'+1+'.face')},
                {text: '',audioUrl: '',videoUrl: './video/Never Gonna Give You Up.webm' || './video/◇魔法闘姫フロスティア_オープニングアニメ.webm',imageUrl: ''},
                {}
            )
        ]],
        ['3',[
            '看动画',()=>loadCartoon({timeSep: 100,mode: 2}).then(()=>console.log('cartoon complete')).then(()=>protoGM.instance.gameMessage.closer())
        ]],
        ['4',[
            '战斗',()=>protoGM.instance.undertaleManager.loader(1,{closerFn(){protoGM.instance.gameMessage.closer();}})
        ]],
        ['5',[
            '换人',()=>protoGM.instance.gamePlayer.loader(+!protoGM.instance.gamePlayer.id,[4,0,+!protoGM.instance.gamePlayer.id])
        ]],
        ['mainLine',[
            '主线',()=>protoGM.instance.gameMessage.loadMessageConcat('0',...'12345'.split('').map(str=>'step'+str))
        ]],
        ['step1',[
            '',()=>protoGM.instance.gameMessage.loader({name: '林元',faceUrl: memoryHandle('characterArray.'+1+'.face')},{text: 'step1'})
        ]],
        ['step2',[
            '',()=>protoGM.instance.gameMessage.loader({name: '林元',faceUrl: memoryHandle('characterArray.'+1+'.face')},{text: 'step2'})
        ]],
        ['step3',[
            '',()=>protoGM.instance.gameMessage.loader({name: '林元',faceUrl: memoryHandle('characterArray.'+1+'.face')},{text: 'step3'})
        ]],
        ['step4',[
            '',()=>protoGM.instance.gameMessage.loader({name: '林元',faceUrl: memoryHandle('characterArray.'+1+'.face')},{text: 'step4'})
        ]],
        ['step5',[
            '',()=>protoGM.instance.gameMessage.loader({name: '林元',faceUrl: memoryHandle('characterArray.'+1+'.face')},{text: 'step5'})
        ]]
    ]);
});