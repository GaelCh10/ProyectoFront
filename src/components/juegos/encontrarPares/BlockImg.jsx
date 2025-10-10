import React from 'react'
import './block.css'

export default function BlockImg({ animating, handleMemoClick, memoBlock }) {
  return (
   <div
      className="memo-block"
      onClick={() =>
        !memoBlock.flipped && !animating && handleMemoClick(memoBlock)
      }
    >
      <div
        className={`memo-block-inner  ${
          memoBlock.flipped && "memo-block-flipped"
        } ${memoBlock.tipo === "palabra" && "memo-block-flipped"}`}
      >
        <div className="memo-block-front"></div>
        <div className={`memo-block-back ${memoBlock.color}`}>
          {memoBlock.tipo === "imagen" ? (
            <img src={memoBlock.imagen_url} style={{ width: 90 }} />
          ) : (
            <p>{memoBlock.palabra}</p>
          )}
        </div>
      </div>
    </div>
  )
}
