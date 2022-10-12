# Stratosphere Front-End Application

## Installation Process

Make you have node.js installed, you can get the latest version here https://nodejs.org/en/

Use npm to install pnpm (npm usuallly comes with node.js):
```
npm install -g pnpm
```
Other installation options for pnpm exist here https://pnpm.io/installation

To download all the required dependencies, enter this command:
```
pnpm i
```

## Usage

To run the server locally, enter this command:
```
pnpm start
```
Using npm works fine as well.

## Docker
Build the image
```
docker build -t stratosphere-client .
```
Run the container
```
docker run -it -p 3000:3000 stratosphere-client
```