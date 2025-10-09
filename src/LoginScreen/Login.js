// src/components/Login.js
import React from "react";
import { auth, loginGoogle, logout } from "../Services/Firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? (
        <>
          <p>Bem-vindo, {user.displayName} 🍹</p>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <button onClick={loginGoogle}>Entrar com Google</button>
      )}
    </div>
  );
}
