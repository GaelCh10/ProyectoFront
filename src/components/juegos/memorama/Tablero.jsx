import React from 'react'
import "./Tablero.css";
import MemoBlock from './MemoBlock';

export default function Tablero({ animacion, handleMemoClick, memoBlocks }) {
  return (
    <div className="flex w-[370px] bg-[#2e46f9] h-[370px] flex-wrap justify-around items-center 2xl:w-[480px] 2xl:h-[480px]">
      {memoBlocks.map((item, index) => {
        return (
          // <div className="item1" key={index}>
          //   {item.texto}
          // </div>
          <MemoBlock
            key={`${index}_${item.id}`}
            memoBlock={item}
            animating={animacion}
            handleMemoClick={handleMemoClick}
          />
        );
      })}
    </div>
  )
}
