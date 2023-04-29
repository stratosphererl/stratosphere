const { gql } = require("apollo-server-express");
const fetch = require("node-fetch");
const {
    ML_SERVICE_URL,
    ML_SERVICE_PORT,
} = require("../config/datasources");
const FormData = require("form-data");
const { GraphQLUpload } = require("graphql-upload");

const mlDef = gql`
    scalar Upload

    type PredictionResponse {
        time_to_parse: Float
        time_to_analyze: Float
        time_to_format: Float
        time_to_clean: Float
        time_to_predict: Float
        model_name: String
        keys: [String]
        predictions: [[Float]]
    }

    type Mutation {
        predict(file: Upload!): PredictionResponse
    }
`;

const mlResolvers = {
    Upload: GraphQLUpload,
    Mutation: {
        predict: async (_, { file }) => {
            const { filename, createReadStream, mimetype } = await file;
            const stream = createReadStream();
            const form = new FormData();
            form.append("file", stream, { 
                filename,
                contentType: mimetype
            });

            return fetch(`http://${ML_SERVICE_URL}:${ML_SERVICE_PORT}/api/v1/predict`, {
                method: "POST",
                ...form.getHeaders(),
                body: form,
            }).then((res) => {
                if (!res.ok) {
                    return res.json().then((data) => {
                        throw new Error(data.detail);
                    });
                }
                return res.json();
            });
        }
    }
};

module.exports = {
    mlDef,
    mlResolvers
};