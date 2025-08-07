import React from "react";

const ShowModal = ({ closeModal, handleDelete, isdeleting }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h3 className="text-lg font-semibold mb-4 ">
          Are you sure you want to delete this workout ?
        </h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            {isdeleting ? "Deleting..." : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
