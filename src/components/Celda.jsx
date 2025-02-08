import React, { useState, useEffect } from "react";
import "../App.css"; 

//Importacion de imágenes
import minaImg from "../assets/images/bomba.png"; 
import banderaImg from "../assets/images/bandera.png";

// Componente Celda
function Celda({
  valor = " ", // Valor inicial de la celda
  onCeldaClick, // Función que se ejecuta al hacer clic en la celda
  numeroMinasTexto, // Número de minas restantes
  setNumeroMinasTexto, // Función para actualizar el número de minas restantes
  juegoEmpezado, // Si el juego ha comenzado
  juegoReiniciado, // Si el juego ha sido reiniciado
}) {
  const [miValor, setMiValor] = useState(valor); // Estado para almacenar el valor actual de la celda

  // Este hook se ejecuta cada vez que cambia el valor de la celda
  useEffect(() => {
    setMiValor(valor); // Actualiza el valor de la celda con el valor pasado como prop
  }, [valor]);

  // Este hook se ejecuta cuando el juego es reiniciado
  useEffect(() => {
    if (juegoReiniciado) {
      setMiValor(" "); // Limpiamos la celda si el juego se reinicia
    }
  }, [juegoReiniciado]);

  // Función para manejar el clic derecho sobre la celda (marcar como mina)
  function onRightClick(e) {
    e.preventDefault(); // Previene el menú contextual del navegador
    if (!juegoEmpezado) return; // No hace nada si el juego no ha comenzado

    let nuevoNumero = parseInt(numeroMinasTexto); // Convierte el número de minas restantes a un entero

    // Si la celda tiene una bandera, la desmarca y vuelve a aumentar las minas restantes
    if (miValor === "M") {
      setMiValor(" "); // La celda se limpia
      setNumeroMinasTexto((nuevoNumero + 1).toString()); // Aumenta el contador de minas
    }
    // Si la celda está vacía y hay minas restantes, la marca con una bandera y disminuimos las minas
    else if (miValor === " " && nuevoNumero > 0) {
      setMiValor("M"); // Marca la celda con una bandera
      setNumeroMinasTexto((nuevoNumero - 1).toString()); // Disminuye el contador de minas
    }
  }

  return (
    <button
      className="border border-2 border-dark-subtle fs-2 fw-bold text-success" 
      style={{ minWidth: 50, minHeight: 50 }} 
      onClick={onCeldaClick} // Llama a la función onCeldaClick al hacer clic izquierdo
      onContextMenu={onRightClick} // Llama a la función onRightClick al hacer clic derecho
    >
      {/* Si la celda contiene una mina "*", se muestra la imagen de la mina */}
      {miValor === "*" ? (
        <img src={minaImg} alt="mina" className="casilla-img" />
      ) : miValor === "M" ? (
        // Si la celda tiene una bandera "M", se muestra la imagen de la bandera
        <img src={banderaImg} alt="bandera" className="casilla-img" />
      ) : (
        // Si no es ni mina ni bandera, se muestra el valor numérico de la celda
        miValor
      )}
    </button>
  );
}

export default Celda;
