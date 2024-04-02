import '../css/searchSection.css'
import React, { useState, useEffect } from 'react';
import locationAddress from './locationAddress';
import axios from 'axios';
import Loading from './loading';

import WeeklyPart from './weeklySeciton';
import TodayPart from './todaySection';

/* weather image */
import search_icon from "../../assets/search_icon.png";

//지역리스트 배열 만들기
const wholeLocationArr = locationAddress.map((lctInfo, index) => {
    return ({ step1: `${lctInfo.step1}`, step2: `${lctInfo.step2}`, address: `${lctInfo.totalAddress}`, X: `${lctInfo.X}`, Y: `${lctInfo.Y}`, midLoc: `${lctInfo["mid-termForecastCode"]}`});
});

const justLocArr = wholeLocationArr.map((lctInfo, index) => {
    return ( lctInfo.address );
})

//----------------자동검색 기능 구현 -------------------//
const AutoComplete = (props) => {
    const [inputValue, setInputValue] = useState(''); //input에 입력된 값 
    //inputValue에 값을 가지고 있는지 아닌지 확인 (가지고 있다면 true, 가지고 있지 않다면 false)
    const [isHaveInputValue, setIsHaveInputValue] = useState(false);
    const [dropDownList, setDropDownList] = useState(justLocArr);
    const [dropDownItemIndex, setDropDownItemIndex] = useState(-1); //검색어 연관 주소 드롭다운
    //기본 설정
    const [locData, setLocData] = useState([{ 'step1': '경기도', 'step2': '안산시 단원구', 'address': '경기도 안산시 단원구', 'X': 57, 'Y': 121, 'midLoc': '11B20203' }]);
    //날씨 apiData
    const [midAddress, setMidAddress] = useState([{ 'step1': '경기도', 'step2': '안산시 단원구', 'address': '경기도 안산시 단원구', 'X': 57, 'Y': 121, 'midLoc': '11B20203' }]);
    const [apiData, setAPIdata] = useState(); // 단기예보
    const [mDataArray, setMDataArray] = useState(); // 중기육상예보조회
    const [mWeekTempArray, setMWeekArr] = useState();// 중기기온조회
    const [loading, setLoading] = useState(true)    //로딩창;

    const sendMidJSON = () => {
        let dataArr = mDataArray;
        return dataArr;
    }

    const weekTempJSON = () => { 
        let weekTJson = mWeekTempArray;
        return weekTJson;
    }

    //주소 리스트 보여줌
    const showDropDownList = () => {
        if (inputValue === undefined) {
            setIsHaveInputValue(false);
            setDropDownList([]);
        } else {
            const choosenTextList = justLocArr.filter(locationInfo =>
                locationInfo.replace(/ /g, "").includes(inputValue.replace(/ /g, ""))
            )
            setDropDownList(choosenTextList);
        }
    }

    // 위치 value값 바뀜
    const changeInputValue = event => {
        if (event.target.value[0] !== ' ') {
            setInputValue(event.target.value);
            setIsHaveInputValue(true);
        }
    }

    // 입력한 주소랑 매칭하기
    const clickDropDownItem = clickedItem => {
        setInputValue(clickedItem);
        let choosenLocation = [];
        choosenLocation = wholeLocationArr.filter(locationData =>
            locationData.address === clickedItem
        )
        setIsHaveInputValue(false);
        if (choosenLocation[0] != null) {
            basicGetAPI(choosenLocation[0].X, choosenLocation[0].Y, choosenLocation[0].midLoc, choosenLocation[0].address)
            setMidAddress(choosenLocation);
            setAPIdata();
            document.querySelector('.inputAddress').value = '';
            setInputValue('');
        }
    }

    useEffect(showDropDownList, [inputValue])
    
    //Enter 누를시
    const activeEnter = event => {
        if (isHaveInputValue) {
            if (event.key === 'Enter') {
                let choosenLocation = [];
                choosenLocation = wholeLocationArr.filter(locationData =>
                    locationData.address.replace(/ /g, "") === inputValue.replace(/ /g, "")
                )
                setLocData({ choosenLocation })
                setIsHaveInputValue(false);
                
                if (choosenLocation[0] != null) {
                    basicGetAPI(choosenLocation[0].X, choosenLocation[0].Y, choosenLocation[0].midLoc, choosenLocation[0].address);
                    setMidAddress(choosenLocation);
                    setAPIdata();
                }
            }
        }
    }

    //======단기예보 api 다루기 ========//
    const basicGetAPI = (locX, locY, midLoc, addressInfo) => {
        const today = new Date();
        const [yearNum, monthNum, dateNum1, currentDate] = [String(today.getFullYear()), ('0'+String(today.getMonth() + 1)).slice(-2), ('0'+String(today.getDate())).slice(-2), today.getHours()];
        today.setDate(today.getDate()-1);
        const yearNum2 = String(today.getFullYear());
        const monthNum2 = ('0' + String(today.getMonth()+1)).slice(-2); 
        const dateNum2 = ('0'+String(today.getDate())).slice(-2);
        const [requestData1, requestData2] = [yearNum + monthNum + dateNum1, yearNum2 + monthNum2 + dateNum2];
        
        const API_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
        const API_KEY = process.env.FIRST_API_KEY;

        // 단기예보 - 3시 이후 오늘 날짜로 API 데이터 가져오기
        if (currentDate >= 3) {
            setLoading(true); // api 호출 전에 true로 변경하여 로딩화면 띄우기
            axios.get(`${API_URL}?serviceKey=${API_KEY}&pageNo=3&numOfRows=1000&dataType=JSON&base_date=${requestData1}&base_time=0200&nx=${locX}&ny=${locY}`)
                .then(res => {
                    setAPIdata(res.data);
                    setLoading(false); // api 호출 완료 됐을 때 false로 변경하려 로딩화면 숨김처리
                })
                .catch(err => console.log(err));
        }
        // 단기예보 - 3시 이전 어제 날짜로 API 데이터 가져오기
        else if (currentDate < 3) {
            setLoading(true);
            axios.get(`${API_URL}?serviceKey=${API_KEY}&pageNo=3&numOfRows=1000&dataType=JSON&base_date=${requestData2}&base_time=0200&nx=${locX}&ny=${locY}`)
                .then(res => {
                    setAPIdata(res.data);
                    setLoading(false); 
                })
                .catch(err => console.log(err));
        }

        //현재 위치 - 중기육상예보구역
        let location1 = "11B00000";
        if (/^경기\w*/.test(addressInfo)) { location1 = "11B00000"; }    
        else if ((/^강원도 철원|강원도 춘천|강원도 홍천|강원도 화천|강원도 양구군|강원도 인제군|강원도 원주|강원도 횡성|강원도 영월|강원도 평창군|강원도 정선\w*/).test(addressInfo)) { location1 = "11D10000"}
        else if (/^강원도 강릉|강원도 동해시|강원도 속초|강원도 삼척|강원도 태백시|강원도 고성군|강원도 양양\w*/.test(addressInfo)) { location1 = "11D20000" }
        else if (/^대전광역시|세종특별자치시|충청남도\w*/.test(addressInfo)) { location1 = "11C20000" }
        else if (/^충청북도\w*/.test(addressInfo)) { location1 = "11C10000"; }
        else if (/^광주광역시|전라남도\w*/.test(addressInfo)) { (location1 = "11F20000") }
        else if (/^전라북도\w*/.test(addressInfo)) { location1 = "11F10000" }
        else if (/^경상북도|대구\w*/.test(addressInfo)) { location1 = "11H10000" }
        else if (/^경상남도|부산광역시|울산\w*/.test(addressInfo)) { location1 = "11H20000" }
        else if (/^제주\w*/.test(addressInfo)) { (location1 = "11G00000"); }

        //======중기예보 api 다루기 ========//
        if (midAddress != null) {
            const API_URL1 = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa';
            const API_URL2 = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst';
            const API_KEY = process.env.SECOND_API_KEY;
            //중기기온조회 (최고온도/최저온도)
            if (currentDate >= 7) {
                axios.get(`${API_URL1}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${midLoc}&tmFc=${requestData1}0600`)
                    .then(res => {
                        if (res.data != undefined) {
                            setMWeekArr(res.data.response.body.items.item[0]);
                        }
                    })
                    .catch(err => console.log(err));
            }
            else if (currentDate < 7) {
                axios.get(`${API_URL1}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${midLoc}&tmFc=${requestData2}0600`)
                    .then(res => {
                        if (res.data != undefined) {
                            setMWeekArr(res.data.response.body.items.item[0]);
                        }
                    })
                    .catch(err => console.log(err));
            }

            //중기육상예보조회 (강수량/날씨)
            if (currentDate >= 7) {
                axios.get(`${API_URL2}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${location1}&tmFc=${requestData1}0600`)
                    .then(res => {
                        setMDataArray(res.data.response.body.items.item[0]);
                    })
                    .catch(err => console.log(err));
            }
            else if (currentDate < 7) {
                axios.get(`${API_URL2}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${location1}&tmFc=${requestData2}0600`)
                    .then(res => {
                        setMDataArray(res.data.response.body.items.item[0]);
                    })
                    .catch(err => console.log(err));
            }
        }
    }
    useEffect(() => {
        basicGetAPI(locData[0].X, locData[0].Y, locData[0].midLoc, locData[0].address);
    }, [])

    //단기예보 JSON자료 메이킹
    const makingNewJSON = () => {
        // 날짜 만들기
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate());
        const currentHour = todayDate.getHours();
        const yearInfo = String(todayDate.getFullYear());
        const month1 = ('0' + String(todayDate.getMonth() + 1)).slice(-2);
        const day1 = todayDate.getDate();

        // 첫 번째 날짜
        const todayD = currentHour >= 3 ? yearInfo + month1 + ('0' + String(day1)).slice(-2) : yearInfo + month1 + ('0' + String(day1 - 1)).slice(-2);

        todayDate.setDate(todayDate.getDate()+1);
        const year2 = String(todayDate.getFullYear());
        const month2 = ('0' + String(todayDate.getMonth() + 1)).slice(-2);
        const day2 = ('0' + String(todayDate.getDate())).slice(-2);

        // 두 번째 날짜
        const tomorrowDate = currentHour >= 3 ? year2 + month2 + ('0' + String(day2)).slice(-2) : year2 + month1 + ('0' + String(day1)).slice(-2);
        
        todayDate.setDate(todayDate.getDate()+1);
        const year3 = String(todayDate.getFullYear());
        const month3 = ('0' + String(todayDate.getMonth() + 1)).slice(-2);
        const day3 = ('0' + String(todayDate.getDate())).slice(-2);

        // 세 번째 날짜
        const day3Date = currentHour >= 3 ? year3 + month3 + ('0' + String(day3)).slice(-2) : year3 + month3 + ('0' + String(day2)).slice(-2);

        const dayArray = [todayD, tomorrowDate, day3Date];
        
        const totalAddress = {}
        
        if (apiData != undefined) { 
            const timeType = ['0000', '0100', '0200', '0300', '0400', '0500', '0600', '0700', '0800', '0900', '1000','1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800', '1900', '2000', '2100', '2200', '2300']
            const firstDayTimeType = ['0300', '0400', '0500', '0600', '0700', '0800', '0900', '1000','1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800', '1900', '2000', '2100', '2200', '2300']

            const timeSetData = {};
            firstDayTimeType.forEach((v, i, a) => {
                const timeTest = apiData.response.body.items.item.filter((todayInfo, index) =>
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'POP') ||
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'SKY') ||
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'TMP') ||
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'TMN') ||
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'TMX') ||
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'REH') ||
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'WSD') ||
                    (todayInfo.fcstDate === todayD && todayInfo.fcstTime === v && todayInfo.category === 'PTY')
                    )
                const timeTest2 = {};
                timeTest.forEach((v, i, a) => { 
                    timeTest2[v.category] = v.fcstValue;
                })
                timeSetData[v] = timeTest2;
            })

            const timeSetData2 = {};
            timeType.forEach((v, i, a) => {
                const timeTest = apiData.response.body.items.item.filter((todayInfo, index) =>
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'POP') ||
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'SKY') ||
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'TMP') ||
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'TMN') ||
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'TMX') ||
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'REH') ||
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'WSD') ||
                    (todayInfo.fcstDate === tomorrowDate && todayInfo.fcstTime === v && todayInfo.category === 'PTY')
                )
                const timeTest2 = {};
                timeTest.forEach((v, i, a) => { 
                    timeTest2[v.category] = v.fcstValue;
            })
                timeSetData2[v] = timeTest2;
            })
            
            const timeSetData3 = {};
            timeType.forEach((v, i, a) => {
                const timeTest = apiData.response.body.items.item.filter((todayInfo, index) =>
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'POP') ||
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'SKY') ||
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'TMP') ||
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'TMN') ||
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'TMX') ||
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'REH') ||
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'WSD') ||
                    (todayInfo.fcstDate === day3Date && todayInfo.fcstTime === v && todayInfo.category === 'PTY')
                )
                const timeTest3 = {};
                timeTest.forEach((v, i, a) => {
                    timeTest3[v.category] = v.fcstValue;
                })
                timeSetData3[v] = timeTest3
            })
            totalAddress[todayD] = timeSetData;
            totalAddress[tomorrowDate] = timeSetData2;
            totalAddress[day3Date] = timeSetData3;
        }
        return totalAddress
    }
    
    return (
        <section className='totalPage' onClick={() => setIsHaveInputValue(false)}>
            {loading && <Loading />}
            <section className="leftZone">
                <section className="wholeBox">
                    <title text='AutoComplete'></title>
                    <div className="inputBox" value={isHaveInputValue}>
                        <div className="printText">
                            <input className="inputAddress"
                                type='text'
                                name='address'
                                value={inputValue}
                                onChange={changeInputValue}
                                onKeyDown={activeEnter}
                                placeholder='Search new place'
                                autoComplete='off'
                            />
                            <button className="deleteBtn" onClick={(e) => setInputValue('')}>
                                <i className="closeBtn xi-close"></i>
                            </button>
                        </div>
                    </div>
                    {isHaveInputValue && (
                        <div className='dropDownBox'>
                            {dropDownList.length === 0 && (
                                <div className="dropDownItem">해당하는 주소가 없습니다.</div>
                            )}
                            {dropDownList.map((dropDownItem, dropDownIndex) => { 
                                return (
                                    <div className="viewDropBox"
                                        key={dropDownItem}
                                        onClick={() => clickDropDownItem(dropDownItem)}>
                                        <img className="searchIcon" src={search_icon} alt="검색" />
                                        <div
                                        key={dropDownIndex}
                                        onKeyDown={activeEnter}
                                        onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                                        className={ dropDownItemIndex === dropDownIndex ? 'selected' : ''}>
                                            {dropDownItem}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <h1><i className="xi-maker"></i>{midAddress[0]['address']}</h1>
                </section>
                <WeeklyPart className="weeklyPart" selectLocData={makingNewJSON()} midData={sendMidJSON()} weekTempData={weekTempJSON()} />
            </section>
            <TodayPart className="todayPart" selectLocData={makingNewJSON()} midData={sendMidJSON()} weekTempData={ weekTempJSON() }/>
        </section>
    )
}

export default AutoComplete;