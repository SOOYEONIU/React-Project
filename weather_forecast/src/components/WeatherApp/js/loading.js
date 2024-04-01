import React from 'react';
import { Background, LoadingText } from './loadingStyle';
import LoadingIcon from '../../assets/loading.gif'

export const Loading = () => {
    return (
        <Background>
            <img src={LoadingIcon} alt="로딩중" width="10%" />
            <LoadingText>잠시만 기다려 주세요.</LoadingText>
        </Background>
    );
};

export default Loading;