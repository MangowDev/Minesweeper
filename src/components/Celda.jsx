import React, { useState, useEffect } from "react";

function Celda({
  valor = " ",
  onCeldaClick,
  numeroMinasTexto,
  setNumeroMinasTexto,
  juegoEmpezado,
  juegoReiniciado,
}) {
  const [miValor, setMiValor] = useState(valor);

  useEffect(() => {
    setMiValor(valor);
  }, [valor]);

  useEffect(() => {
    if (juegoReiniciado) {
      setMiValor(" "); 
    }
  }, [juegoReiniciado]);

  function onRightClick(e) {
    e.preventDefault();
    if (!juegoEmpezado) return;

    let nuevoNumero = parseInt(numeroMinasTexto);

    if (miValor === "M") {
      setMiValor(" ");
      setNumeroMinasTexto((nuevoNumero + 1).toString());
    } 
    else if (miValor === " " && nuevoNumero > 0) {
      setMiValor("M");
      setNumeroMinasTexto((nuevoNumero - 1).toString());
    }
  }

  return (
    <button
      className="border border-2 border-dark-subtle fs-2 fw-bold text-success"
      style={{ minWidth: 50, minHeight: 50 }}
      onClick={onCeldaClick}
      onContextMenu={onRightClick}
    >
      {miValor}
    </button>
  );
}


export default Celda;
