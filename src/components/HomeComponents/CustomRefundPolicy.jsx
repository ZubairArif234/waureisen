import React from "react";
import toast from "react-hot-toast";

const CustomRefundPolicy = ({
  isOpen,
  onClose,
  setCustomPolicy,
  customPolicy,
}) => {
  if (!isOpen) return null;


  const handleAddPolicy = () => {

    const isEmpty = customPolicy.some(
      (policy) =>  !policy.days || !policy.refundAmount
    );
    if (isEmpty) {
      toast.error("Please fill all fields before adding a new policy.");
      return;
    }

    const newPolicy = {
      days: "",
      refundAmount: "",
    };
    setCustomPolicy([...customPolicy, newPolicy]);
  }

  const handleRemovePolicy = (index) => {
    const updatedPolicy = [...customPolicy];
    updatedPolicy.splice(index, 1);
    setCustomPolicy(updatedPolicy);
  }

  const handleSave = () =>{
      const isEmpty = customPolicy.some(
      (policy) =>  !policy.days || !policy.refundAmount
    );
    if (isEmpty) {
      toast.error("Please fill all fields before adding a new policy.");
      return;
    }

    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Custom Refund Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {customPolicy?.map((policy, index) => (

        <div className=" bg-slate-50 rounded-md my-3 p-3" key={index}>
        
            <div className="flex items-center justify-between">

            <p className="p-4 w-6 h-6 rounded-full bg-zinc-900 text-white flex justify-center items-center">{index+1}</p>
         {customPolicy.length > 1 && (

            <p onClick={()=>handleRemovePolicy(index)} className=" bg-red-400 hover:bg-red-500 rounded-md px-3 py-1 cursor-pointer text-white">Remove</p>
         )}
            </div>
            <label className="my-2 block">
              <p className="block text-sm font-medium text-gray-700">
                If cancelled
              </p>
              <div  className="w-full flex items-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
               >

              <input
              value={policy?.days}
                onChange={(e) => {
                  const updatedPolicy = [...customPolicy];
                  updatedPolicy[index].days = e.target.value;
                  setCustomPolicy(updatedPolicy);
                }}
                type="text"
                placeholder="eg: 10"
                className="w-full bg-transparent focus:outline-none"
                />
              <p className="w-full text-end">Days before</p>
                </div>
            </label>
            <label className="my-2 block">
              <p className="block text-sm font-medium text-gray-700">
                Refund amount in %
              </p>
               <div  className="w-full flex items-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
               >

              <input
              value={policy?.refundAmount}
              onChange={(e) => {
                  const updatedPolicy = [...customPolicy];
                  updatedPolicy[index].refundAmount = e.target.value;
                  setCustomPolicy(updatedPolicy);
                }}
                type="text"
                placeholder="eg: 80"
                className="w-full bg-transparent focus:outline-none"
                />
              <p className="w-full text-end ">%</p>
                </div>
              
            </label>
          
        
        </div>
        ))}
        <div className="mt-6 flex justify-start gap-4">
            <button onClick={handleAddPolicy} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Add New
          </button>
        </div>
       

        <div className="mt-6 flex justify-end gap-4">
          
          <button onClick={handleSave} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomRefundPolicy;
