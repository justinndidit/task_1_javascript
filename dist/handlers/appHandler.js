"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetailsAndGreet = getUserDetailsAndGreet;
const axios_1 = __importDefault(require("axios"));
function getUserDetailsAndGreet(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const visitorName = request.query.visitor_name;
        const userIp = (_a = request.socket.remoteAddress) === null || _a === void 0 ? void 0 : _a.toString();
        const ipInfoBaseUrl = (_b = process.env.ipAddressBaseUrl) === null || _b === void 0 ? void 0 : _b.toString();
        const ipInfoToken = (_c = process.env.ipAddressApiToken) === null || _c === void 0 ? void 0 : _c.toString();
        const weatherApiBaseUrl = (_d = process.env.weatherApiBaseUrl) === null || _d === void 0 ? void 0 : _d.toString();
        const weatherApiToken = (_e = process.env.weatherApiToken) === null || _e === void 0 ? void 0 : _e.toString();
        const ipInfoUrl = `https://${ipInfoBaseUrl}/${userIp}?token=${ipInfoToken}`;
        try {
            // Fetch IP information
            const ipInfoResponse = yield axios_1.default.get(ipInfoUrl);
            const ipInfoData = ipInfoResponse.data;
            // Extract location data
            let locationData = ((_f = ipInfoData === null || ipInfoData === void 0 ? void 0 : ipInfoData.loc) === null || _f === void 0 ? void 0 : _f.split(" ")) || ["6.5244", "3.3792"];
            const city = ipInfoData.city || "Lagos";
            // Fetch weather information
            //'https://api.tomorrow.io/v4/weather/forecast?location=42.3478,-71.0466&apikey=8aIvSGpdvuOF1hFBuiHz4Ca1HZtrJ8hG'
            const weatherApiUrl = `${weatherApiBaseUrl}?location=${locationData[0]},${locationData[1]}&apikey=${weatherApiToken}`;
            const weatherApiResponse = yield axios_1.default.get(weatherApiUrl);
            const weatherData = weatherApiResponse.data.timelines.minutely[0].values.temperature;
            // Combine IP info and weather data for the response
            const greeting = `Hello, ${visitorName}!, the temperature is ${weatherData} degrees Celcius in ${city}`;
            const responseData = {
                client_ip: userIp,
                location: city,
                greeting
            };
            response.status(200).json(responseData);
        }
        catch (error) {
            console.error(error.message);
            response.status(500).send("Internal Server Error");
        }
    });
}
