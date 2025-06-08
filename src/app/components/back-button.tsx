import { MoveLeft } from "lucide-react";
import React, { Component } from "react";

export class BackButton extends Component {
  render() {
    return (
      <div className="transition duration-100 hover:bg-teal-100 hover:text-black w-[45px] h-[45px]">
        <button className="cursor-pointer btn btn-primary w-[45px] h-[45px] border border-teal-100 flex justify-center items-center">
          <MoveLeft />
        </button>
      </div>
    );
  }
}

export default BackButton;
