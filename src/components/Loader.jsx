import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ isloading }) => {
  if (!isloading) return null;

  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader color="#f43f5e" size={180} />
    </div>
  );
};
export default Loader;
