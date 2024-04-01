import React, { useEffect, useState } from "react";
import { useHorizontalScroll } from "./useSideScroll";
import '../css/todaySection.css';

import water_drop from "../../assets/water_drop.png";
import weather_sun from "../../assets/weather_sun.png";
import weather_blur from "../../assets/weather_blur.png";
import manyRain from "../../assets/manyRain.png";
import weather_Rain from "../../assets/Rain.png";
import weather_snow from "../../assets/snow.png";
import sun_blur from "../../assets/sun_blur.png";
import rain_snow from "../../assets/Rain_snow.png";

const TodayPart = (props) => {
    const [perceivedTemperature, setPreTemp] = useState();  //날씨 JSON Data
    const [currentInfo, setCurrentInfo] = useState({});  //날씨 JSON Data
    useEffect(() => { setCurrentInfo(props.selectLocData) }, [props.selectLocData]);

    //오늘 날짜, 현재 시간 설정
    const today = new Date();
    const [yearNum, monthNum, dateNum, currentHour] = [String(today.getFullYear()), ('0'+String(today.getMonth() + 1)).slice(-2), ('0'+ String(today.getDate())).slice(-2), String('0'+today.getHours()).slice(-2)];
    const timeJsonValue = (String(currentHour) + '00').slice(-4); //JSON 데이터상 시간 형식

    today.setDate(today.getDate());//오늘 날짜
    const todayDate = yearNum + monthNum + dateNum;

    const weekData = ['일', '월', '화', '수', '목', '금', '토'];//요일 설정
    const dayOfWeek = weekData[new Date(`${yearNum}-${monthNum}-${dateNum}`).getDay()];
    
    today.setDate(today.getDate() + 1);//내일 날짜
    const year2 = String(today.getFullYear());
    const month2 = ('0' + String(today.getMonth() + 1)).slice(-2);
    const day2 = ('0' + String(today.getDate())).slice(-2);
    const tomorrowDate = year2 + month2 + day2;//내일 년월일

    //값 대입 함수
    const humidityLevel = (dataValue) => { 
        if (currentInfo[todayDate] != undefined) { 
            if (dataValue == 'TMN') {
                let humLevel = parseInt(currentInfo[todayDate]['0600'][dataValue]);
                return humLevel;
            } else if (dataValue == 'TMX') { 
                let humLevel = parseInt(currentInfo[todayDate]['1500'][dataValue]);
                return humLevel;
            } else {
                let humLevel = currentInfo[todayDate][timeJsonValue][dataValue];
                return humLevel;
            }
        }
    }//humidityLevel

    //날씨 아이콘 지정 함수
    const setWeatherIcon = (dateV ,timeV) => { //dateV = 가져올 날짜, timeV = 가져올 시간
            if (currentInfo[todayDate] != undefined) { //데이터를 받아왔을 때 실행
                // 아이콘 날씨 정보에 맞게 세팅 / PTY (0 없음) 기(1 비) (2 비/눈) (3 눈) (4 소나기) SKY (1 맑음) (3 구름 많음) (4 흐림)
                if (currentInfo[dateV][timeV]['PTY'] == 0) { // 비 정보 0 일 때
                    const skyStation = currentInfo[dateV][timeV]['SKY'];

                    if (skyStation == 4) { // sky 흐림
                        return weather_blur;
                    } else if (skyStation == 1) { //sky 맑음
                        return weather_sun;
                    } else if (skyStation == 3) { // sky 구름 많음
                        return sun_blur;
                    }
                } else { // 비 정보 0 이 아닐 때
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
    }//setWeatherIcon()

    // 시간별 데이터 입력
    const setTimeData = () => { 
        if (currentInfo[todayDate] != undefined) {
            const timeDataUl = [];
            for (let i = 0; i < 24; i++) { // 현재시간 + 1 부터 다음날 24시 넘기 전까지
                if (parseInt(currentHour) + i < 23) {
                    const timeStamp = ('0' + String(parseInt(currentHour) + i + 1)+ '00').slice(-4);
                    timeDataUl.push(
                        <li className="currentHour" key={i}>
                            <div>{parseInt(currentHour) + i + 1 }시</div>
                            <div><img id="todayHourWeather" className="todayHourWeather" src={setWeatherIcon(todayDate, timeStamp)} /></div>
                            <div><span className="timeCurnt">{currentInfo[todayDate][timeStamp]['TMP']}</span><span>°</span></div>
                        </li>
                    )
                } else { // 다음날 0시 부터
                    const timeStamp2 = ('0'+ String(parseInt(currentHour) - 24 + i + 1) + '00').slice(-4);
                    timeDataUl.push(
                        <li className="currentHour" key={i}>
                            <div>{ parseInt(currentHour) - 24 + i + 1 }시</div>
                            <div><img id="todayHourWeather" className="todayHourWeather" src={setWeatherIcon(tomorrowDate, timeStamp2)} /></div>
                            <div><span className="timeCurnt"></span>{ currentInfo[tomorrowDate][timeStamp2]['TMP']}<span>°</span></div>
                        </li>
                    )
                }// if문
            }//for문

            return timeDataUl;
        }//if
    }//setTimeData()

    const scrollRef = useHorizontalScroll();

    return (
        <section className="todayInfoSection">
            <div className="todayTopDetail">
                <div className="dateWeatherData">
                    <img id="currentWeatherIcon" className="todayWeather" src={setWeatherIcon(todayDate, timeJsonValue)} />
                    <div className="topTop_detail">
                        <h2>Today</h2>
                        <div className="detailDate">
                            {monthNum}/{dateNum} { dayOfWeek }
                        </div>
                    </div>
                </div>
                <div className="temperatureData">
                    <div className="currentBox">
                        <h2 className="currentTemp">{humidityLevel('TMP')}</h2><span>°</span>
                    </div>
                    <div className="lowest_highestTemp">
                        <p>
                            최저 : <span className="TMNNum">{humidityLevel('TMN')}</span>°
                        </p>
                        <p>
                            최고 : <span className="TMXNum">{humidityLevel('TMX')}</span>°
                        </p>
                    </div>
                </div>
                
                <div className="todayAnotherInfo">
                    <ul className="detailAnotherInfo">
                        <li className="li_style humidityData">
                            <div>습도</div>
                            <h4 className="humidityNum">{humidityLevel('REH')}%</h4>
                        </li>
                        <li className="li_style precipitationProbabilityData">
                            <div>강수량</div>
                            <h4 className="precipitationData">{humidityLevel('POP')}%</h4>
                        </li>
                        <li className="li_style precipitationProbabilityData">
                            <div>풍속</div>
                            <h4 className="precipitationData">{humidityLevel('WSD')}m/s</h4>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="timeSetOutBox">
                <ul id="timeDataUl" className="timeDataUl" ref={scrollRef}>{setTimeData()}</ul>
            </div>
        </section>
    )
}
export default TodayPart ;