const QuotationModel = require("../Models/Quotation");

const getAllQuotation = async (req, res) => {
  try {
    const quotations = await QuotationModel.find();

    res.status(200).json({
      success: true,
      data: quotations,
    });
  } catch (error) {
    console.error("Error fetching quotations:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve quotations. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = { getAllQuotation };