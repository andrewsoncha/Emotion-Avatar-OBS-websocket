import OBSWebSocket from "/node_modules/obs-websocket-js/dist/obs-ws.js";

const obs = new OBSWebSocket();

const baseServerURL = "ws://127.0.0.1";
var connectedFlag = false;
var identifiedFlag = false;

//todo: connectToOBS works with settings.html but not with source.html. Fix It, Andrew.

export async function connectToOBS(serverPort, serverPassword, useAuth){
	const serverURL = baseServerURL+":"+serverPort;
	//alert(`${serverURL}   ${serverPassword}  ${useAuth}`);
	let info = undefined;
	//try{
		if(useAuth){
			//alert('connecting using auth');
			info = await obs.connect(serverURL, serverPassword);
		}
		else{
			//alert('connecting without auth');
			info = await obs.connect(serverURL);
		}
		//alert("Yayyy we connected to server!");
		console.log(info);
		connectedFlag = true;
		obs.on("Identified", () => {
			//alert("Identified! Good to Go!");
			identifiedFlag = true;
		});
		
		obs.call('GetVersion').then((versionInfo) => console.log(versionInfo));
	/*} catch(e){
		alert('Failed to connect to OBS!', e.code, e.message);
		console.log(e.code);
		console.log(e.message);
	}*/
}



/*export function connectToOBS(serverPort, serverPassword){
    const serverURL = baseServerURL+":"+serverPort;
    alert(serverURL);
    obs.connect(serverURL).then(
        (info) => {
            alert("Yayyy we connected to server!");
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
}*/

function checkSendErrorMessage(){
    if(connectedFlag==false){
        alert("OBS Websocket not connected properly! Please check the OBS Port and that Websocket Server is On! Redirecting to First Page!");
        //location.replace("./settings.html");
        return;
    }
    //if(identifiedFlag==false){
    //    alert("OBS Websocket failed to Identify! Please check the Password! Redirecting to First Page!");
    //    location.replace("./settings.html");
    //}
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
    alert('getVideoCaptureList called Succesfully!');
    let returningInputDict = [];

    //obs.on("Identified", () => {
	obs.call('GetCurrentProgramScene').then((currentProgramSceneName) => console.log(currentProgramSceneName));
        obs.call('GetInputList').then((list) => console.log(list));
	//todo: fix this part so it actually saves or returns both the list of dshow_input and list of ffmpeg_source
	return obs.call('GetInputList', {inputKind: 'dshow_input'}).then((videoCaptureInputList) => {
		alert('getinputlist then!');
		console.log('videoCaptureInputList');
		console.log(videoCaptureInputList);
		let returningInputDict = [];
		if(videoCaptureInputList.input !=undefined){
            		returningInputDict.push(...videoCaptureInputList.input);
		}
		const ffmpegList = obs.call('GetInputList', {inputKind: 'ffmpeg_source'}).then((ffmpegInputList) => {
		    console.log('ffmpegInputList');
		    console.log(ffmpegInputList);
		    let returningInputDict = []
		    if(ffmpegInputList.input!=undefined){
		    	returnInputList.push(...ffmpegInputList.input);
		    }
		    return returnInputList;
	   	 }).catch((error) => {
		    console.log(error);
	    	});
		returningInputDict.push(...ffmpegList);
		return returningInputDict
	}).catch((error) => {
            console.log(error);
        });
    //})
}

export function changeImageWithSource(imgElement, sourceName, sourceUUID){
	obs.call('GetSourceScreenshot', {sourceName:sourceName, sourceUuid:sourceUUID, imageFormat:'png', imageWidth: 720, imageHeight: 480}).then((response) => {
		//console.log(response);
		let imgString = response.imageData;
		//console.log('imgString: '+imgString);
		localStorage.setItem('lastUploadImg', imgString);
		imgElement.src = imgString;
		//console.log(imgElement.src);
	});
}

export function getImageFromSource(sourceName, sourceUUID){
	return obs.call('GetSourceScreenshot', {sourceName:sourceName, sourceUuid:sourceUUID, imageFormat:'png', imageWidth: 720, imageHeight: 480}).then((response) => {
		let imgString = response.imageData;
		localStorage.setItem('lastUploadImg', imgString);
		return imgString;
	});
}

export function saveVideoCaptureList(selectElement){
    checkSendErrorMessage();
    alert('setVideoCaptureList called Succesfully!');
	obs.call('GetCurrentProgramScene').then((currentProgramSceneName) => console.log(currentProgramSceneName));
        obs.call('GetInputList').then((list) => console.log(list));
	//todo: fix this part so it actually saves or returns both the list of dshow_input and list of ffmpeg_source
	localStorage.setItem("videoInputList", []);
	obs.call('GetInputList', {inputKind: 'dshow_input'}).then((videoCaptureInputList) => {
		console.log('videoInputList');
		console.log(videoCaptureInputList.inputs);
		localStorage.setItem("testList", JSON.stringify(videoCaptureInputList));
		let returningInputDict = {};
		if(videoCaptureInputList.inputs != undefined){
			console.log('videoCaptureInputList pushed');
            		//returningInputDict.push(...videoCaptureInputList.inputs);
			videoCaptureInputList.inputs.forEach( (input) => {
				console.log('input:');
				console.log(input);
				returningInputDict[input.inputName] = input.inputUuid;
			});
		}
		console.log('returningInputDict:');
		console.log(returningInputDict);
		localStorage.setItem("videoInputList", JSON.stringify(returningInputDict));
	}).then(() => {obs.call('GetInputList', {inputKind: 'ffmpeg_source'}).then((ffmpegInputList) => {
		    console.log('ffmpegInputList');
		    console.log(ffmpegInputList);
		    const returningInputDictString = localStorage.getItem("videoInputList");
		    let returningInputDict = {};
		    if(returningInputDictString!==""){
		        returningInputDict = JSON.parse(returningInputDictString);
		    }
		    console.log('returningInputDict');
		    console.log(returningInputDict);
		    if(ffmpegInputList.inputs!=undefined){
			console.log('ffmpegInputList pushed');
			ffmpegInputList.inputs.forEach( (input) => {
				console.log('input:');
				console.log(input);
				returningInputDict[input.inputName] = input.inputUuid;
			});
		    }
		console.log('returningInputDict:');
		console.log(returningInputDict);
	   	localStorage.setItem("videoInputList", JSON.stringify(returningInputDict));
		
		Object.keys(returningInputDict).forEach((inputInfo) => {
			let newOption = document.createElement("option");
			newOption.value = inputInfo;
			newOption.text = inputInfo;
			selectElement.appendChild(newOption);
		});
	});
	});
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
