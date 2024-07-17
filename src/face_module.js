
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
    // console.log("split: "+camImageBase64.toString().split(",")[1]);
    // const binaryString = atob(camImageBase64.toString().split(",")[1]);
    // console.log("binaryString: "+binaryString);
    // const blob = new Blob([binaryString], {type:"image/png"});
    // const img = faceapi.bufferToImage(blob);
    console.log("modelLoaded:"+modelLoaded.toString());
    while(modelLoaded==false){};
    const img = await faceapi.fetchImage(camImageBase64);
    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const highestExpression = Object.entries(b).reduce((a,b) => a[1]>b[1]?a:b)[0];
    return highestExpression;
}

// video.addEventListener('play', () => {
//     const canvas = faceapi.createCanvasFromMedia(video);
//     document.body.append(canvas)
//     const displaySize = {width: video.width, height: video.height};
//     faceapi.matchDimensions(canvas, displaySize);
//     setInterval(async () =>{
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
//         console.log(resizedDetections);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//     }, 100);
// });