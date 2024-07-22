import OBSWebSocket from "/node_modules/obs-websocket-js/dist/obs-ws.js";

const obs = new OBSWebSocket();

const baseServerURL = "ws://localhost";
const password = "hjRwb31hMHNVfrNt";
var connectedFlag = false;
var identifiedFlag = false;

export function connectToOBS(serverPort, serverPassword){
    const serverURL = baseServerURL+":"+serverPort;
    obs.connect(serverURL).then(
        (info) => {
            console.log("Yayyy we connected to server!");
            console.log(info);
            connectedFlag = true;
        },
        (error) => {
            console.log("Error!   "+error);
        }
    );
    obs.on("Identified", () => {
        identifiedFlag = true;
    });
}

function checkSendErrorMessage(){
    if(connectedFlag==false){
        alert("OBS Websocket not connected properly! Please check the OBS Port and that Websocket Server is On! Redirecting to First Page!");
        location.replace("./settings.html");
        return;
    }
    if(identifiedFlag==false){
        alert("OBS Websocket failed to Identify! Please check the Password! Redirecting to First Page!");
        location.replace("./settings.html");
    }
}

export function changeScene() {
    alert("changeScene called!");
    console.log("changeScene called!");
    alert(serverURL+" "+password);
    const ws = new WebSocket(serverURL);

    // When the WebSocket connection is opened
    ws.addEventListener("open", function(event) {
        // Authenticate with the server (if a password is set)
        if (password) {
            const authData = {
                "request-type": "Authenticate",
                "password": password
            };
            ws.send(JSON.stringify(authData));
        }

        // Define the data to change the scene
        const sceneData = {
            "request-type": "SetCurrentProgramScene",
            "scene-name": "otherScene" // Replace with the name of the scene you want to switch to
        };

        // Send the scene change request
        ws.send(JSON.stringify(sceneData));

        // Close the WebSocket connection
        ws.close();
    });

    // Handle WebSocket errors
    ws.addEventListener("error", function(event) {
        console.error("WebSocket Error:", event);
    });

    // Handle WebSocket closure
    ws.addEventListener("close", function(event) {
        console.log("WebSocket Closed:", event);
    });
}

export async function changeSceneWithObj() {
    alert("changeSceneWithObj called!");
    console.log("changeSceneWithObj called!");
    alert(serverURL+" "+password);

    // When the WebSocket connection is opened
    obs.connect(serverURL).then(
        (info) => {
            console.log("Yayyy we connected to server!");
            console.log(info);
        },
        (error) => {
            console.log("Error!   "+error);
        }
    );

    obs.on("ConnectionOpened", () => {
        console.log("Connection Opened");
    });
    
    obs.on("Identified", () => {
        console.log("Identified, good to go!");
    });
    obs.on("Identified", ()=>{
        console.log("Listening!");

        obs.call('GetInputKindList').then((versionInfo) => {
            console.log("version Info:");
            console.log(versionInfo);
        })

        obs.call("GetSceneList").then((ScenesData) => {
            console.log("Scene Data:");
            console.log(ScenesData);
        })

        obs.call("SetCurrentProgramScene", {sceneName: "otherScene"}).then(() => {
            console.log("Switched to scene!");
        }).catch((error) => {
            console.error("Error switching scenes:", error);
        })

        obs.call('GetInputList', {inputKind: 'wasapi_input_capture'}).then((inputList) => {
            console.log("inputList:");
            console.log(inputList);
        }).catch((error)=> {
            console.error("Error getting input list:",error);
        })
    });
}

export function getVideoCaptureList(){
    checkSendErrorMessage();
    let returningInputList = undefined;

    obs.on("Identified", () => {
        obs.call('GetInputList', {inputKind: 'dshow_input'}).then((inputList) => {
            returningInputList = inputList;
        }).catch((error) => {
            console.log(error);
        })
    })
    return returningInputList;
}

export function getVideoSourceScreenshot(sourceName){
    checkSendErrorMessage();
    let returningImgString = "";

    obs.on("Identified", () => {
        obs.call('GetSourceScreenshot', {inputName: sourceName, imageFormat: 'png'}).then((imageData) => {
            returningImgString = imageData;
        }).catch((error) => {
            console.log(error);
        });
    });
    return returningImgString;
}

export function getWebcamSourceScreenshot(){
    alert("getWebcamSourceScreenshot called!");
    console.log("getWebcamSourceScreenshot called!");
    alert(serverURL+" "+password);
    var resultScreenshot = "";
    
    checkSendErrorMessage();

    obs.on("Identified", ()=>{
        console.log("Listening!");
        
        obs.call('GetInputKindList').then((versionInfo) => {
            console.log("version Info:");
            console.log(versionInfo);
        })

        obs.call("GetSceneList").then((ScenesData) => {
            console.log("Scene Data:");
            console.log(ScenesData);
        })

        obs.call('GetInputList', {inputKind: 'dshow_input'}).then((inputList) => {
            // console.log("inputList:");
            // console.log(inputList);
            // console.log(inputList.inputs[0]);

            let inputName = inputList.inputs[0].inputName;
            let inputUuid = inputList.inputs[0].inputUuid;
            // console.log("inputName:"+inputName+"  inputUuid: "+inputUuid);

            obs.call('GetSourceScreenshot', {sourceName: inputName, imageFormat: 'png'}).then((imageData) => {
                // console.log(imageData);
                let base64String = imageData.imageData;

                document.querySelector("#imageBase64").innerText = "ImageBase64String: "+base64String;
        
                // console.log("Src: "+base64String);
                localStorage.setItem("lastImg", base64String);
                document.getElementById('uploadedImg').src = localStorage.lastImg;
            })
        }).catch((error)=> {
            console.error("Error getting input list:",error);
        })
    });
}