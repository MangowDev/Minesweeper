import { useState, useEffect } from "react";
import "./App.css";
import Celda from "./components/Celda";

function App() {
  const [mapaValores, setMapaValores] = useState(
    Array(8).fill().map(() => Array(8).fill(" "))
  );
  const [copiaMapaValores, setCopiaMapaValores] = useState(
    Array(8).fill().map(() => Array(8).fill(" "))
  );
  const [juegoEmpezado, setJuegoEmpezado] = useState(false);
  const [numeroMinasTexto, setNumeroMinasTexto] = useState(10);
  const [tiempo, setTiempo] = useState(0);
  const [juegoReiniciado, setJuegoReiniciado] = useState(false);
  const temporizador = document.getElementById("timer");

  useEffect(() => {
    if (tiempo >= 100) {
      temporizador.classList.add("smallText");
    }

    let vTiempo;
    if (juegoEmpezado) {
      vTiempo = setInterval(() => setTiempo((tiempo) => tiempo + 1), 1000);
    }
    return () => {
      clearInterval(vTiempo);
    };
  }, [juegoEmpezado, tiempo]);

  const celdas = mapaValores.map((fila, filaIndex) =>
    fila.map((item, colIndex) => (
      <div className="col-auto p-0" key={`${filaIndex}-${colIndex}`}>
        <Celda
          valor={item}
          onCeldaClick={() => mostrarValor(filaIndex, colIndex)}
          numeroMinasTexto={numeroMinasTexto}
          setNumeroMinasTexto={setNumeroMinasTexto}
          juegoEmpezado={juegoEmpezado}
          juegoReiniciado={juegoReiniciado}
        ></Celda>
      </div>
    ))
  );

  function btnComenzar() {
    setNumeroMinasTexto("10");
    setTiempo(0);
    temporizador.classList.remove("smallText");
    setJuegoEmpezado(true);

    let mapa = Array(8)
      .fill()
      .map(() => Array(8).fill(" "));

    for (let i = 0; i < 10; i++) {
      let randomFila, randomColumna;
      do {
        randomFila = Math.floor(Math.random() * 8);
        randomColumna = Math.floor(Math.random() * 8);
      } while (mapa[randomFila][randomColumna] === "*");
      mapa[randomFila][randomColumna] = "*";
    }

    for (let fila = 0; fila < 8; fila++) {
      for (let columna = 0; columna < 8; columna++) {
        if (mapa[fila][columna] !== "*") {
          let numeroMinas = 0;

          const posiciones = [
            { filaOffset: -1, colOffset: 0 }, // Arriba
            { filaOffset: +1, colOffset: 0 }, // Abajo
            { filaOffset: 0, colOffset: -1 }, // Izquierda
            { filaOffset: 0, colOffset: +1 }, // Derecha
            { filaOffset: -1, colOffset: -1 }, // Esquina arriba izquierda
            { filaOffset: -1, colOffset: +1 }, // Esquina arriba derecha
            { filaOffset: +1, colOffset: -1 }, // Esquina abajo izquierda
            { filaOffset: +1, colOffset: +1 }, // Esquina abajo derecha
          ];

          for (let pos of posiciones) {
            const nuevaFila = fila + pos.filaOffset;
            const nuevaColumna = columna + pos.colOffset;
            if (
              nuevaFila >= 0 &&
              nuevaFila < 8 &&
              nuevaColumna >= 0 &&
              nuevaColumna < 8 &&
              mapa[nuevaFila][nuevaColumna] === "*"
            ) {
              numeroMinas++;
            }
          }

          if (numeroMinas > 0) {
            mapa[fila][columna] = numeroMinas.toString();
          } else {
            mapa[fila][columna] = "-";
          }
          
        }
      }
    }

    setMapaValores(Array(8).fill().map(() => Array(8).fill(" ")));
    setCopiaMapaValores(mapa);
    setJuegoReiniciado(true);
    setTimeout(() => setJuegoReiniciado(false), 100);
  }

  const mostrarValor = (filaIndex, colIndex) => {
    const copiaValores = mapaValores.map((fila, fIndex) => {
      if (fIndex === filaIndex) {
        return fila.map((valor, cIndex) => {
          if (cIndex === colIndex) {
            return copiaMapaValores[filaIndex][colIndex];
          }
          return valor;
        });
      }
      return fila;
    });
    
    setMapaValores(copiaValores);
  };

  return (
    <>
      <div className="container text-center" style={{ width: 492 }}>
        <div className="grid bg-body-secondary py-2 px-4 borderOutSide m-0">
          <div className="row bg-body-secondary borderInside ">
            <div className="d-flex flex-wrap justify-content-around">
              <div
                id="numeroMinas"
                className="lcdText borderInsideS"
              >
                {numeroMinasTexto}
              </div>
              <div className="align-self-center m-2 borderInsideS">
                <img
                  src="./src/assets/images/acierto.png"
                  style={{ width: 50 }}
                  alt="icon"
                />
              </div>
              <div
                className="lcdText borderInsideS"
                id="timer"
              >
                {tiempo}
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
