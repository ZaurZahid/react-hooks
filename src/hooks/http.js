import {
  useReducer,
  useCallback
} from "react"; /*useCallback for unnecessary rendering */

const initialState = {
  spinner: false,
  error: null,
  data: null,
  extraReq: null,
  identifier: null
};

const HttpReducer = (curState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        ...curState,
        spinner: true,
        data: null,
        extraReq: null,
        identifier: action.identifier
      };
    case "RESPONSE":
      return {
        ...curState,
        spinner: false,
        data: action.responseData,
        extraReq: action.extraReq
      };
    case "CLEAR":
      return initialState;//evvelki kimi ele
    case "ERROR":
      return { spinner: false, error: action.errorMessage }; //errorda ikiside deyisir bu birilerde ancaq biri amma
    default:
      throw new Error("Should not get there");
  }
};

const useHttp = () => {
  const clearModal=useCallback(()=>{
    dispatchHTTP({ type: "CLEAR"});
  },[])
  //istediyim hook u istifade ede bilerem

  const [httpState, dispatchHTTP] = useReducer(HttpReducer, initialState); //ilkin deyer  {spinner:false,error:null}

  const sendRequest = useCallback((url, method, body, extraReq, ings) => {
    dispatchHTTP({ type: "SEND", identifier: ings });
    fetch(
      url,
      // `https://fruits-a6372.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(response => response.json())
      .then(responseData => {
        // setSpinner(false);
        dispatchHTTP({
          type: "RESPONSE",
          responseData: responseData,
          extraReq: extraReq
        });
      })
      .catch(err => {
        dispatchHTTP({ type: "ERROR", errorMessage: err.message });

        // setSpinner(false);
        // setError("Something went wrong...");
      });
  }, []);

  return {
    spinner: httpState.spinner,
    data: httpState.data,
    extraReq: httpState.extraReq,
    identifier: httpState.identifier,
    error: httpState.error,
    sendRequest: sendRequest,
    clearModal:clearModal
  };
};

export default useHttp;
