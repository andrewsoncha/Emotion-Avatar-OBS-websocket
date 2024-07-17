import {connectToOBS} from "./obs-module.js"

var inputNameToEmotion = {
    "neutralImgInput": "Neutral",
    "happyImgInput": "Happy",
    "angryImgInput": "Angry",
    "surprisedImgInput": "Surprised",
    "fearfulImgInput": "Fearful",
    "disgustedImgInput": "Disgusted"
};

function connectToOBSClick(){
    const serverPort = document.getElementById("websocketPort").value;
    const serverPassword = document.getElementById("websocketPassword").value;
    connectToOBS(serverPort, serverPassword);
}

function settingsImageUploaded(inputElement, id){
    console.log("inputName:"+inputElement);
    const file = inputElement.files[0];
    let reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result.replace("\^.+,/", "");
        console.log(base64String);
        
        console.log("Src: "+base64String);
        localStorage.setItem(inputNameToEmotion[id], base64String);
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

function redirectFunc(){
    connectToOBSClick();
    location.replace("./index.html");
}

document.getElementById("obsConnectButton").addEventListener("click", connectToOBSClick);
document.getElementById("redirectButton").addEventListener("click", redirectFunc);