import React from 'react';

const Form = ({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onSubmitForm
}) => {
  return (
    <div className="form">
      <form onSubmit={onSubmitForm}>
        <div>
          <input type="text" placeholder="username" value={username} onChange={(e) => onChangeUsername(e.target.value)}/>
        </div>
        <div>
          <input type="password" placeholder="password" value={password} onChange={(e) => onChangePassword(e.target.value)}/>
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Form;
