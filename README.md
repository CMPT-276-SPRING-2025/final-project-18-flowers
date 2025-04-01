[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=17805179&assignment_repo_type=AssignmentRepo)

# SquadUp - An AI Hangout Planner

### Description
This project aims to help any group decide on something to do when they have a hangout. This project is mainly directed to help target teens who struggle to coordinate plans with friends. 

## Local Deployment:

To set up and run this app locally follow these instructions:

### Prerequisites:

Before starting first make sure that you have following:

- Basic knowledge on using your computer's terminal
- [Node.js](https://nodejs.org/en) (make sure to install a modern version, we suggest 22 or higher)
- A Google Gemini [API Key](https://aistudio.google.com/app/apikey)
- npm (this should come with Node.js)
- [Git](https://git-scm.com/downloads) and a [GitHub](https://github.com/signup) account

### Cloning The Repository 

Open your terminal then:

To clone the repository first navigate to the directory in which you want the project files then run:
```sh
git clone git@github.com:CMPT-276-SPRING-2025/final-project-18-flowers.git
```
If this doesn't work try:
```sh
git clone https://github.com/CMPT-276-SPRING-2025/final-project-18-flowers.git
```
### Install Dependencies

Open the project folder by running the command:
```sh
cd final-project-18-flowers
```
Then to install dependencies run:
```sh
npm install
```
### Edit environment variable

Navigate inside of the folder to the file called ".env"

Open the file with the text editor of your choice and replace "your_api_key" with the value for your api key you got from the prerequisites section:

Before:
```sh
VITE_GEMINI_API_KEY=your_gemeni_api_key
```
After:
```sh
VITE_GEMINI_API_KEY=AIzaSY.....
```

### Run Locally:

Run the following command in your terminal to start the a local server for the project to run:
```sh
npm run dev
```
If everything works you should get the following response in your terminal:
```sh
> vite-project@0.0.0 dev
> vite


  VITE v6.2.2  ready in 520 ms

  ➜  Local:   http://localhost:3000/final-project-18-flowers/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
Copy and paste the link generated into your browser to see the project run!
```sh
http://localhost:3000/final-project-18-flowers/
```






