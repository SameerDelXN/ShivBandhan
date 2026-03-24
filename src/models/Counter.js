import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "shivbandhanId"
  seq: { type: Number, default: 0 },
});

// Get or create the next sequential number atomically
CounterSchema.statics.getNextSequence = async function (name) {
  const counter = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

delete mongoose.models.Counter;
export default mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
