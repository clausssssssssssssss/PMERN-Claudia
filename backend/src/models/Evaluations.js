/*
    Campos:
      comment
      grade
      Role
      idCustomers
*/

import { Schema, model } from "mongoose";

const productsSchema = new Schema(
  {
    comment: {
      type: String,
      require: true,
    },
    grade: {
      type: String,
      require: true
    },
    role: {
      type: String,
      require: true,
      min: 0,
    },
    idCustomers: {
        type: Schema.Types.ObjectId,
        ref: "customers",
        require: true,
      },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Evaluations", productsSchema);
