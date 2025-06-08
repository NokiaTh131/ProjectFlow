import { Plus } from "lucide-react";
import React, { Component } from "react";
import { motion } from "framer-motion";

export class AddButton extends Component {
  render() {
    return (
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "#81e6d9", color: "#000" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="cursor-pointer w-[45px] h-[45px] border border-teal-100 flex justify-center items-center rounded-md"
        style={{ backgroundColor: "transparent", color: "inherit" }}
      >
        <Plus size={24} />
      </motion.button>
    );
  }
}

export default AddButton;
