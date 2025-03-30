# OBS Facial Expression PNGtuber tool by Andrewsoncha
## How to Use:

 1. Have <a href='https://obsproject.com/download'>OBS Studio version 28.0.0 or later</a> installed. The obs-websocket plugin is necessary to use this tool.</p>
 2. Under `Tools > WebSocket Server Settings`, check **Enable WebSocket server**, click on **Show Connect Info** and take note of the server port and password(if authentication is enabled). **ANYONE WHO HAS ACCESS TO THIS INFORMATION CAN CONTROL YOUR OBS. DO NOT SHOW THIS ON STREAM**
 3. Open OBS and create a **Video Capture Source** or a **Media Source** of a webcam stream or a video of the streamer's face.
 4. `Under Docks -> Custom BrowserDocks...`, add the URL below as a custom dock and click **Apply**.

```
https://andrewsoncha.github.io/Emotion-Avatar-OBS-websocket/settings.html
```

 7. In the Browser Dock, enter the server port and password(if authentication is enabled), enter your avatar images for each facial expression, and click **Connect to OBS!**
 8. From the Dropdown list below, select the desired video or webcam feed source and click **Select Input!**
 9. Create a **Browser Source** of the URL below. Make sure that the Dimensions of the browser source matches that of the images you uploaded.
     
```
https://andrewsoncha.github.io/Emotion-Avatar-OBS-websocket/source.html
```



## Contacts
If you have any questions, feedback, or issues, please open an Issue at the github repo or contact me at [andrewsoncha2@gmail.com](andrewsoncha2@gmail.com).

