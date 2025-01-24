import { useState } from "react";
import "./App.css";
import Celda from "./components/Celda";

function App() {
  const [mapaValores, setMapaValores] = useState(Array(64).fill(" "));
  const [copiaMapaValores, setCopiaMapaValores] = useState(Array(64).fill(" "));

  const celdas = mapaValores.map((item, index) => (
    <div className="col-auto p-0" key={index}>
      <Celda valor={item} onCeldaClick={() => mostrarValor(index)}></Celda>
    </div>
  ));

  function btnComenzar() {
    let mapa = [Array(64).fill(" ")];
    for (let i = 1; i <= 10; i++) {
      let randomPos = Math.floor(Math.random() * 64);
      let casillaValor = "*";
      mapa[randomPos] = casillaValor;
    }

    /**
     * casilla paralela vertical = numero casilla - 8 o + 8
     * esquina izquierda arriba = numero casilla - 9 
     * esquina derecha arriba = numero casilla - 7
     * esquina izquierda abajo = numero casilla + 7
     * esquina derecha abajo = numero casilla + 9
     * casilla de los lados = numero casilla - 1 o + 1
     */
    
    for (let i = 0; i < mapa.length; i++) {
      let numeroMinas = 0;
      
      if (mapa[i] !== "*") {
        if (mapa[i + 1] === "*") {
            numeroMinas++;
        }
        if (mapa[i - 1] === "*") {
            numeroMinas++;
        }
        if (mapa[i - 8] === "*") {
            numeroMinas++;
        }
        if (mapa[i + 8] === "*") {
            numeroMinas++;
        }
        if (mapa[i - 9] === "*") {
            numeroMinas++;
        }
        if (mapa[i + 9] === "*") {
            numeroMinas++;
        }
        if (mapa[i + 7] === "*") {
            numeroMinas++;
        }
        if (mapa[i - 7] === "*") {
            numeroMinas++;
        }
        
        let casillaNumero = numeroMinas.toString();
        mapa[i] = casillaNumero;
    }
    

    }

    setMapaValores(Array(64).fill(" "));
    setCopiaMapaValores(mapa);
  }

  const mostrarValor = (index) => {
    const copiaValores = mapaValores.slice();
    copiaValores[index] = copiaMapaValores[index];
    setMapaValores(copiaValores);
  };

  return (
    <>
      <div className="container text-center" style={{ width: 492 }}>
        <div className="grid bg-body-secondary py-2 px-4 borderOutSide m-0">
          <div className="row bg-body-secondary borderInside ">
            <div className="d-flex flex-wrap justify-content-around">
              <div className="lcdText text-danger pe-2 m-2 borderInsideS">
                10
              </div>
              <div className="align-self-center m-2 borderInsideS">
                <img
                  src="./src/assets/images/acierto.png"
                  style={{ width: 50 }}
                />
              </div>
              <div
                className="lcdText text-danger pe-2 m-2 borderInsideS"
                style={{ width: 54 }}
              >
                00
              </div>
            </div>
          </div>
          <div className="row borderInside bg-body-secondary text-center justify-content-center">
            <div className="col my-1 p-0">
              <div className="d-flex flex-wrap justify-content-center">
                {celdas}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            className="btn btn-outline-secondary mt-2"
            onClick={btnComenzar}
          >
            {" "}
            Empezar partida
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
