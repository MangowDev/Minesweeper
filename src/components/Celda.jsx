import React from "react";

function Celda({ valor = " ", onCeldaClick }) {

  return (
    <button
      className="border border-2 border-dark-subtle fs-2 fw-bold text-success"
      style={{ minWidth: 50, minHeight: 50 }}
      onClick={onCeldaClick}
    >
      {valor}
    </button>
  );
}

export default Celda;
