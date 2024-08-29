'use strict';
GM = GM.then(protoGM=>class GM extends protoGM{
    get mapDataArray(){return GM.mapDataArray;}
    static mapDataArray = new Map([
        ['001',{
            nowFn: '0',
            viewArray: [
                [
                    ['helloworld0.png',0,0],
                ],
                [
                    ['helloworld1.png',0,0],
                ],
                [
                    ['helloworld2.png',0,0],
                ],
                [
                    ['helloworld3.png',0,0],
                ]
            ],
            zoneArray: [
                [
                    //         1         2         3         4         5  n      6         7
                    //12345678901234567890123456789012345678901234567890123456789012345678901234567890
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000,
                    0b00000000000000000000000000000000
                ],[
                    //         1         2         3         4         5  n      6         7
                    //12345678901234567890123456789012345678901234567890123456789012345678901234567890
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111,
                    0b00000000000000000000000000000111
                ],[
                    //         1         2         3         4         5  n      6         7
                    //12345678901234567890123456789012345678901234567890123456789012345678901234567890
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010,
                    0b00000000000000011011111101010010
                ],[
                    //         1         2         3         4         5  n      6         7
                    //12345678901234567890123456789012345678901234567890123456789012345678901234567890
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010,
                    0b00000000000111010100101101000010
                ]
            ],
            characterArray: [
                {id: 0,xyz: [5,2,0]},
                {id: 1,xyz: [9,1,1]}
            ],
            eventArray: [
                [0,0,null,'1'],
                [1,0,null,'2'],
                [2,0,null,'3'],
                [3,0,null,'4'],
                [4,0,null,'5']
            ]
        }]
    ]);
});