
// final to-dos
// 4. re-export audio:   file length, maybe lower bit depth, AND volume normalization
//

//////////
// Source - https://stackoverflow.com/a/75717316
// Posted by Kalnode, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-04, License - CC BY-SA 4.0

// PERMISSION BUTTON
var btn_reqPermission = document.getElementById("btn_reqPermission")
btn_reqPermission.addEventListener("click", () => { this.checkMotionPermission() })


// ON PAGE LOAD
this.checkMotionPermission()


// FUNCTIONS
async function checkMotionPermission() {

    // Any browser using requestPermission API
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {

        // If previously granted, user will see no prompts and listeners get setup right away.
        // If error, we show special UI to the user.
        // FYI, "requestPermission" acts more like "check permission" on the device.
        await DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
            if (permissionState == 'granted') {
                this.setMotionListeners()
            }
        })
        .catch( (error) => {
            console.log("Error getting sensor permission: %O", error)
            // Show special UI to user, suggesting they should allow motion sensors. The tap-or-click on the button will invoke the permission dialog.
            btn_reqPermission.style.display = "block"
        })

    // All other browsers
    } else {
        this.setMotionListeners()
    }

}

const shake_cooldown_min = 100;
const shake_cooldown_variance = 250;
var was_shook = false;

async function setMotionListeners() {
    // Hide special UI; no longer needed
    btn_reqPermission.style.display = "none"

    // MOTION LISTENER
    await window.addEventListener('devicemotion', event => {
        // // SHAKE EVENT
        // // Using rotationRate, which essentially is velocity,
        // // we check each axis (alpha, beta, gamma) whether they cross a threshold (e.g. 256).
        // // Lower = more sensitive, higher = less sensitive. 256 works nice, imho.
        if ((event.rotationRate.alpha > 256 || event.rotationRate.beta > 256 || event.rotationRate.gamma > 256) && !was_shook) {
            was_shook = true;
            handleShake();
            setTimeout(() => {
                was_shook = false;
            }, Math.random() * shake_cooldown_variance + shake_cooldown_min)
        }
    })
}

////////// 


const answerBox = document.querySelector('.fortune')

document.getElementsByTagName("main")[0].addEventListener("click", function () {
    startNewFortune()
});

const delay = ms => new Promise(res => setTimeout(res, ms));

const shake_sounds = [
    'sfx_shake_1',
    'sfx_shake_2',
    'sfx_shake_3',
    'sfx_shake_4',
];

// indices are...
// 0 = text that will appear on the 8-ball
// 1 = used to construct the ID of the audio tag to be played (id is composed of yes/no/maybe and this number)
// 2 = additional text delay (to line up text with longer audio. note that the text determines when we can roll again)
const fortunes_yes = [
    ['💕It is certain💕', 1],
    ['Alright 😉', 2],
    ['😲 Without a doubt!', 3],
    ['Signs point to maybe 😌', 4],
    ["I'm absolutely positive 🙂‍↕️", 5],
    ['Of course! ☺️', 6],
    ['Yes! 🤗', 7],
    ['Sure! 🥳', 8],
    // ['😙 Outlook good', 9],
    ['Signs point to yeah! 😚', 10],
    // ['Without a doubt', 12],
    ['Yes. 🫪', 13],
    ['😐 Yep ', 14],
    ['Yes? 🤷‍♀️', 15, 400],
    ['😐 yuh.', 16],
    ['🙂 Yes', 17],
    ['☺️ Yes!', 18, 800 ],
    ["Signs point to yes! But don't tell nobody 🤫", 19]



    // ['Most likely', 11], // bad audio
]

const fortunes_neutral = [
    [ 'Reply hazy, ask another time 😏', 1],
    [ 'Ask again. But this time make it REAL 💪', 2],
    [ 'Ask again', 3],
    [ "Now you know! 🏳️‍🌈 Ask again", 4],
    // ["DO you know what you're saying? If so, ask again!", 5],
    ['I could be lying 😈', 6],
    ['🤨 Ask again', 7],
    ["I think we're gonna find out 💪", 8],
    ['😅', 9],
    ['Please repeat the question 😑', 10],
    ["😒 Ask again", 11],
    ["Ask again...? 😳", 12],
    ["🫩 Ask another time", 13],
    ["Outlook is: none of your business! 😤", 14],
    ['😳 Ask again', 15],
    ['🫠', 16],
    ["Can't say 😑 walls too thin.", 17],
    ['Maybe 😅', 18],
    ['...and ask again? 🥰', 20, 300],
    ['Ask again. Trust me! ☺️', 21]

]

const fortunes_no = [
    [ "😦", 1 ],
    [ '🫤 No?', 2],
    [ '😒 Very doubtful', 3],
    ['Not exactly 🙂‍↔️', 4],
    ['Not a good idea ☹️', 5],
    [ 'Outlook not so good, Sue 🙍‍♀️', 6],
    ['Not looking good 😖', 8],
    // ["I don't think so", 9],
    // ['Outlook not so good', 10],
    ['Doubtful 😢', 11],
    // ['My sources say no', 12],
    ['My reply is no 🥺', 14],



    // ['😟', 7], // little too intense compared to everything else lol
    // ['My reply is no', 13], // bad audio, boring clip
]

async function fadeIn() {
    answerBox.removeAttribute('hidden');

    answerBox.animate([
        // default translation is -50,-50 -- see css file
        { transform: 'translate(-49%, -49%) rotate(0deg)' },
        { transform: 'translate(-51%, -52%) rotate(-1deg)'},
        { transform: 'translate(-53%, -50%) rotate(1deg)'},
        { transform: 'translate(-47%, -48%) rotate(0deg)'},
        { transform: 'translate(-49%, -51%) rotate(1deg)'},
        { transform: 'translate(-51%, -48%) rotate(-1deg)'},
        { transform: 'translate(-53%, -49%) rotate(0deg)'},
        { transform: 'translate(-47%, -49%) rotate(-1deg)'},
        { transform: 'translate(-51%, -51%) rotate(1deg)'},
        { transform: 'translate(-49%, -49%) rotate(-1deg)'},
        { transform: 'translate(-50%, -50%) rotate(0deg)'},
    ],
    {
        duration: 500
    });
    return answerBox.animate([
        { opacity: 0 },
        { opacity: 1 }
    ],
    {
        duration: 1000
    })
    .finished.then(function() {
        resetForNextFortune();
    });
}

async function fadeOut() {
    answerBox.animate([
        // default translation is -50,-50 -- see css file
        { transform: 'translate(-47%, -47%) rotate(0deg)' },
        { transform: 'translate(-53%, -56%) rotate(-1deg)'},
        { transform: 'translate(-59%, -50%) rotate(1deg)'},
        { transform: 'translate(-41%, -41%) rotate(0deg)'},
        { transform: 'translate(-47%, -53%) rotate(1deg)'},
        { transform: 'translate(-53%, -41%) rotate(-1deg)'},
        { transform: 'translate(-59%, -47%) rotate(0deg)'},
        { transform: 'translate(-41%, -47%) rotate(-1deg)'},
        { transform: 'translate(-53%, -53%) rotate(1deg)'},
        { transform: 'translate(-47%, -47%) rotate(-1deg)'},
        { transform: 'translate(-50%, -50%) rotate(0deg)'},
    ],
    {
        duration: 500
    });

    return answerBox.animate([
        { opacity: 1 },
        { opacity: 0 }
    ],
    {
        duration: 500
    })
    .finished.then(function() { 
        // dont know why i cant just set opacity -- not a web developer
        // just going to hide the entire element instead
        answerBox.setAttribute('hidden', true);
    });
}

// so we dont get the same sound back-to-back. 
// probaby preferable for fortunes, but necessary for "shake" audio given my choice to use one audio tag for each sound effect
// to prevent the audio from cutting off 
function getNonRepeatIndex(length, old_index) {
    const index = Math.floor(Math.random()*length);
    if (index === old_index) {
        return (index + 1) % length;
    }
    return index;
}

var last_fortune_index = -1;
function selectFortuneOfType(fortune_array) {
    last_fortune_index = getNonRepeatIndex(fortune_array.length, last_fortune_index);

    return fortune_array[last_fortune_index];
}

const play_each_once = true
// this function also increments the play count
function getPseudoRandomFortune(fortunes, playcounts) {
    if (play_each_once) {
        unplayed_indices = [];
        for (var i = 0; i < playcounts.length; ++i) {
            if (playcounts[i] === 0) {
                unplayed_indices.push(i);
            }
        }
        console.log(unplayed_indices);
        if (unplayed_indices.length > 0) {
            var index = unplayed_indices[ Math.floor(Math.random() * unplayed_indices.length) ];
            playcounts[index] += 1;
            return fortunes[index];
        }
    }
    
    return fortunes[ Math.floor(Math.random() * fortunes.length) ];
}

async function clearFortuneText() {
    return fadeOut();
}

async function showFortuneText(text) {
    answerBox.textContent = `${text}`
    answerBox.setAttribute('class', 'fix-font')
    return fadeIn();
}

function preloadAudio(id) {
    var audio = document.getElementById(id);
    audio.preload = true;
}

function playFortuneAudio(id) {
    // console.log(id);
    var audio = document.getElementById(id);
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

var playcounts_yes = new Array(fortunes_yes.length).fill(0);
var playcounts_no = new Array(fortunes_no.length).fill(0);
var playcounts_maybe = new Array(fortunes_neutral.length).fill(0);

function getFortune() {
    // the odds of getting a yes/no/ask-again
    const p_yes = .5;
    const p_no = .25;
    const p_ask_again = .25;
    const p_sum = p_yes + p_no + p_ask_again;

    const p = Math.random() * p_sum;
    var result;
    var id;
    if (p <= p_yes) {
        result = getPseudoRandomFortune(fortunes_yes, playcounts_yes);
        id = 'sfx_yes_' + result[1];
    }
    else if (p <= p_no + p_yes) {
        result = getPseudoRandomFortune(fortunes_no, playcounts_no);
        id = 'sfx_no_' + result[1];
    }
    else {
        result = getPseudoRandomFortune(fortunes_neutral, playcounts_maybe);
        id = 'sfx_neutral_' + result[1];
    }
    if (result.length >= 3) {
        return [ result[0], id, result[2] ];
    }
    else {
        return [ result[0], id ];
    }
}

function presentFortune(fortune) {
    var text_delay = 200;
    if (fortune.length >= 3) {
        text_delay += fortune[2];
    }
    setTimeout( () => showFortuneText(fortune[0]) , text_delay);
    setTimeout( function() { playFortuneAudio(fortune[1]) }, 0);
}

var last_shake_index = -1;
function playShakeAudio() {
    last_shake_index = getNonRepeatIndex(shake_sounds.length, last_shake_index);
    const sfx_shake = document.getElementById(shake_sounds[last_shake_index]);
    sfx_shake.volume = 0.4; // cant set this in html?

    // console.log(last_shake_index)
    sfx_shake.pause();
    sfx_shake.currentTime = 0;
    sfx_shake.play();
}


var timer_id = -1; // save the fortune timer so we can restart -- enables repeated shakes

var cleared_fortune = false; // because we only want to play the "fade-out" animation once
var shaking_disabled = false; // briefly disable shaking while showing the fortune to ignore accidental shakes

var saved_fortune = null; // save a fortune as soon as we start shaking -- so we can load the audio file without delay

// reset the variables we use to gate the stages of showing the fortune
function resetForNextFortune() {
    timer_id = -1;
    cleared_fortune = false;
    shaking_disabled = false;
    saved_fortune = null;
}

// try to start a new fortune
async function startNewFortune() {
    // if we are in the process of displaying a new fortune, prevent shaking
    if (shaking_disabled) {
        return;
    }

    playShakeAudio();

    // play the fade-out animation, but only once
    if (!cleared_fortune) {
        saved_fortune = getFortune();
        preloadAudio(saved_fortune[1]);

        await delay(100); // clear text a little later than the audio cue
        cleared_fortune = true;
        await clearFortuneText();
    }

    // if we already shook but the fortune hasn't started appearing, reset the timer
    var delay_min = 1000;
    if (timer_id > 0) {
        window.clearTimeout(timer_id);
        delay_min += 400;
    }

    const delay_variance = 500;
    timer_id = window.setTimeout(function() {
        shaking_disabled = true;
        presentFortune(saved_fortune);
    }, Math.random() * delay_variance + delay_min)
}

function handleShake(event) {
    startNewFortune();
}