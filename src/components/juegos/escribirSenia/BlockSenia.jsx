import React from "react";

export default function BlockSenia({ blocksenia, respuesta, onChange, i, value }) {
  return (
    <div className="flex w-[150px] h-[200px] items-center justify-center bg-[#2e46f9] 2xl:w-[200px] 2xl:h-[250px]">
      <div className="w-[140px] h-[190px] bg-[#2e46f9] flex-col justify-center items-center 
      2xl:w-[185px] 2xl:h-[230px]">
        <img src={blocksenia.img} className="w-[140px] h-[140px] 2xl:w-[185px] 2xl:h-[185px]"/>
        <input
          type="text"
          className={`w-full h-[40px] text-black text-center border-none outline-none mt-2
            2xl:text-2xl
            ${
              respuesta == null
                ? "bg-white"
                : respuesta == true
                ? "bg-green-400"
                : respuesta ==false ? "bg-red-400" : "bg-white"
            }
            `}
          value={value}
          onChange={(e) => onChange(i, e.target.value)}
        />
      </div>
    </div>
  );
}
