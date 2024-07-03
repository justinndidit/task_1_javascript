import { Response, Request } from "express";
import axios from "axios";
import requestIp from "request-ip";

export async function getUserDetailsAndGreet(request: Request, response: Response) {
    const visitorName = request.query.visitor_name as string;
    const userIp  =   requestIp.getClientIp(request);
    const weatherApiToken = process.env.weatherApiToken?.toString();

    const weatherApiBaseUrl="https://api.tomorrow.io/v4/weather/forecast";   
    const ipInfoUrl: string = `http://ip-api.com/json/${userIp}`;

    try {
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const ipInfoData = ipInfoResponse.data;
        console.log(ipInfoData);
        const city = ipInfoData.city || "Lagos";

        //'https://api.tomorrow.io/v4/weather/forecast?location=new%20york&apikey=cz10yWbD2RPNm0h8V8qZeCR6bMbbTnvj'
        const weatherApiUrl: string = `${weatherApiBaseUrl}?location=${city}&apikey=${weatherApiToken}`;
        const weatherApiResponse = await axios.get(weatherApiUrl);
        
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
