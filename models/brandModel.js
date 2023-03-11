const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: [true, "Brand already in use"],
      minLength: [2, "Should at least be 2 characters long"],
      maxLength: [32, "Should not exceed 32 characters"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

const setImageUrl = (doc) => {
  // return image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", function (doc) {
  setImageUrl(doc);
});

brandSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
