import { useState } from "react";
import "./App.css";
import Celda from "./components/Celda";

function App() {
  const [mapaValores, setMapaValores] = useState(Array(64).fill(" "));
  const [copiaMapaValores, setCopiaMapaValores] = useState(Array(64).fill(" "));
  const [juegoEmpezado, setJuegoEmpezado] = useState(false);
  const [numeroMinasTexto, setNumeroMinasTexto] = useState(10);

  const celdas = mapaValores.map((item, index) => (
    <div className="col-auto p-0" key={index}>
      <Celda valor={item} onCeldaClick={() => mostrarValor(index)} numeroMinasTexto={numeroMinasTexto} setNumeroMinasTexto={setNumeroMinasTexto} juegoEmpezado={juegoEmpezado}></Celda>
    </div>
  ));

  function btnComenzar() {
    setNumeroMinasTexto("10");
    let mapa = Array(64).fill(" ");

    for (let i = 0; i < 10; i++) {
      let randomPos;
      do {
        randomPos = Math.floor(Math.random() * 64);
      } while (mapa[randomPos] === "*");
      mapa[randomPos] = "*";
    }

    for (let i = 0; i < 64; i++) {
      if (mapa[i] !== "*") {
        let numeroMinas = 0;
        let fila = Math.floor(i / 8);
        let columna = i % 8;

        let posiciones = [
          { offset: -8, valido: fila > 0 }, // Arriba
          { offset: +8, valido: fila < 7 }, // Abajo
          { offset: -1, valido: columna > 0 }, // Izquierda
          { offset: +1, valido: columna < 7 }, // Derecha
          { offset: -9, valido: fila > 0 && columna > 0 }, // Esquina arriba izquierda
          { offset: -7, valido: fila > 0 && columna < 7 }, // Esquina arriba derecha
          { offset: +7, valido: fila < 7 && columna > 0 }, // Esquina abajo izquierda
          { offset: +9, valido: fila < 7 && columna < 7 }, // Esquina abajo derecha
        ];

        for (let pos of posiciones) {
          if (pos.valido && mapa[i + pos.offset] === "*") {
            numeroMinas++;
          }
        }

        if (numeroMinas > 0) {
          mapa[i] = numeroMinas.toString();
        } else {
          mapa[i] = "-";
        }
      }
    }

    setMapaValores(Array(64).fill(" "));
    setCopiaMapaValores(mapa);
    setJuegoEmpezado(true);
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
              <div id="numeroMinas" className="lcdText text-danger pe-2 m-2 borderInsideS">
                {numeroMinasTexto}
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
