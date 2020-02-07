import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";

import "./Search.css";

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const { onloadIngredients } = props; //bunu da gotururem cunki deps- de istifade olunur

  const {spinner, data,  error, sendRequest ,clearModal } = useHttp();

  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      // pauza edende x san kecibse bunu ele
      //+++++++++++++++++ console.log("hey man"); +++++++++++++++++
      if (enteredFilter === inputRef.current.value) {
        //eger inputdaki evvelki deyer current deyere beraberdirse onda render ele
        const query = //ne yazmisam
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`; //firebasenin ozunun querysi bele yazilir axtarisda
        sendRequest(
          "https://fruits-a6372.firebaseio.com/ingredients.json" + query,
          "GET"
        );
      }
    }, 1000);

    return () => {
      //birinci evvelkini temizle sonra yeniye kec
      clearTimeout(timer); //bunu elemesem yaddasda cache qalir ve her nese yazanda console.log("hey man") yazilir
      //amma indi ancaq 1 defe yazilir cunki evvelki zamani temizleyirem
    };
  }, [enteredFilter, sendRequest,inputRef]); //hem enteredFilter hem de func deyisilende useEffect ele

  useEffect(() => {
    if (!spinner && !error && data) {
      const loadedData = [];
      for (let key in data) {
        loadedData.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onloadIngredients(loadedData);
    }
  }, [data, error,spinner,onloadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearModal}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {spinner &&   <span>loading....</span> }
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={e => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
