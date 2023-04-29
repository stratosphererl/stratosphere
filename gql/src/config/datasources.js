require("dotenv").config();
const assert = require("assert");

const USER_SERVICE_URL = process.env.DOCKER_RUNNING
  ? process.env.USER_SERVICE_NAME
  : "localhost";
const REPLAY_SERVICE_URL = process.env.DOCKER_RUNNING
  ? process.env.REPLAY_SERVICE_NAME
  : "localhost";
const STATS_SERVICE_URL = process.env.DOCKER_RUNNING
  ? process.env.STATS_SERVICE_NAME
  : "localhost";
const ML_SERVICE_URL = process.env.DOCKER_RUNNING
  ? process.env.ML_SERVICE_NAME
  : "localhost";

const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
const REPLAY_SERVICE_PORT = process.env.REPLAY_SERVICE_PORT;
const STATS_SERVICE_PORT = process.env.STATS_SERVICE_PORT;
const ML_SERVICE_PORT = process.env.ML_SERVICE_PORT;

assert(
  USER_SERVICE_PORT,
  "USER_SERVICE_PORT is required. Please include it in your .env file"
);
assert(
  REPLAY_SERVICE_PORT,
  "REPLAY_SERVICE_PORT is required. Please include it in your .env file"
);
assert(
  STATS_SERVICE_PORT,
  "STATS_SERVICE_PORT is required. Please include it in your .env file"
);
assert(
  ML_SERVICE_PORT,
  "ML_SERVICE_PORT is required. Please include it in your .env file"
);

const AUTH_TOKEN = process.env.GQL_AUTH_TOKEN;
const GQL_SERVICE_PORT = process.env.GQL_SERVICE_PORT || 4000;

assert(
  AUTH_TOKEN,
  "GQL_AUTH_TOKEN is required. Please include it in your .env file. Make sure it is correct."
);

module.exports = {
  USER_SERVICE_URL,
  REPLAY_SERVICE_URL,
  STATS_SERVICE_URL,
  ML_SERVICE_URL,
  USER_SERVICE_PORT,
  REPLAY_SERVICE_PORT,
  STATS_SERVICE_PORT,
  ML_SERVICE_PORT,
  AUTH_TOKEN,
  GQL_SERVICE_PORT,
};
