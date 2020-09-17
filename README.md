# CS2102_2021_S1_Team27 Backend

This branch hosts the backend of CS2102_2021_S1_Team27 project. **Do not merge this branch to master**!

## Setup

The recommanded deelopment envireonment is Linux/Mac/Windows WSL + VSCode.

1. Open a terminal, clone this repo (make sure you have correctly set your SSH key on GitHub):
   - `git clone --single-branch --branch backend git@github.com:CS2102-Project-Team/CS2102_2021_S1_Team27.git`
2. Open the project in VSCode:
   - `code CS2102_2021_S1_Team27`
3. Install the following extensions in VSCode:
   - ESLint (Dirk Baeumer)
4. ~~Create a `.env` file in the project root directory, with environment variables needed~~
5. Open a terminal in VSCode (Ctrl+`). Install node dependencies:
   - `cd backend; npm i`
6. To run the dev server:
   - `npm run dev`

## Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Troubleshooting

TBC