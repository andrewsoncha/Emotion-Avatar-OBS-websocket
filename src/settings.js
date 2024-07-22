import {connectToOBS} from "./obs-module.js"

var inputNameToEmotion = {
    "neutralImgInput": "Neutral",
    "happyImgInput": "Happy",
    "angryImgInput": "Angry",
    "surprisedImgInput": "Surprised",
    "fearfulImgInput": "Fearful",
    "disgustedImgInput": "Disgusted"
};

var emotionToInputName = {
    "Neutral": "neutralImgInput",
    "Happy": "happyImgInput",
    "Angry": "angryImgInput",
    "Surprised": "surprisedImgInput",
    "Fearful": "fearfulImgInput",
    "Disgusted": "disgustedImgInput"
}

var emotionToImgName = {
    "Neutral": "neutralImg",
    "Happy": "happyImg",
    "Angry": "angryImg",
    "Surprised": "surprisedImg",
    "Fearful": "fearfulImg",
    "Disgusted": "disgustedImg"
}

function connectToOBSClick(){
    const serverPort = document.getElementById("websocketPort").value;
    const serverPassword = document.getElementById("websocketPassword").value;
    const keys = Object.keys(emotionToImgName);
    let imageAllLoaded = true;
    keys.forEach((emotion) => {
        const imgName = emotionToImgName[emotion];
        if(imgName=""){
            if(!(emotion in localStorage)){
                alert(emotion+" Image is not Loaded!");
                imageAllLoaded = false;
            }
        }
    });
    if(imageAllLoaded==true){
        connectToOBS(serverPort, serverPassword);
    }
}

function settingsImageUploaded(inputElement, id){
    console.log("inputName:"+inputElement);
    const file = inputElement.files[0];
    let reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result.replace("\^.+,/", "");
        console.log(base64String);
        
        console.log("Src: "+base64String);
        const emotion = inputNameToEmotion[id];
        localStorage.setItem(emotion, base64String);
        document.getElementById(emotionToImgName[emotion]).src = base64String;
    }
    if(file){
        reader.readAsDataURL(file);
    }
}

const inputDictKeys = Object.keys(inputNameToEmotion);
inputDictKeys.forEach((inputName) => {
    let id = inputName;
    console.log("id: "+id);
    const inputElement = document.getElementById(id);
    inputElement.addEventListener("input", () => {
        settingsImageUploaded(inputElement, id);
    });
});

function initImgs(){
    const keys = Object.keys(emotionToImgName);
    keys.forEach((emotion) => {
        const imgName = emotionToImgName[emotion];
        if(imgName=""){
            if(emotion in localStorage){
                const img = localStorage[emotion];
                document.getElementById(imgName).src = img;
            }
        }
    })
}

function redirectFunc(){
    connectToOBSClick();
    location.replace("./index.html");
}

document.getElementById("obsConnectButton").addEventListener("click", connectToOBSClick);
document.getElementById("redirectButton").addEventListener("click", redirectFunc);
initImgs();