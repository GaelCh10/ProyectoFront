import React from "react";
import "./MemoBlock.css";

export default function MemoBlock({ animating, handleMemoClick, memoBlock }) {
  return (
    <div
      className="w-[80px] cursor-pointer aspect-square 2xl:w-[110px]"
      onClick={() =>
        !memoBlock.flipped && !animating && handleMemoClick(memoBlock)
      }
    >
      <div
        className={`memo-block-inner ${
          memoBlock.flipped && "memo-block-flipped"
        }`}
      >
        <div className="memo-block-front"></div>
        <div className={`memo-block-back ${memoBlock.matched ? "bg-green-400" : "bg-red-400"}`}>
          {memoBlock.tipo === "imagen" ? (
            <img src={memoBlock.img} style={{ width: 100 }} />
          ) : (
            <p>{memoBlock.texto}</p>
          )}
        </div>
      </div>
    </div>
  );
}
