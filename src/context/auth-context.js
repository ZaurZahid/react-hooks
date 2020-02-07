import React,{useState} from "react";

export const AuthContext = React.createContext({
  isAuth: false,//default values 
  isLogin: () => {}
});

const AuthContextProvider = props => {
    const [isAuthenticated,setIsAuthenticated]=useState(false);

    const isLoginHandler=()=>{
        setIsAuthenticated(true)
    }
  return ( <AuthContext.Provider value={{isAuth:isAuthenticated,isLogin:isLoginHandler}}>{props.children}</AuthContext.Provider>);
};
export default AuthContextProvider