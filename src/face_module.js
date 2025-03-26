
const video = document.getElementById('video');

var modelLoaded = false;
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
    faceapi.nets.faceExpressionNet.loadFromUri('../models')
]).then(()=>{
    modelLoaded = true;
    console.log("models all loaded!!!");
});

function openCam(){
    alert("openCam called!");
    let but = document.getElementById("webcamButton");
    let mediaDevices = navigator.mediaDevices;
    mediaDevices.getUserMedia({
        video: true,
        audio: true,
    }).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
    }).catch(alert);
}

export async function detectExpressionFromImage(camImageBase64){
	while(modelLoaded==false){};
	const img = await faceapi.fetchImage(camImageBase64);
	const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
	console.log(detections);
	if(detections!==undefined){
		const expressionValues = detections.expressions;
		const highestExpression = Object.keys(expressionValues).reduce((a,b) => (expressionValues[a]>expressionValues[b]?a:b));
		return highestExpression;
	}
	else{
		return undefined;
	}
}

