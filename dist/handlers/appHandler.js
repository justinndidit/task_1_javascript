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
//test
function getUserDetailsAndGreet(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const visitorName = request.query.visitor_name;
        const userIp = (_a = request.socket.remoteAddress) === null || _a === void 0 ? void 0 : _a.toString();
        // const ipInfoBaseUrl = process.env.ipAddressBaseUrl?.toString();
        // const ipInfoToken = process.env.ipAddressApiToken?.toString();
        // const weatherApiBaseUrl = process.env.weatherApiBaseUrl?.toString();
        // const weatherApiToken = process.env.weatherApiToken?.toString();
        //This is bad
        const weatherApiBaseUrl = "https://api.tomorrow.io/v4/weather/forecast";
        const weatherApiToken = "cz10yWbD2RPNm0h8V8qZeCR6bMbbTnvj";
        // const ipAddressBaseUrl="ipinfo.io/";
        // const ipAddressApiToken="2b6d7978deef20";
        const ipInfoUrl = `https://ipinfo.io/${userIp}?token=2b6d7978deef20`;
        try {
            const ipInfoResponse = yield axios_1.default.get(ipInfoUrl);
            const ipInfoData = ipInfoResponse.data;
            let locationData = ((_b = ipInfoData === null || ipInfoData === void 0 ? void 0 : ipInfoData.loc) === null || _b === void 0 ? void 0 : _b.split(" ")) || ["6.5244", "3.3792"];
            const long = locationData[0] || "6.5244";
            const lat = locationData[1] || "3.3792";
            const city = ipInfoData.city || "Lagos";
            //'https://api.tomorrow.io/v4/weather/forecast?location=new%20york&apikey=cz10yWbD2RPNm0h8V8qZeCR6bMbbTnvj'
            const weatherApiUrl = `${weatherApiBaseUrl}?location=${city}&apikey=${weatherApiToken}`;
            const weatherApiResponse = yield axios_1.default.get(weatherApiUrl);
            // console.log(weatherApiResponse);
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
