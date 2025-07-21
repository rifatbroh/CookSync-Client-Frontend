import { useState } from "react";
import Chef_recipie from "./chef_recipie";
import CreateRecipe from "../../CreateRecipe";

const Recipie_module = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDone = () => {
    setShowModal(false);
    // Optionally refresh the recipe list here
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Your Recipes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#469b7e] hover:bg-[#357662] text-white px-4 py-2 rounded"
        >
          Add Recipe
        </button>
      </div>

      <Chef_recipie />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex justify-center items-start pt-10 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Create Recipe</h2>
            <CreateRecipe onDone={handleDone} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipie_module;
