import {connectToOBS, changeImageWithSource, getImageFromSource} from "./obs-module.js"
import {detectExpressionFromImage} from "./face_module.js"

const emotionToImgName = {
	"neutral": "neutralImg",
	"happy": "happyImg",
	"angry": "angryImg",
	"sad": "sadImg",
	"surprised": "surprisedImg",
	"fearful": "fearfulImg",
	"disgusted": "disgustedImg"
};



const emotionImgText = {};
Object.keys(emotionToImgName).forEach( (emotion) => {
	const imgStr = localStorage.getItem(emotionToImgName[emotion]);
	emotionImgText[emotion] = (imgStr===undefined)?"":imgStr;
});
console.log(emotionImgText);

//issue to solve: updateImgElement is not defined
alert('source.js loaded!');
/*const updateImgElement = (imgElement) => {
	document.getElementById("selectedInputName").textContent = 'sourceName';
	const sourceName = localStorage.getItem('selectedInputName');
	const sourceUUID = localStorage.getItem('selectedInputUUID');
	document.getElementById("selectedInputUUID").textContent = sourceUUID;
	if(sourceName===undefined||sourceUUID===undefined){
		alert('sourceName not saved in localStorage!');
		return;
	}
	console.log('sourceName:'+sourceName+'    sourceUUID:'+sourceUUID);
	alert('sourceName:'+sourceName+'    sourceUUID:'+sourceUUID);
	changeImageWithSource(imgElement, sourceName, sourceUUID);
}*/
const emotionText = document.getElementById('emotionText');

function updateImgElement(imgElement, emotionImgElement){
	const sourceName = localStorage.getItem('selectedInputName');
	const sourceUUID = localStorage.getItem('selectedInputUUID');
	const serverPort = localStorage.getItem('serverPort');
	const serverPassword = localStorage.getItem('serverPassword');
	const useAuth = localStorage.getItem('useAuth')==='true';
	console.log(`${serverPort}    ${serverPassword} ${useAuth}`);
	//document.getElementById("selectedInputName").textContent = sourceName;
	//document.getElementById("selectedInputUUID").textContent = sourceUUID;
	if(serverPort===undefined||serverPassword===undefined){
		alert('serverPort and serverPassword not saved in localStorage!');
		return;
	}
	if(sourceName===undefined||sourceUUID===undefined){
		alert('selected sourceName not saved in localStorage!');
		return;
	}
	console.log('sourceName:'+sourceName+'    sourceUUID:'+sourceUUID);
	connectToOBS(serverPort, serverPassword, useAuth).then(() => {
		//changeImageWithSource(imgElement, sourceName, sourceUUID);
		/*const imgStr = localStorage.getItem('lastUploadImg');
		if(imgStr!==undefined){
			detectExpressionFromImage(imgStr).then( (highestEmotion) => {
				if(highestEmotion!==undefined){
					console.log(`highestEmotion: ${highestEmotion}`);
					emotionText.textContent = highestEmotion;
					console.log(emotionImgText[highestEmotion]);
					emotionImgElement.src = emotionImgText[highestEmotion];
				}
			});
		}*/
		getImageFromSource(sourceName, sourceUUID).then((imgStr) => {
			detectExpressionFromImage(imgStr).then( (highestEmotion) => {
				if(highestEmotion!==undefined){
					console.log(`highestEmotion: ${highestEmotion}`);
					emotionText.textContent = highestEmotion;
					console.log(emotionImgText[highestEmotion]);
					emotionImgElement.src = emotionImgText[highestEmotion];
				}
			});
		});
	});
}

setInterval( () => {
	(async () => {
		const imgElement = document.getElementById("lastUploadImg");
		const emotionImgElement = document.getElementById("emotionImg");
		updateImgElement(imgElement, emotionImgElement); 
		//document.getElementById("lastUploadImg").src = localStorage.lastUploadImg;
		//document.getElementById('imgSrc').textContent = localStorage.lastUploadImg;
	})();
}, 500);

