import React, {
  useReducer,
  /* useState, */ useCallback,
  useEffect,
  useMemo
} from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const IngredientReducer = (currentState, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentState, action.ingredients];
    case "REMOVE":
      return currentState.filter(ing => ing.id !== action.id);
    default:
      throw new Error("Should not get there");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(IngredientReducer, []); //ilkin deyer []
  //custom hooks
  const { spinner, data, extraReq, identifier, error, sendRequest,clearModal } = useHttp();
 
  console.log("rendering");

  const addIngredientHandler = useCallback(
    ingredient => {
      // console.log("addIngredientHandler");

      //firebaseye yukle 

      sendRequest(
        `https://fruits-a6372.firebaseio.com/ingredients.json`,
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      ); 
    },
    [sendRequest]
  );

  const removeItemHandler = useCallback(
    ingredientId => {
      sendRequest(
        `https://fruits-a6372.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId, //extraReq ni burdan gonderirem
        'REMOVE_INGREDIENT'
      );
 
    },
    [sendRequest]
  );

  useEffect(() => {
    // console.log("hey");
    if (!spinner && !error && identifier==='REMOVE_INGREDIENT') {//data null olmamalidi spinner olanda data null olur axi
      dispatch({ type: "REMOVE", id: extraReq });
    } else if(!spinner && !error && identifier==='ADD_INGREDIENT') {
      //adding
      dispatch({
        type: "ADD",
        ingredients: { id: data.name, ...extraReq }
      });
    }
  }, [data, extraReq,identifier,spinner,error]); // - lar deyisende
//data null olursa demeli deyisilib bunun mutleq qabagini almaq lazimdi bunun ucun !spinner edirem

  const filteringElements = useCallback(filteredIngredients => {
    //useCallback use edirik yoxsa loopa girir
    dispatch({ type: "SET", ingredients: filteredIngredients }); //useReducerle bele olur
    // setUserIngredients(filteredIngredients); //useCallback funcu deyismir oldugu kimi tezeden istifade etmeye imkna verir
  }, []); //ancaq input dey. use ele (memoized version of callback)
 

  const ingredientList = useMemo(() => {
    //useCallback memoized qaytarir useMemo qebul edir
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeItemHandler}
      />
    );
  }, [userIngredients, removeItemHandler]); //bunlar deyisende

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearModal}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        onSpinner={spinner}
      />

      <section>
        <Search onloadIngredients={filteringElements} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
