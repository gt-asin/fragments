# fragments
introduction to cloud computing

```
npm run [script name]
```
To run any script that you have installed with your project, we need to use the above command. To find out which script has been installed with the project, check the package.json file and it will be located in the scripts sections. For this project the current scripts that come with the project are:
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint \"./src/**/*.js\"",
    "start": "node src/server.js",
    "dev": "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src",
    "debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
  },
```
```
npm run start
```
This runs the project on a local server which is usually localhost:8080. A shorter form of just writing node server.js 
```
npm run lint
```
A script that does not run the server, but checks for any errors or warnings that the server may produce and then displays them in the terminal.
```
npm run dev
```
Runs the server in developer mode which allows you to monitor changes in real time of the server.js file. For example if you add a console.log while the server is still running, the changes will happen immediantly which is useful for testing portions of code on a live server.
```
npm run debug
```
Does the same thing as dev script but attaches a debugger. This allows tools such as the VScode, or Chrome for debugging.
