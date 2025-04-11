

## Getting Started

First Download the repository from github then run
Please make sure your node version is 22 LTS version to avoid nodeJs version error
```bash
npm install
```
Then to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project is a web page to signIn and create Post or comment board

Project Detail
In this project I use app router to make it easy to code as we only need three page
I use tailwindcss to style throughout the project, The rest is simple react and fetch request
The web will start with signIn with I use useContext and localstorage to keep the current user info through out the rest of the process 
So when user signIn they will be able to see post, create ,edit and delete their own post and comments with their username send for validation at server.