/* eslint-disable */
const { FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');
const {
  queryKnowledgeBase,
  appointmentScheduling,
  requestAssistance,
  getOrderQuote,
  getPaymentInfo,
  submitOrder,
  searchProducts,
} = require('../toolExecution/toolExecution');

const functionDeclarations = [
  {
    functionDeclarations: [
      {
        name: "query_product_knowledge_base",
        description: "Use this tool to answer general inquiries about products. This tool should be used when the user's question is not about registering interest in a program.",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            query: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The user's question in natural language, which will be used to search for the answer in the knowledge base."
            },
          },
          required: ["query"],
        }
      },
      {
        name: "appointment_scheduling",
        description: "Use this tool to help users schedule an appointment for a service. It captures their details to forward to the Chikas Nails human team for follow-up.",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            name: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The full name of the user (e.g., 'Juan López')."
            },
            service: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The name of the service the user wants to schedule (e.g., 'Manicure')."
            }
          },
          required: ["name", "service"],
        }
      },
      {
        name: "request_assistance",
        description: "Use this tool when a user is interested in a service or needs specific help. It captures their details to forward to the Chikas Nails human team for follow-up.",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            name: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The full name of the user (e.g., 'Ana Pérez')."
            },
            assistance_details: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "A clear description of the help the user needs or the service they are interested in (e.g., 'Quiero información sobre el curso de manicure')."
            }
          },
          required: ["name", "assistance_details"]
        }
      },
      {
        name: "submit_order",
        description: "Submits the final, confirmed order to the system. This is the last step after payment. Use the same line_items structure from get_order_quote.",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            customer_name: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The full name of the customer placing the order (Omit if user is known and 'save_new_customer' was NOT called)."
            },
            total_price_quoted: {
              type: FunctionDeclarationSchemaType.NUMBER,
              description: "The final total price that was quoted by 'get_order_quote'."
            },
            line_items: {
              type: FunctionDeclarationSchemaType.ARRAY,
              description: "The *exact* same list of line items that was used in get_order_quote.",
              items: {
                type: FunctionDeclarationSchemaType.OBJECT,
                properties: {
                  product_name: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: "The exact product name from the quote."
                  },
                  quantity: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: "The quantity information from the quote."
                  },
                  price: {
                    type: FunctionDeclarationSchemaType.NUMBER,
                    description: "The full price already calculated."
                  },
                  stock_available: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: "Stock availability information from the quote."
                  }
                },
                required: ["product_name", "quantity", "price", "stock_available"]
              }
            },
            delivery_address: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The delivery address, in the users information (either text (address) or platform location (latitude and longitude))."
            },
            payment_screenshot_url: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The direct URL for the customer's payment screenshot."
            }
          },
          required: ["customer_name", "total_price_quoted", "line_items", "delivery_address", "payment_screenshot_url"]
        }
      },
      {
        name: "get_order_quote",
        description: "Calculates the final quote including product subtotals, delivery fee, and total. This tool MUST be called *after* collecting the user's cart AND delivery address. Use the complete product information from search_products results.",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            line_items: {
              type: FunctionDeclarationSchemaType.ARRAY,
              description: "The list of products in the user's cart with complete information from search_products.",
              items: {
                type: FunctionDeclarationSchemaType.OBJECT,
                description: "A single product with all details from search_products response.",
                properties: {
                  product_name: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: "The exact product name from search_products response."
                  },
                  quantity: {
                    type: FunctionDeclarationSchemaType.NUMBER,
                    description: "The quantity information from search_products."
                  },
                  price: {
                    type: FunctionDeclarationSchemaType.NUMBER,
                    description: "The price already calculated."
                  },
                  stock_available: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: "Stock availability information from search_products."
                  }
                },
                required: ["product_name", "quantity", "price", "stock_available"]
              }
            },
            delivery_address: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The user's delivery address (text(address) or platform location(latitud and longitude)). This is required to calculate the delivery fee."
            }
          },
          required: ["line_items", "delivery_address"]
        }
      },
      {
        name: "get_payment_info",
        description: "Shows bank transfer information to the customer after they accept a quote. This displays account number, CLABE, beneficiary name, and the exact amount to transfer.",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            total_amount: {
              type: FunctionDeclarationSchemaType.NUMBER,
              description: "The exact total amount from the accepted quote that the customer needs to transfer."
            },
            customer_name: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Customer's name for reference in the payment information."
            }
          },
          required: ["total_amount"]
        }
      },
      {
        name: "search_products",
        description: "Searches the product catalog based on the user's query. This tool should be used when the user is looking for products to order, whether generally or specifically.",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            query: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "The user's search request for products. Can be general or specific query. E.g., '¿Que productos tienes disponibles?', '¿Que tipos de uñas tienes para gelish?', '¿Que precio tienen las uñas para gelish?', etc."
            }
          },
          required: ["query"]
        }
      },
    ],
  },
];

const toolDeclarations = [
  {
    name: "query_product_knowledge_base",
    type: "queryKnowledgeBase",
    tool: queryKnowledgeBase,
    sendResponse: true,
  },
  {
    name: "appointment_scheduling",
    type: "appointmentScheduling",
    tool: appointmentScheduling,
    sendResponse: true,
  },
  {
    name: "request_assistance",
    type: "requestAssistance",
    tool: requestAssistance,
    sendResponse: true,
  },
  {
    name: "submit_order",
    type: "submitOrder",
    tool: submitOrder,
    sendResponse: true,
  },
  {
    name: "get_order_quote",
    type: "getOrderQuote",
    tool: getOrderQuote,
    sendResponse: false,
  },
  {
    name: "get_payment_info",
    type: "getPaymentInfo",
    tool: getPaymentInfo,
    sendResponse: true,
  },
  {
    name: "search_products",
    type: "searchProducts",
    tool: searchProducts,
    sendResponse: true,
  }
];

const typesTool = toolDeclarations
  .filter(td => td.sendResponse)
  .map(td => td.type);

module.exports = {
  functionDeclarations,
  toolDeclarations,
  typesTool
};
/* eslint-enable */
