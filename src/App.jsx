import { useState, useEffect } from "react";
import "./App.css"; 
import Celda from "./components/Celda";
import acierto from "./assets/images/acierto.png"
// Importacion de iconos 
import { LuPartyPopper } from "react-icons/lu";
import { GiPartyFlags } from "react-icons/gi";
import { FaFire, FaGrinWink, FaSkull } from "react-icons/fa"; 
import { MdOutlineAutoAwesome } from "react-icons/md";
import { FaRegFaceFrown } from "react-icons/fa6";
import { ImCrying } from "react-icons/im";

function App() {
  // Declaración de los estados
  const [mapaValores, setMapaValores] = useState(
    Array(8) // Crea una matriz de 8x8 con valores iniciales vacíos
      .fill()
      .map(() => Array(8).fill(" "))
  );
  const [copiaMapaValores, setCopiaMapaValores] = useState(
    Array(8)
      .fill()
      .map(() => Array(8).fill(" "))
  );
  const [smallTextClass, setSmallTextClass] = useState(""); // Para cambiar el tamaño del texto del temporizador
  const [juegoEmpezado, setJuegoEmpezado] = useState(false); // Indica si el juego ha comenzado
  const [numeroMinasTexto, setNumeroMinasTexto] = useState(10); // Número de minas restantes
  const [tiempo, setTiempo] = useState(0); // Temporizador del juego
  const [juegoReiniciado, setJuegoReiniciado] = useState(false); // Indica si el juego fue reiniciado
  const [victoria, setVictoria] = useState(null); // Estado para verificar si el jugador ganó o perdió
  const [mostrarModal, setMostrarModal] = useState(false); // Para mostrar el modal de victoria o derrota
  const [mensajeModal, setMensajeModal] = useState(""); // Mensaje que se muestra en el modal
  
  // Definición de las direcciones en las que se puede revisar la cercanía de minas
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

  // useEffect para controlar el modal a mostrar dependiendo de si ganas o pierdes
  useEffect(() => {
    if (victoria === true) {
      setMensajeModal(
        <div className="modal-div">
          <h4>¡Has ganado!</h4>
          <div>
            <LuPartyPopper className="icon" />
            <GiPartyFlags className="icon" />
            <FaGrinWink className="icon" />
            <MdOutlineAutoAwesome className="icon" />
          </div>
          <h6>Has completado el tablero en {tiempo} segundos.</h6>
          <button onClick={btnComenzar}>Reiniciar juego</button>
        </div>
      );
      setMostrarModal(true); // Muestra el modal de victoria
    } else if (victoria === false) {
      setMensajeModal(
        <div className="modal-div">
          <h4>¡Has perdido! Has tocado una mina.</h4>
          <div>
            <FaSkull className="icon"></FaSkull>
            <FaFire className="icon"></FaFire>
            <FaRegFaceFrown className="icon"></FaRegFaceFrown>
            <ImCrying className="icon"></ImCrying>
          </div>
          <h6>Has perdido en {tiempo} segundos.</h6>
          <button onClick={btnComenzar}>Reiniciar juego</button>
        </div>
      );
      setMostrarModal(true); // Muestra el modal de derrota
    }
  }, [victoria]); // Reacciona cuando cambia el estado de la victoria

  // useEffect para el temporizador y el cambio de tamaño de texto en el temporizador
  useEffect(() => {
    if (tiempo >= 100) {
      setSmallTextClass("smallText"); // Cambia el tamaño del texto si pasa de 100 segundos
    } else {
      setSmallTextClass("");
    }

    let vTiempo;
    if (juegoEmpezado) {
      vTiempo = setInterval(() => setTiempo((tiempo) => tiempo + 1), 1000); // Incrementa el tiempo cada segundo
    }
    return () => {
      clearInterval(vTiempo); // Limpiar el intervalo al salir del juego
    };
  }, [juegoEmpezado, tiempo]); // Se ejecuta cuando comienza el juego o cambia el tiempo

  // useEffect para verificar la victoria después de cada movimiento
  useEffect(() => {
    if (juegoEmpezado && verificarVictoria()) {
      setTimeout(() => {
        setVictoria(true); // Establece la victoria si se cumplen las condiciones
        setJuegoEmpezado(false); // Detiene el juego
      }, 500);
    }
  }, [mapaValores]); // Reacciona cuando cambia el mapa de valores

  // Lógica para renderizar las celdas del tablero
  const celdas = mapaValores.map((fila, filaIndex) =>
    fila.map((item, colIndex) => (
      <div className="col-auto p-0" key={`${filaIndex}-${colIndex}`}>
        <Celda
          valor={item} // Valor que muestra la celda
          onCeldaClick={() => mostrarValor(filaIndex, colIndex)} // Maneja el clic en la celda
          numeroMinasTexto={numeroMinasTexto} // Número de minas restantes
          setNumeroMinasTexto={setNumeroMinasTexto} // Función para actualizar el número de minas
          juegoEmpezado={juegoEmpezado} // Indica si el juego está en progreso
          juegoReiniciado={juegoReiniciado} // Indica si el juego fue reiniciado
        ></Celda>
      </div>
    ))
  );

  // Función para comenzar o reiniciar el juego
  function btnComenzar() {
    setNumeroMinasTexto("10");
    setTiempo(0);
    setSmallTextClass("");
    setJuegoEmpezado(true);
    setVictoria(null);
    setMostrarModal(false);
    setMensajeModal("");

    let mapa = Array(8)
      .fill()
      .map(() => Array(8).fill(" ")); // Inicializa el mapa vacío

    // Coloca las minas aleatoriamente en el mapa
    for (let i = 0; i < 10; i++) {
      let randomFila, randomColumna;
      do {
        randomFila = Math.floor(Math.random() * 8);
        randomColumna = Math.floor(Math.random() * 8);
      } while (mapa[randomFila][randomColumna] === "*");
      mapa[randomFila][randomColumna] = "*"; // Marca la celda con una mina
    }

// Calcula los números de minas alrededor de cada celda
for (let fila = 0; fila < 8; fila++) {
  for (let columna = 0; columna < 8; columna++) {

    // Si la celda actual no es una mina
    if (mapa[fila][columna] !== "*") {
      
      // Inicializamos un contador para contar las minas alrededor de la celda
      let numeroMinas = 0;

      // Iteramos sobre las posiciones relativas de las 8 celdas adyacentes
      for (let pos of posiciones) {
        
        // Calculamos la nueva fila y columna de la celda adyacente
        const nuevaFila = fila + pos.filaOffset;
        const nuevaColumna = columna + pos.colOffset;

        // Verificamos que la celda adyacente esté dentro de los límites del tablero
        if (
          nuevaFila >= 0 &&
          nuevaFila < 8 &&
          nuevaColumna >= 0 &&
          nuevaColumna < 8 &&
          mapa[nuevaFila][nuevaColumna] === "*" // Si la celda adyacente contiene una mina
        ) {
          numeroMinas++; // Incrementamos el contador de minas
        }
      }

      // Si encontramos al menos una mina cerca de esta celda
      if (numeroMinas > 0) {
        // Colocamos el número de minas adyacentes en la celda
        mapa[fila][columna] = numeroMinas.toString();
      } else {
        // Si no hay minas cercanas, marcamos la celda con un "-"
        mapa[fila][columna] = "-"; 
      }
    }
  }
}


    setMapaValores(
      Array(8)
        .fill()
        .map(() => Array(8).fill(" ")) // Reinicia el mapa visible
    );
    setCopiaMapaValores(mapa); // Guarda el mapa con las minas
    setJuegoReiniciado(true);
    setTimeout(() => setJuegoReiniciado(false), 100); // Marca el reinicio del juego
  }

  // Función para revelar las celdas adyacentes a un cero
  const revelarCeros = (fila, columna) => {
    // Si la celda seleccionada no es un "-", no hacemos nada
    if (copiaMapaValores[fila][columna] !== "-") {
    }
  
    // Creamos una copia del mapa de valores actual
    const nuevaMatriz = mapaValores.map((fila) => [...fila]);
    
    // Inicializamos una cola para el recorrido
    const queue = [[fila, columna]];
    
    // Creamos un conjunto para llevar el registro de las celdas ya visitadas
    const visitados = new Set();
  
    // Mientras tengamos celdas por explorar en la cola
    while (queue.length > 0) {
      const [f, c] = queue.shift(); // Obtenemos la siguiente celda a explorar
  
      // Si la celda ya ha sido visitada la ignoramos y pasamos a la siguiente
      if (visitados.has(`${f},${c}`)) continue;
  
      // Marcamos la celda como visitada
      visitados.add(`${f},${c}`);
  
      // Revelamos la celda en la nueva matriz con el valor de la copia del mapa original
      nuevaMatriz[f][c] = copiaMapaValores[f][c];
  
      // Si la celda tiene un "-", significa que es una celda vacía, comprobamos sus adyacentes
      if (copiaMapaValores[f][c] === "-") {
        // Para cada celda adyacente
        for (let { filaOffset, colOffset } of posiciones) {
          const nuevaFila = f + filaOffset;
          const nuevaColumna = c + colOffset;
  
          // Si la celda adyacente está dentro del rango y no ha sido visitada la agregamos a la cola
          if (
            nuevaFila >= 0 &&
            nuevaFila < 8 &&
            nuevaColumna >= 0 &&
            nuevaColumna < 8 &&
            !visitados.has(`${nuevaFila},${nuevaColumna}`)
          ) {
            queue.push([nuevaFila, nuevaColumna]);
          }
        }
      }
    }
  
    // Actualizamos el estado de las celdas visibles con la nueva matriz
    setMapaValores(nuevaMatriz);
  };
  

  // Función para verificar si el jugador ha ganado
  function verificarVictoria() {
    for (let fila = 0; fila < 8; fila++) {
      for (let columna = 0; columna < 8; columna++) {
        if (
          copiaMapaValores[fila][columna] !== "*" &&
          mapaValores[fila][columna] === " "
        ) {
          return false; // Si hay celdas por descubrir, no se ha ganado
        }
      }
    }
    return true; // Si no hay celdas sin revelar, el jugador ha ganado
  }

  // Función para mostrar el valor de una celda al hacer clic
  const mostrarValor = (filaIndex, colIndex) => {
    if (!juegoEmpezado || victoria !== null) {
      return; // No hace nada si el juego no ha comenzado o ya hay una victoria/derrota
    }

    if (copiaMapaValores[filaIndex][colIndex] === "*") {
      // Si toca una mina
      const copiaValores = mapaValores.map((fila, fIndex) => {
        if (fIndex === filaIndex) {
          return fila.map((valor, cIndex) => {
            if (cIndex === colIndex) {
              return "*"; // Marca la mina
            }
            return valor;
          });
        }
        return fila;
      });

      setMapaValores(copiaValores);

      setTimeout(() => {
        setVictoria(false); // Establece derrota
        setJuegoEmpezado(false); // Detiene el juego
      }, 500);

      return;
    }

    if (copiaMapaValores[filaIndex][colIndex] === "-") {
      revelarCeros(filaIndex, colIndex); // Revela celdas adyacentes si no hay minas cerca
    } else {
      const copiaValores = mapaValores.map((fila, fIndex) => {
        if (fIndex === filaIndex) {
          return fila.map((valor, cIndex) => {
            if (cIndex === colIndex) {
              return copiaMapaValores[filaIndex][colIndex]; // Muestra el valor de la celda
            }
            return valor;
          });
        }
        return fila;
      });
      setMapaValores(copiaValores);
    }
  };

  return (
    <>
      <div className="container text-center" style={{ width: 492 }}>
        <div className="grid bg-body-secondary py-2 px-4 borderOutSide m-0">
          <div className="row bg-body-secondary borderInside ">
            <div className="d-flex flex-wrap justify-content-around">
              <div id="numeroMinas" className="lcdText borderInsideS">
                {numeroMinasTexto}
              </div>
              <div className="align-self-center m-2 borderInsideS">
                <img
                  src={acierto}
                  style={{ width: 50 }}
                  alt="icon"
                />
              </div>
              <div
                className={`lcdText borderInsideS ${smallTextClass}`}
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
          <button className="begin-button" onClick={btnComenzar}>
            {" "}
            Empezar partida
          </button>
        </div>
        {mostrarModal && mensajeModal} {/* Muestra el modal si hay una victoria o derrota */}
      </div>
    </>
  );
}

export default App; 
