"use strict";

const time = document.getElementById('time');
const start = document.getElementById('start');
const reStart = document.getElementById('reStart');
const lap = document.getElementById('lap');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const date = document.getElementById('date');
const startLap = document.getElementById('startLap');
const lapArea = document.getElementById('lapArea');
const csv = document.getElementById('csv');
const lapText = document.getElementById('lapText');

// 現在の日時
window.onload = function(){
    clock();
}

function clock() {
    let nowTime = new Date();
    let nowYear = nowTime.getFullYear();
    let nowMonth = nowTime.getMonth()+1;
        nowMonth = ('0' + nowMonth).slice(-2);
    let nowDate = ("0" + nowTime.getDate() ).slice(-2);
    let nowDay_arr = ['日','月','火','水','木','金','土'];
    let nowDay = nowDay_arr[nowTime.getDay()];
    let nowHour = ("0" + nowTime.getHours() ).slice(-2);
    let nowMin  = ("0" + nowTime.getMinutes() ) .slice(-2);
    let nowSec  = ("0" + nowTime.getSeconds() ).slice(-2);
    let str = 
    `<span style="color: #787c87; font-size:3rem;">
        ${nowYear} <span style="color: #787c87; font-size:2.8rem;"> / </span>
        ${nowMonth} <span style="color: #787c87; font-size:2.8rem;"> / </span>
        ${nowDate} <span style="color: #787c87; font-size:2.8rem;"> / </span>
        ${nowDay} <span style="color: #787c87; font-size:2.8rem;"> / </span>
        ${nowHour} <span style="color: #787c87; font-size:2.8rem;"> : </span>
        ${nowMin} <span style="color: #787c87; font-size:2.8rem;"> : </span>
        ${nowSec}
    </span>`;
    date.innerHTML = str;
}   setInterval('clock()',1000);

//カウントアップタイマー部分
let countUpstartTime;
let elapsedTime = 0;
let timerId;
let timeToAdd = 0;

function updateTimeText(){
    let h = Math.floor(elapsedTime / 3600000);
    let m = Math.floor(elapsedTime / 60000);
    let s = Math.floor(elapsedTime % 60000 / 1000);
    let ms = elapsedTime % 1000;

    h = ('0' + h).slice(-2); 
    m = ('0' + m).slice(-2); 
    s = ('0' + s).slice(-2);
    ms = ('00' + ms).slice(-3);

    timer.innerHTML = `
    ${h}<span style="color:#787c87; font-size:6rem;">h</span>
    ${m}<span style="color:#787c87; font-size:6rem;">min</span>  
    ${s}<span style="color:#787c87; font-size:6rem;">sec </span> 
    ${ms}<span style="color:#787c87; font-size:6rem;">msec</span> 
    `;
}

function updateTimeTextReset(){
    let h = 0;
    let m = 0;
    let s = 0;
    let ms = 0;

    h = ('0' + h).slice(-2); 
    m = ('0' + m).slice(-2); 
    s = ('0' + s).slice(-2);
    ms = ('00' + ms).slice(-3);

    timer.innerHTML = `
    ${h}<span style="color:#787c87; font-size:6rem;">h</span>
    ${m}<span style="color:#787c87; font-size:6rem;">min</span>  
    ${s}<span style="color:#787c87; font-size:6rem;">sec </span> 
    ${ms}<span style="color:#787c87; font-size:6rem;">msec</span> 
    `;
}

function countUp(){
    timerId = setTimeout(function(){
    elapsedTime = Date.now() - countUpstartTime + timeToAdd;
    updateTimeText()
    countUp();
    },10);
}

stop.disabled = true;


let startTime;
let endTime;
let calTime;

let startCount = 0;
let stopCount = 0;

start.addEventListener('click',function(){
    if(startCount >= 0 && stopCount == 0 && elapsedTime == 0){
        countUpstartTime = Date.now();
        countUp();
        startLapText();
        endLapText();
        elapsedTimeText();
        programTitleText();
        createStartLap();
        createInput();



        stop.disabled = false;
        stop.style.pointerEvents = "auto";
        stop.style.backgroundColor = '#f46665';
        stop.style.boxShadow = '0px 0px 0px 6px #f46665';;

        stop.style.color = 'white';

        start.innerHTML = 'LAP';
        start.style.backgroundColor = '#8365f4';
        start.style.boxShadow = '0px 0px 0px 6px #8365f4';;
        start.style.color = 'white';


        
        const showLapArea = document.getElementById('lapArea');
        showLapArea.style.visibility ="visible";

        const showLapAreaContainer = document.getElementById('lapAreaContainer');
        showLapAreaContainer.style.visibility ="visible";

    } else if(startCount >= 0 && stopCount == 0 && elapsedTime >= 1) {
        createEndLap();
        createCalLap();
        createInput();
        createStartLap();

        // スクロールバーを下部で固定
        const scrollBar = document.getElementById('lapArea');
        scrollBar.scrollTop = scrollBar.scrollHeight;
        window.scroll(0, y);

        } else if (startCount >= 0 && stopCount == 1){
            stop.disabled = false;
            create_csv();
        } 


    startCount++;

});

stop.addEventListener('click',function(){
    if(startCount >= 1 && stopCount == 0){
        confirmFix();
    } else if(startCount >= 1 && stopCount == 1){
        confirmReset();
}
});

function confirmFix(){
    let confirm = window.confirm('計測データを確定します。よろしいですか？')
    if(confirm){
    clearTimeout(timerId);

    start.disabled = false;
    stop.disabled = false;

    start.innerHTML = 'CSV';
    stop.innerHTML = 'RESET';

    start.style.backgroundColor = '#839ACC';
    start.style.boxShadow = '0px 0px 0px 6px #839ACC';;
    start.style.color = '#FDFDFD';

    stop.style.backgroundColor = '#E30075';
    stop.style.boxShadow = '0px 0px 0px 6px #E30075';;
    stop.style.color = '#FDFDFD';
    
    startLap.lastElementChild.remove();
    lapText.lastElementChild.remove();

    csvStartLapPop();
    csvProgramTitlePop()

    stopCount++;

    } else {
        stopCount - 1;
    }
}

function confirmReset(){
    let confirm = window.confirm('データは戻ってきません。リセットしますか？')
    if(confirm){
        csv_startTime.length = 0;
        csv_endTime.length = 0;
        csv_elapsedTime.length = 0;
        csv_programTitle.length = 0;
        startLap.innerHTML = "";
        endLap.innerHTML = "";
        calLap.innerHTML = "";
        lapText.innerHTML = "";
        let startLapText = document.getElementById('startLapText');
        let endLapText = document.getElementById('endLapText');
        let elapsedTimeText = document.getElementById('elapsedTimeText');
        let programTitleText = document.getElementById('programTitleText');
        startLapText.innerHTML = "";
        endLapText.innerHTML = "";
        elapsedTimeText.innerHTML = "";
        programTitleText.innerHTML = "";
        lapAreaContainer.style.visibility = "hidden";
        lapArea.style.visibility = "hidden";
        updateTimeTextReset();
        elapsedTime = 0;
        startCount = 0;
        stopCount = -1;
        i = 0;

        start.innerHTML = 'START';
        start.style.backgroundColor = '#659DF5';
        start.style.color = '#fdfdfd';
        start.style.boxShadow = '0px 0px 0px 6px #659df5';;

        stop.innerHTML = 'FINISH!';
        stop.style.backgroundColor = '#545557';
        stop.style.boxShadow = '0px 0px 0px 6px #545557';;

        stop.style.color = '#e8e8e9';
        stop.style.pointerEvents = "none";

        stopCount++;

    } else {
        stopCount - 1;
    }
}

let msec;
let sec;
let min;
let hour;

function calc(s, t){
    t = t + (9 * 60) * 60 * 1000;

    min = Math.floor(t / 1000 / 60) % 60;
    hour = Math.floor(t / 1000 / 60 / 60) % 24;

    sec = s;

    sec = ("0" + s ).slice(-2)
    min = ("0" + min ).slice(-2)
    hour = ("0" + hour ).slice(-2)
}

function calcJST(s, t){
    min = Math.floor(t / 1000 / 60) % 60;
    hour = Math.floor(t / 1000 / 60 / 60) % 24;

    sec = s;

    sec = ("0" + s ).slice(-2)
    min = ("0" + min ).slice(-2)
    hour = ("0" + hour ).slice(-2)
}

let startTimeSec;
let endTimeSec;


function createStartLap(){
    startTime = new Date().getTime();
    startTimeSec = new Date().getSeconds();

    calc(startTimeSec, startTime);

    const li_data = document.createElement('li');
    const startLap = document.getElementById('startLap');
    startLap.appendChild(li_data);
    li_data.innerHTML = 
    `<li style="color: #fdfdfd; font-size: 2rem;">
    ${hour} : 
    ${min} : 
    ${sec}
    </li>
    `;
    if(csv_startTime == 0){
        csv_startTime.push(hour + ':' + min + ':' + sec);
    } else {
        csv_startTime.push(hour + ':' + min + ':' + sec);

    }

};

function csvStartLapPop(){
    csv_startTime.pop();
};

function startLapText(){
const headText = document.createElement('p');
const startLapText = document.getElementById('startLapText');
startLapText.appendChild(headText);
headText.innerHTML = 
`<li style="color: #787C87; font-size: 2rem;">Start Lap</li>
`;
}

function createEndLap(){
    endTime = new Date().getTime();
    endTimeSec = new Date().getSeconds();

    calc(endTimeSec, endTime);

    const li_data = document.createElement('li');
    const endLap = document.getElementById('endLap');
    endLap.appendChild(li_data);
    li_data.innerHTML = 
    `<li style="color: #fdfdfd; font-size: 2rem;">
    ${hour} : 
    ${min} : 
    ${sec}
    </li>
    `;
    csv_endTime.push(hour + ':' + min + ':' + sec);

}

function endLapText(){
    const headText = document.createElement('p');
    const endLapText = document.getElementById('endLapText');
    endLapText.appendChild(headText);
    headText.innerHTML = 
    `<li style="color: #787C87; font-size: 2rem;">End Lap</li>
    `;
    }

function createCalLap(){
    calTime = endTime - startTime;
    sec = endTimeSec - startTimeSec;

    if(sec < 0){
        sec = (60 + endTimeSec) - startTimeSec;   
    }

    calcJST(sec, calTime);

    const li_data = document.createElement('li');
    const calLap = document.getElementById('calLap');
    calLap.appendChild(li_data);
    li_data.innerHTML = 
    `<li style="color: #fdfdfd; font-size: 2rem;">
    ${hour} : 
    ${min} : 
    ${sec}
    </li>
    `;

    csv_elapsedTime.push(hour + ':' + min + ':' + sec);

}

function elapsedTimeText(){
    const headText = document.createElement('p');
    const elapsedTimeText = document.getElementById('elapsedTimeText');
    elapsedTimeText.appendChild(headText);
    headText.innerHTML = 
    `<li style="color: #787C87; font-size: 2rem;">Elapsed Time</li>
    `;
    }

let i = 0;

function createInput(){
    const createInput = document.createElement('input');
    createInput.id = 'input' + i;
    createInput.setAttribute('type', 'text');
    createInput.setAttribute('placeholder','Program Title');
    lapText.appendChild(createInput);
    i++;

}


function csvProgramTitlePop(){
    csv_programTitle.pop();
};

function programTitleText(){
    const headText = document.createElement('p');
    const programTitleText = document.getElementById('programTitleText');
    programTitleText.appendChild(headText);
    headText.innerHTML = 
    `<li style="color: #787C87; font-size: 2rem;">Program Title</li>
    `;
    }

// inputをEnterで移動させる処理
function keydown(e){
    if(e.keyCode === 13){
    const obj = document.activeElement;
    obj.nextElementSibling.focus();
    }
}
window.onkeydown = keydown;

let csv_data = [];
let csv_startTime = [];
let csv_endTime = [];
let csv_elapsedTime = [];
let csv_programTitle = [];

function create_csv(){

    //文字列型で二次元配列のデータ
    csv_data = [['Start Time','End Time','Elapsed Time', 'Program Title']]

    for (let i = 0; i < csv_endTime.length; i++ ) {
        let input = document.getElementById('input' + i).value;
        csv_programTitle.push(input);
        console.log(csv_programTitle);
        csv_data.push([csv_startTime[i], csv_endTime[i], csv_elapsedTime[i], csv_programTitle[i]])

    }
                
    // 作った二次元配列をCSV文字列に直す。
    let csv_string  = ''; 

    for (let d of csv_data) {
        csv_string += d.join(',');
        csv_string += '\r\n';
    }   

    //ファイル名の指定
    let file_name   = 'EventLap.csv';

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);

    //CSVのバイナリデータを作る
    let blob        = new Blob([bom, csv_string], {type: 'text/csv'});
    let uri         = URL.createObjectURL(blob);

    //リンクタグを作る
    let link        = document.createElement('a');
    link.download   = file_name;
    link.href       = uri;

    //作ったリンクタグをクリックさせる
    document.body.appendChild(link);
    link.click();

    csv_programTitle.length = 0;


}
