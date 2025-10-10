import React from "react";

export default function Modal({ children, modal }) {
  return (
    <>
      {modal && (
        <div className="fixed inset-0 flex w-full h-screen z-10 bg-black/40 text-center items-center justify-center flex-col">
          {children}
        </div>
      )}
    </>
  );
}
