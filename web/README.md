# untappdScraper Web

Web application version of [untappdScraper](https://github.com/WebBreacher/untappdScraper).

## Installing Prerequisites

* [Node.js / NPM](https://nodejs.org/en/download/)

## Running Locally

```bash
cd app
npm install
npm run dev
```

The application will be started on HTTP port 3000. It will automatically reload when code changes are made.

## Creating a Production Build

```bash
cd app
npm install
npm run build
```

## Running the Production Build

```bash
cd app
npm install
npm start -- -p 3000 # The port defaults to 3000 if not provided. Running on reserved ports requires sudo.
```

## Deploying to GitHub Pages

```bash
cd app
npm install
npm run deploy
```

The application should now be available at https://YOUR_GITHUB_USERNAME.github.io/untappdScraper/

## Linting the Application

The following will detect code flaws using [eslint](https://eslint.org/):

```bash
cd app
npm install
npm run lint
```

The following will attempt to automatically fix the detected code flaws:

```bash
cd app
npm install
npm run lint -- --fix
```
