import { Trash2 } from "lucide-react";
import React, { Component } from "react";

export class DeleteButton extends Component {
  render() {
    return (
      <div className="transition duration-100 text-gray-700 hover:text-red-500 w-[35px] h-[35px] z-50">
        <button className="cursor-pointer btn btn-primary w-[35px] h-[35px] flex justify-center items-center">
          <Trash2 />
        </button>
      </div>
    );
  }
}

export default DeleteButton;
