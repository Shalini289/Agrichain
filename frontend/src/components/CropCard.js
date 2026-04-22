import { motion } from "framer-motion";

export default function CropCard({ crop }) {
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3>{crop.name}</h3>
      <p>₹{crop.price}</p>
    </motion.div>
  );
}