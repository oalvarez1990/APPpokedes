import React, { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    console.log(userName);
  };

  return (
    <div>
      <form action="" onSubmit={submit}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Login;