import React, { useState, useCallback, useEffect } from 'react';
import jwt_decode from "jwt-decode";

import logo from './logo.svg';
import './App.css';

import axios from 'axios';
import axiosInstance from './axios';

import Form from "./Form";

function App() {
  const [ user, setUser ] = useState(null);
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  useEffect(async () => {
    // 로컬스토리지 탐색 후 토큰이 있으면 확인
    try {
      const accessToken = localStorage.getItem('access_token');
      if(accessToken && !user) {
        const {data} = await axiosInstance.get('/auth/whoami');

        const { data: {user} } = data;
        setUser({
          id: user.id,
          name: user.username
        })
      }
    }
    catch(error) {
      console.log(error);
    }
  }, [user])

  const handleChangeUsername = useCallback((value) => {
    setUsername(value)
  }, [ username ]);

  const handleChangePassword = useCallback((value) => {
    setPassword(value)
  }, [ password ]);

  const handleClickLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    setUser(null);
  }, [user])

  const handleSubmitForm = useCallback(async (e) => {
    e.preventDefault();
    try {
      // 응답 데이터 받기
      const { data } = await axios.post('http://localhost:4000/api/auth/signin', {
        username,
        password
      });

      const { data: {
        access_token, refresh_token, expires_in
      }} = data;

      // storage 저장
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);

      const {id, name} = jwt_decode(access_token);
      setUser({
        id, name
      });
    }
    catch(error) {
      console.log(error);
    }
  }, [ username, password ]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          JWT TOKEN EXAMPLE
        </p>

        {!user ? (
          <Form
            username={username}
            password={password}
            onChangeUsername={handleChangeUsername}
            onChangePassword={handleChangePassword}
            onSubmitForm={handleSubmitForm}
          />
        ) : (
          <div>
            안녕하세요! {user.name} 님!
            <br/>
            <button onClick={handleClickLogout}>로그아웃</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
