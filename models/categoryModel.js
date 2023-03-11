const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: [true, "Category already in use"],
      minLength: [3, "Should at least be 3 characters long"],
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
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", function (doc) {
  setImageUrl(doc);
});

categorySchema.post("save", function (doc) {
  setImageUrl(doc);
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
