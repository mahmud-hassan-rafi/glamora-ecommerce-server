import mongoose from "mongoose";

interface IBlacklist {
  token: string;
}

const BlacklistSchema = new mongoose.Schema<IBlacklist>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Blacklist = mongoose.model<IBlacklist>("blacklist", BlacklistSchema);

export default Blacklist;
