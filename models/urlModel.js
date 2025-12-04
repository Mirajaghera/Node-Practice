const monggose = require("mongoose");
const urlSchema = new monggose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    VisitsHistory: [{ timeStamp: { type: Number } }],
  },
  { timestamps: true }
);
const URL = monggose.model("Url", urlSchema);

module.exports = URL;
