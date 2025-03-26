import {connectToOBS, getVideoCaptureList, saveVideoCaptureList, getWebcamSourceScreenshot} from "./obs-module.js"

const inputNameToEmotion = {
	"neutralImgInput": "Neutral",
	"happyImgInput": "Happy",
	"angryImgInput": "Angry",
	"sadImgInput": "Sad",
	"surprisedImgInput": "Surprised",
	"fearfulImgInput": "Fearful",
	"disgustedImgInput": "Disgusted"
};

const emotionToInputName = {
	"Neutral": "neutralImgInput",
	"Happy": "happyImgInput",
	"Angry": "angryImgInput",
	"Sad": "sadImgInput",
	"Surprised": "surprisedImgInput",
	"Fearful": "fearfulImgInput",
	"Disgusted": "disgustedImgInput"
}

const emotionToImgName = {
	"Neutral": "neutralImg",
	"Happy": "happyImg",
	"Angry": "angryImg",
	"Sad": "sadImg",
	"Surprised": "surprisedImg",
	"Fearful": "fearfulImg",
	"Disgusted": "disgustedImg"
}

function connectToOBSClick(){
	const serverPort = document.getElementById("websocketPort").value;
	const serverPassword = document.getElementById("websocketPassword").value;
	const storageItem = localStorage.getItem('useAuth');
	const useAuth = (storageItem === undefined)? document.getElementById("websocketPassword").value:storageItem;
	const keys = Object.keys(emotionToImgName);
	let imageAllLoaded = true;
	keys.forEach((emotion) => {
	const imgName = emotionToImgName[emotion];
	if(imgName==""){
	    if(!(emotion in localStorage)){
		alert(emotion+" Image is not Loaded!");
		imageAllLoaded = false;
	    }
	}
	});
	if(imageAllLoaded==true){
	connectToOBS(serverPort, serverPassword, useAuth).then(() => {
		alert("Succesfully Connected to OBS!");
		localStorage.setItem('serverPort', serverPort);
		localStorage.setItem('serverPassword', serverPassword);	
		localStorage.setItem('useAuth', useAuth);
		const selectItem = document.getElementById('inputSelect');
		saveVideoCaptureList(selectItem);
		console.log("videoCaptureList:");
		console.log(localStorage.getItem("videoInputList") );
	});
	}
}

function selectInputClick(){
	const currentlySelectedVal = document.getElementById("inputSelect").value;
	const inputDict = JSON.parse(localStorage.getItem("videoInputList"));
	if(inputDict===undefined){
		alert("video inputs not properly saved in localstorage!");
	}
	if(currentlySelectedVal==="None"||inputDict[currentlySelectedVal]===undefined){
		alert("Please select a valid Video Input!");
		return;
	}
	alert("selectedInput:"+currentlySelectedVal+"      uuid:"+inputDict[currentlySelectedVal]);
	localStorage.setItem("selectedInputName", currentlySelectedVal); 
	localStorage.setItem("selectedInputUUID", inputDict[currentlySelectedVal]);
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
        localStorage.setItem(emotionToImgName[emotion], base64String);
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
        if(imgName==""){
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
document.getElementById("selectInputButton").addEventListener("click", selectInputClick);
//document.getElementById("redirectButton").addEventListener("click", redirectFunc);
initImgs();
