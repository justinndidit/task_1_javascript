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
const request_ip_1 = __importDefault(require("request-ip"));
function getUserDetailsAndGreet(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const visitorName = request.query.visitor_name || "guest";
        const userIp = request_ip_1.default.getClientIp(request);
        const weatherApiToken = (_a = process.env.weatherApiToken) === null || _a === void 0 ? void 0 : _a.toString();
        const weatherApiBaseUrl = "https://api.tomorrow.io/v4/weather/forecast";
        const ipInfoUrl = `http://ip-api.com/json/${userIp}`;
        try {
            const ipInfoResponse = yield axios_1.default.get(ipInfoUrl);
            const ipInfoData = ipInfoResponse.data;
            console.log(ipInfoData);
            const city = ipInfoData.city || "Lagos";
            //'https://api.tomorrow.io/v4/weather/forecast?location=new%20york&apikey=cz10yWbD2RPNm0h8V8qZeCR6bMbbTnvj'
            const weatherApiUrl = `${weatherApiBaseUrl}?location=${city}&apikey=${weatherApiToken}`;
            const weatherApiResponse = yield axios_1.default.get(weatherApiUrl);
            const weatherData = weatherApiResponse.data.timelines.minutely[0].values.temperature;
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
            response.status(500).send(error);
        }
    });
}
