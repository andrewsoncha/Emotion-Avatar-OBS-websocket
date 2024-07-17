import {changeScene, changeSceneWithObj, getWebcamSourceScreenshot} from "./obs-module.js"
import {detectFromImage} from "./face_module.js"

var webcamCycle = null;

const setCurrentEmotion = (highestEmotion) => {
    const avatarElement = document.getElementById("smth");
    localStorage.setItem("currentEmotion", highestEmotion);
    avatarElement.src = localStorage[emotionToInputName[highestEmotion]];
}

const changeSceneClick = () => {
    // alert("changeScene called!");
    console.log("click event called!");
    // changeScene();
    // changeSceneWithObj();
    if(webcamCycle==null){
        webcamCycle = setInterval(() => {
            getWebcamSourceScreenshot();
            const resultScreenshot = localStorage.lastImg;
            console.log('resultScreenshot:'+resultScreenshot);
            detectFromImage(resultScreenshot).then((detection) => {
                console.log("detection:");
                console.log(detection);
                setCurrentEmotion(detection);
            });
        }, 5000);
    }
}

const stopWebcamCycle = () => {
    if(webcamCycle!=null){
        closeInterval(webcamCycle);
        webcamCycle = null;
    }
}

let base64String = "";
function imageUploaded() {
    console.log('imageUploaded!');
    const file = document.querySelector("#fileId").files[0];
    console.log(file)
    let reader = new FileReader();
    reader.onload = () =>{
        base64String = reader.result.replace("data:", "").replace("\^.+,/", "");
        console.log(base64String);
        document.querySelector("#imageBase64").innerText = "ImageBase64String: "+base64String;
        
        console.log("Src: "+base64String);
        localStorage.setItem("lastImg", "data:"+base64String);
        document.getElementById('uploadedImg').src = localStorage.lastImg;
    }
    if(file){
        reader.readAsDataURL(file);
    }
}

document.querySelector("#openWebcamBtn").addEventListener("click",changeSceneClick);
document.querySelector("#closeWebcamBtn").addEventListener("click",stopWebcamCycle);
document.querySelector("#fileId").addEventListener("input", imageUploaded);
document.getElementById('uploadedImg').src = localStorage.lastImg;