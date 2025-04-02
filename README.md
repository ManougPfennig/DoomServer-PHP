# DOOM SERVER - PHP
### *(Currently a work in progress, there is no multiplayer yet)*
### 1. Sounds metal, right ?

Well, really it's nothing more than a **web application made to walk around a 3D multiplayer map**.

The term 'Doom' is there because the **frontend uses a rendering technique called ray-casting**, which first saw the light in the video-game industry in the 1990's to make some of the **first ever 3D video-games** like **Wolfenstein3D** or, like the name suggests, **Doom**.

![raycasting exemple.](https://upload.wikimedia.org/wikipedia/commons/e/e7/Simple_raycasting_with_fisheye_correction.gif)

Maybe you expected an actual *Doom Server* made to take over the world ? ~I wish~ Don't worry, it's still a lot of fun.
<br/><br/>

### 2. How to setup the server
*Note: The server will only be accessible to computers sharing the same network.*

- Clone the repository\
```git clone https://github.com/ManougPfennig/DoomServer-PHP```
- Go inside the repository\
```cd DoomServer-PHP```
- Start the application with docker compose using the provided Makefile\
```sudo make``` or ```sudo make hide``` to hide logs
