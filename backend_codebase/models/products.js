const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
  },

  created_at: {
    type: Date,
    default: new Date(),
  },
});

let products = mongoose.model("products", productSchema);

const insertOne = async (body) => {
  try {
    return await new products(body).save();
  } catch (error) {
    return error;
  }
};

const find = async (query) => {
  try {
    return await products.find({
      user_id: query.user_id,
      $or: [
        {
          name: {
            $regex:
              query.search_text && query.search_text != null
                ? query.search_text
                : "",
            $options: "i",
          },
        },
        {
          company: {
            $regex:
              query.search_text && query.search_text != null
                ? query.search_text
                : "",
            $options: "i",
          },
        },
        {
          category: {
            $regex:
              query.search_text && query.search_text != null
                ? query.search_text
                : "",
            $options: "i",
          },
        },
      ],
    });

    // return await products.aggregate([
    //   {
    //     $match: {
    //       user_id: query.user_id,
    //       $or: [
    //         {
    //           name: {
    //             $regex:
    //               query.search_text && query.search_text != null
    //                 ? query.search_text
    //                 : "",
    //             $options: "i",
    //           },
    //         },
    //         {
    //           company: {
    //             $regex:
    //               query.search_text && query.search_text != null
    //                 ? query.search_text
    //                 : "",
    //             $options: "i",
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "carts",
    //       localField: "user_id",
    //       foreignField: "user",
    //       as: "carts",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$carts",
    //     },
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       price: 1,
    //       category: 1,
    //       company: 1,
    //       user_id: 1,
    //       created_at: 1,
    //       products: {
    //         $filter: {
    //           input: "$carts.items",
    //           as: "item",
    //           cond: {
    //             $eq: ["$$item.product", "$_id"],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       price: 1,
    //       category: 1,
    //       company: 1,
    //       user_id: 1,
    //       created_at: 1,
    //       cart_quantity: {
    //         $arrayElemAt: ["$products.quantity", 0],
    //       },
    //     },
    //   },
    // ]);
  } catch (error) {
    return error;
  }
};

const get_products_with_pagination = async (query) => {
  try {
    let page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || 5;
    let search_text = query.search_text || "";
    console.log("search_text:", search_text);
    const startIndex = (page - 1) * limit;
    const get = await products
      .find({
        name: {
          $regex:
            query.search_text && query.search_text != null
              ? query.search_text
              : "",
          $options: "i",
        },
      })
      .skip(startIndex)
      .limit(limit)
      .exec();
    const total_number_of_records = await products.countDocuments();
    let number_of_records = get.length;
    return { total_number_of_records, number_of_records, page, get };
  } catch (error) {
    return error;
  }
};

const findOne = async (query) => {
  try {
    return await products.findOne(query);
  } catch (error) {
    return error;
  }
};

const updateOne = async (match, query) => {
  try {
    return await products.findByIdAndUpdate(match, query);
  } catch (error) {
    return error;
  }
};

const deleteOne = async (match) => {
  try {
    return await products.findByIdAndDelete(match);
  } catch (error) {
    return error;
  }
};

module.exports = {
  insertOne,
  find,
  get_products_with_pagination,
  findOne,
  updateOne,
  deleteOne,
};
