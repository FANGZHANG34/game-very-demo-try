'use strict';
timeRecord(GM = GM.then(GM=>
    timeRecord(()=>(console.log('=> Load window in',GM.tBefore,'ms\n--    Class GM in',Date.now() - GM.t0,'ms'),new GM)).
    then(record=>(console.log('=> New GM in',record.time,'ms'),record.value))
)).then(async({time})=>(GM = await GM,console.log('=> Total in',time,'ms'))).catch(e=>console.error(e));