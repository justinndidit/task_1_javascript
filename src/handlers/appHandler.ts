import { Response, Request } from "express";
import axios from "axios";

export async function getUserDetailsAndGreet(request: Request, response: Response) {
    const visitorName = request.query.visitor_name as string;
    const userIp  = request.socket.remoteAddress?.toString();
    const ipInfoBaseUrl = process.env.ipAddressBaseUrl?.toString();
    const ipInfoToken = process.env.ipAddressApiToken?.toString();
    const weatherApiBaseUrl = process.env.weatherApiBaseUrl?.toString();
    const weatherApiToken = process.env.weatherApiToken?.toString();
    const ipInfoUrl: string = `https://${ipInfoBaseUrl}/${userIp}?token=${ipInfoToken}`;

    try {
    
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const ipInfoData = ipInfoResponse.data;

        // console.log(ipInfoData);

        let locationData = ipInfoData?.loc?.split(" ") || ["6.5244" ,"3.3792"];
        const city = ipInfoData.city || "Lagos";
        const weatherApiUrl: string = `${weatherApiBaseUrl}?location=${locationData[0]},${locationData[1]}&apikey=${weatherApiToken}`;
        const weatherApiResponse = await axios.get(weatherApiUrl);
        // console.log(weatherApiResponse);
        const weatherData = weatherApiResponse.data.timelines.minutely[0].values.temperature;

        const greeting: string = `Hello, ${visitorName}!, the temperature is ${weatherData} degrees Celcius in ${city}`;
        const responseData = {
            client_ip: userIp,
            location: city,
            greeting 
        };

        response.status(200).json(responseData);
    } catch (error : any) {
        console.error(error.message);
        response.status(500).send(error);
    }
}
