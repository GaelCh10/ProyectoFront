import BlockImg from "./BlockImg";

export default function Tablero({ animacion, handleMemoClick, memoBlocks }) {
  const palabras = memoBlocks.filter((item) => item.tipo === "palabra");
  const imagenes = memoBlocks.filter((item) => item.tipo === "imagen");

  return (
    <div className="flex flex-row space-x-4">
      {/* Columna de palabras */}
      <div className="flex flex-col space-y-2">
        {palabras.map((item) => (
          <div key={item.id}>
            <BlockImg
              memoBlock={item}
              handleMemoClick={handleMemoClick}
              animating={animacion}
            />
          </div>
        ))}
      </div>

      {/* Columna de imágenes */}
      <div className="flex flex-col space-y-2">
        {imagenes.map((item) => (
          <div key={item.id}>
            <BlockImg
              memoBlock={item}
              handleMemoClick={handleMemoClick}
              animating={animacion}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
