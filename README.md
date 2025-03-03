# fragments

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

A script that condenses the command `node [file location]/server.js` into a shorter command. Initially it runs the project locally on your machine, which can be accessed at `localhost:8080` if it runs correctly.

```
npm run lint
```

A script that does not run the server, but checks for any errors or warnings that the server may produce and then displays the errors or warnings in more helpful and detail in the terminal.

```
npm run dev
```

Runs the server in developer mode which allows you to monitor changes to the code in real time of the server.js file. For example if you add a console.log while the server is still running, the changes will happen immediantly which is useful for testing portions of code on a live server.

```
npm run debug
```

Does the same thing as dev script but attaches a debugger so tools like VSCode and Chrome can listen in.

```
docker build -t fragments:latest .

```

Build image

```
docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest

```

Run image in background. Left Port = host, Right Port = container

```
docker logs -f <id>

```

Real time logs for container
