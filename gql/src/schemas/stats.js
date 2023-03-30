const { gql } = require("apollo-server");
const fetch = require("node-fetch");
const {
  STATS_SERVICE_URL,
  STATS_SERVICE_PORT,
} = require("../config/datasources");

const statsDef = gql`
  type Count {
    count: Int!
  }

  input DurationQuery {
    minDuration: Int = 0
    maxDuration: Int = 1230
  }

  input RankQuery {
    minRank: Int
    maxRank: Int
  }

  input SeasonQuery {
    minSeason: Int
    maxSeason: Int
  }

  input PlatformQuery {
    platformId: Int
  }

  type Query {
    replaysCount: Count!
    replayArenas(arenaId: Int): Count!
    replayDurations(durationQuery: DurationQuery): Count!
    replayRanks(rankQuery: RankQuery): Count!
    replaySeasons(seasonQuery: SeasonQuery): Count!
    usersCount: Count!
    userPlatforms(platformQuery: PlatformQuery): Count!
    userRanks(rankQuery: RankQuery): Count!
  }
`;

const statsResolvers = {
  Query: {
    replaysCount: (parent, args, context, info) => {
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/replays/all`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.detail);
          });
        }
        return res.json();
      });
    },
    replayArenas: (parent, args, context, info) => {
      let arenaPath = args?.arenaId ? `${args.arenaId}` : "";
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/replays/arena/${arenaPath}`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            const errorMsg = data.detail[0].msg || data.detail;
            throw new Error(errorMsg);
          });
        }
        return res.json();
      });
    },
    replayDurations: (parent, args, context, info) => {
      let minDurationPath = args?.durationQuery?.minDuration
        ? `?min_duration=${args.durationQuery.minDuration}`
        : "";
      let maxDurationPath = args?.durationQuery?.maxDuration
        ? `&max_duration=${args.durationQuery.maxDuration}`
        : "";
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/replays/duration${minDurationPath}${maxDurationPath}`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            const errorMsg = data.detail[0].msg || data.detail;
            throw new Error(errorMsg);
          });
        }
        return res.json();
      });
    },
    replayRanks: (parent, args, context, info) => {
      let minRankPath = args?.rankQuery?.minRank
        ? `?low_rank_num=${args.rankQuery.minRank}`
        : "";
      let maxRankPath = args?.rankQuery?.maxRank
        ? `&high_rank_num=${args.rankQuery.maxRank}`
        : "";
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/replays/rank${minRankPath}${maxRankPath}`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            const errorMsg = data.detail[0].msg || data.detail;
            throw new Error(errorMsg);
          });
        }
        return res.json();
      });
    },
    replaySeasons: (parent, args, context, info) => {
      let minSeasonPath = args?.seasonQuery?.minSeason
        ? `?low_season_num=${args.seasonQuery.minSeason}`
        : "";
      let maxSeasonPath = args?.seasonQuery?.maxSeason
        ? `&high_season_num=${args.seasonQuery.maxSeason}`
        : "";
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/replays/season${minSeasonPath}${maxSeasonPath}`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            const errorMsg = data.detail[0].msg || data.detail;
            throw new Error(errorMsg);
          });
        }
        return res.json();
      });
    },
    usersCount: (parent, args, context, info) => {
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/users/all`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.detail);
          });
        }
        return res.json();
      });
    },
    userPlatforms: (parent, args, context, info) => {
      let platformPath = args?.platformQuery?.platformId
        ? `?platform_num=${args.platformQuery.platformId}`
        : "";
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/users/platform/${platformPath}`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            const errorMsg = data.detail[0].msg || data.detail;
            throw new Error(errorMsg);
          });
        }
        return res.json();
      });
    },
    userRanks: (parent, args, context, info) => {
      let minRankPath = args?.rankQuery?.minRank
        ? `?low_rank_num=${args.rankQuery.minRank}`
        : "";
      let maxRankPath = args?.rankQuery?.maxRank
        ? `&high_rank_num=${args.rankQuery.maxRank}`
        : "";
      console.log(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/users/rank${minRankPath}${maxRankPath}`
      );
      return fetch(
        `http://${STATS_SERVICE_URL}:${STATS_SERVICE_PORT}/api/v1/users/rank${minRankPath}${maxRankPath}`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            const errorMsg = data.detail[0].msg || data.detail;
            throw new Error(errorMsg);
          });
        }
        return res.json();
      });
    },
  },
};

module.exports = { statsDef, statsResolvers };
