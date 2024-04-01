import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../css/weeklySection.css';

/*weather Icon*/
import water_drop from "../../assets/water_drop.png";
import weather_sun from "../../assets/weather_sun.png";
import weather_blur from "../../assets/weather_blur.png";
import manyRain from "../../assets/manyRain.png";
import weather_Rain from "../../assets/Rain.png";
import weather_snow from "../../assets/snow.png";
import sun_blur from "../../assets/sun_blur.png";
import rain_snow from "../../assets/Rain_snow.png";

const WeeklyPart = (props) => {
    const [currentInfo, setCurrentInfo] = useState({}); //단기예보data
    const [addressInfo, setAddInfo] = useState(); //중기육상예보data
    const [weeklyTemp, setWeeklyTemp] = useState(); //중기기온예보data
    const [minTempArray, setMinTempArray] = useState([0, 0, 0, 0, 0]); //최저온도 
    const [maxTempArray, setMaxTempArray] = useState([0, 0, 0, 0, 0]); //최고온도 
    const [rnstArray, setRnstArray] = useState([]); // 강수량
    const [wfArray, setWfArray] = useState([]); // 날씨
    const [wfPmArray, setWfPmArray] = useState([]); // 날씨
    useEffect(() => {
        setCurrentInfo(props.selectLocData);
    }, [props.selectLocData]);
    useEffect(() => { setAddInfo(props.midData); }, [props.midData]);
    useEffect(() => { setWeeklyTemp(props.weekTempData); }, [props.weekTempData]);
    //현재 시간
    const [dayArray, setDayArray] = useState([]); //요일

    const today = new Date();
    let year = String(today.getFullYear());
    let month = String(today.getMonth() + 1);
    let date = String(today.getDate());
    let hour = String(today.getHours());
    let day = today.getDay();
    const timeValue = (hour.length !== 2) ? '0' + String(hour) + '00' : String(hour) + '00';

    month = (month.length !== 2) ? '0' + month : month;
    date = (date.length !== 2) ? '0' + date : date;
    const todayDate = year + month + date; // 오늘 날짜
    
    today.setDate(today.getDate() + 1);
    let yearTom = String(today.getFullYear());
    let monthTom = String(today.getMonth() + 1);
    let dateTom = String(today.getDate());
    let dayTom = today.getDay();
    monthTom = (monthTom.length !== 2) ? '0' + monthTom : monthTom;
    dateTom = (dateTom.length !== 2) ? '0' + dateTom : dateTom;
    const nextDate = yearTom + monthTom + dateTom; // 내일 날짜

    today.setDate(today.getDate() + 1);
    let [yearAfter, monthAfter, dateAfter] = [String(today.getFullYear()), String(today.getMonth() + 1), String(today.getDate())];
    monthAfter = (monthAfter.length !== 2) ? '0' + monthAfter : monthAfter;
    dateAfter = (dateAfter.length !== 2) ? '0' + dateAfter : dateAfter;
    const afterDate = yearAfter + monthAfter + dateAfter; // 모레 날짜

    let weekList = [];
    let i = 1;
    while (i < 9) {
        switch ((day + i) % 7) {
            case 0: weekList.push("일요일"); break;
            case 1: weekList.push("월요일"); break;
            case 2: weekList.push("화요일"); break;
            case 3: weekList.push("수요일"); break;
            case 4: weekList.push("목요일"); break;
            case 5: weekList.push("금요일"); break;
            case 6: weekList.push("토요일"); break;
        }
        i++;
    }
    useEffect(() => { setDayArray([...weekList]); }, [])

    const setWeatherIcon = (dateV, timeV) => {
        if (currentInfo[nextDate] != undefined) {
            // 아이콘 날씨 정보에 맞게 세팅 / PTY (0 없음) (1 비) (2 비/눈) (3 눈) (4 소나기) SKY (1 맑음) (3 구름 많음) (4 흐림)
            if (currentInfo[dateV][timeV]['PTY'] == 0) {
                const skyStation = currentInfo[dateV][timeV]['SKY'];

                if (skyStation == 4) { // sky 흐림
                    return weather_blur;
                } else if (skyStation == 1) { //sky 맑음
                    return weather_sun;
                } else if (skyStation == 3) { // sky 구름 많음
                    return sun_blur;
                }
            } else {
                const ptyStation = currentInfo[dateV][timeV]['PTY'];

                if (ptyStation == 1) { // pty 비
                    return weather_Rain;
                } else if (ptyStation == 2) { // pty 비/눈
                    return rain_snow;
                } else if (ptyStation == 3) { // pty 눈 
                    return weather_snow;
                } else if (ptyStation == 4) {
                    return manyRain;
                }
            }
        }//todayPart
    }//setWeatherIcon

    //내일 날씨
    const tomorrowTemp = () => {
        if (currentInfo[nextDate] != undefined && addressInfo != undefined && weeklyTemp != undefined) {
            return <ul className="weeklyData dayOfWeek plusDay1">
                <li>{weekList[0]}</li>
                <li>
                    <img className="waterDrop" src={water_drop} alt="강수량" />
                    <p>{currentInfo[nextDate][timeValue]['REH']}</p>
                    <p>%</p>
                </li>
                <li>
                    <img className="weeklyWeatherIcon" src={setWeatherIcon(nextDate, '0600')} alt='날씨 아이콘' />
                    <p className="tempNum">{parseInt(currentInfo[nextDate]['0600']['TMN'])}°</p>
                </li>
                <li>
                    <img className="weeklyWeatherIcon" src={setWeatherIcon(nextDate, '1500')} alt="날씨 아이콘" />
                    <p className="tempNum">{parseInt(currentInfo[nextDate]['1500']['TMP'])}°</p>
                </li>
            </ul>
        }
    }

    //모레 날씨
    const dayAfterTemp = () => {
        if (currentInfo[nextDate] != undefined && addressInfo != undefined && weeklyTemp != undefined) {
            return <ul className="weeklyData dayOfWeek plusDay1">
                <li>{weekList[1]}</li>
                <li>
                    <img className="waterDrop" src={water_drop} alt="강수량" />
                    <p>{currentInfo[afterDate][timeValue]['REH']}</p>
                    <p>%</p>
                </li>
                <li>
                    <img className="weeklyWeatherIcon" src={setWeatherIcon(afterDate, '0600')} alt='날씨 아이콘' />
                    <p className="tempNum">{parseInt(currentInfo[afterDate]['0600']['TMN'])}°</p>
                </li>
                <li>
                    <img className="weeklyWeatherIcon" src={setWeatherIcon(afterDate, '1500')} alt="날씨 아이콘" />
                    <p className="tempNum">{parseInt(currentInfo[afterDate]['1500']['TMP'])}°</p>
                </li>
            </ul>
        }
    }

    //======중기예보 api 다루기 ========//
    today.setDate(today.getDate() - 1);
    const yearNum = String(today.getFullYear());
    const monthNum = ('0' + String(today.getMonth() + 1)).slice(-2);
    const dateNum2 = ('0' + String(today.getDate())).slice(-2); //날짜
    const requestData2 = yearNum + monthNum + dateNum2;

    useEffect(() => { 
        if (weeklyTemp != undefined) {
            let minArray = [
                weeklyTemp.taMin4,
                weeklyTemp.taMin4,
                weeklyTemp.taMin5,
                weeklyTemp.taMin6,
                weeklyTemp.taMin7,
            ];
            let maxArray = [
                weeklyTemp.taMax3,
                weeklyTemp.taMax4,
                weeklyTemp.taMax5,
                weeklyTemp.taMax6,
                weeklyTemp.taMax7,
            ];
            setMinTempArray([...minArray]);
            setMaxTempArray([...maxArray]);
        }
    }, [weeklyTemp])
    
    useEffect(() => {
        if (addressInfo != undefined) {
            let rnArray = [
                addressInfo.rnSt3Am,
                addressInfo.rnSt4Am,
                addressInfo.rnSt5Am,
                addressInfo.rnSt6Am,
                addressInfo.rnSt7Am,
                addressInfo.rnSt8,
                addressInfo.rnSt9,
                addressInfo.rnSt10
            ]
            let wfArray = [
                addressInfo.wf3Am,
                addressInfo.wf4Am,
                addressInfo.wf5Am,
                addressInfo.wf6Am,
                addressInfo.wf7Am,
                addressInfo.wf8,
                addressInfo.wf9,
                addressInfo.wf10
            ]
            let wfPmArr = [
                addressInfo.wf3Pm,
                addressInfo.wf4Pm,
                addressInfo.wf5Pm,
                addressInfo.wf6Pm,
                addressInfo.wf7Pm,
                addressInfo.wf8,
                addressInfo.wf9,
                addressInfo.wf10
            ]
            //날씨 값
            wfArray.forEach((value, index, array) => {
                switch (value) {
                    case "맑음": array[index] = weather_sun; break;
                    case "구름많음": array[index] = weather_blur; break;
                    case "구름많고 비": array[index] = weather_Rain; break;
                    case "구름많고 눈": array[index] = weather_snow; break;
                    case "구름많고 비/눈": array[index] = rain_snow; break;
                    case "구름많고 소나기": array[index] = manyRain; break;
                    case "흐림": array[index] = weather_blur; break;
                    case "흐리고 비": array[index] = weather_Rain; break;
                    case "흐리고 눈": array[index] = weather_snow; break;
                    case "흐리고 비/눈": array[index] = rain_snow; break;
                    case "흐리고 소나기": array[index] = weather_Rain; break;
                }
            })

            wfPmArr.forEach((value, index, array) => {
                switch (value) {
                    case "맑음": array[index] = weather_sun; break;
                    case "구름많음": array[index] = weather_blur; break;
                    case "구름많고 비": array[index] = weather_Rain; break;
                    case "구름많고 눈": array[index] = weather_snow; break;
                    case "구름많고 비/눈": array[index] = rain_snow; break;
                    case "구름많고 소나기": array[index] = manyRain; break;
                    case "흐림": array[index] = weather_blur; break;
                    case "흐리고 비": array[index] = weather_Rain; break;
                    case "흐리고 눈": array[index] = weather_snow; break;
                    case "흐리고 비/눈": array[index] = rain_snow; break;
                    case "흐리고 소나기": array[index] = weather_Rain; break;
                }
            })

            setRnstArray([...rnArray]);
            setWfArray([...wfArray]);
            setWfPmArray([...wfPmArr]);
        }
    }, [addressInfo]);

    const weeklyDataPush = () => { 
        if (currentInfo[nextDate] != undefined && addressInfo != undefined && weeklyTemp != undefined) {
            const dataTest = minTempArray.map((value, index) => {
                return (
                    <ul className="weeklyData dayOfWeek plusDay1" key={index}>
                        <li>{weekList[index+2]}</li>
                        <li>
                            <img className="waterDrop" src={water_drop} alt="강수량" />
                            <p>{rnstArray[index]}</p>
                            <p>%</p>
                        </li>
                        <li>
                            <img className="weeklyWeatherIcon" src={wfArray[index]} alt='날씨 아이콘' />
                            <p className="tempNum">{minTempArray[index]}°</p>
                        </li>
                        <li>
                            <img className="weeklyWeatherIcon" src={wfPmArray[index]} alt="날씨 아이콘" />
                            <p className="tempNum">{maxTempArray[index]}°</p>
                        </li>
                    </ul>
                )
            })//minTempArray
            return dataTest;
        }
    };

    const cleanData = () => { 
        setCurrentInfo(undefined);
        setAddInfo(undefined);
        setWeeklyTemp(undefined);
    }

    return (
        <div className="weeklyInfo">
            <h3>주간예보</h3>
            {tomorrowTemp()}
            {dayAfterTemp()}
            {weeklyDataPush()}
        </div>
    )}
export default WeeklyPart;