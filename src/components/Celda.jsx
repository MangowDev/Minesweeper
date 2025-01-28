import React, { useState, useEffect } from "react";

function Celda({
  valor = " ",
  onCeldaClick,
  numeroMinasTexto,
  setNumeroMinasTexto,
  juegoEmpezado,
}) {
  const [miValor, setMiValor] = useState(valor);

  useEffect(() => {
    setMiValor(valor);
  }, [valor]);

  function onRightClick(e) {
    e.preventDefault();
    if (juegoEmpezado === true) {
      let nuevoNumero = parseInt(numeroMinasTexto);
      if (nuevoNumero === 0) {
      } else {
        setMiValor("M");
        let nuevoNumero = parseInt(numeroMinasTexto);
        nuevoNumero--;
        nuevoNumero = nuevoNumero.toString();
        setNumeroMinasTexto(nuevoNumero);
      }
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
