# 🛍️ Ecommerce Platform

A modern, full-stack e-commerce application built with React, Express, and MongoDB.

![Hero]<img width="1899" height="929" alt="Screenshot 2025-11-07 172413" src="https://github.com/user-attachments/assets/fa4dd4c5-a9c8-498f-9d20-12fc34cf1829" />



## ⚡ Quick Start

```bash
# Backend
cd Backend && npm run dev

# Frontend (in another terminal)
cd Frontend && npm run dev

# Open http://localhost:5173
```

---

## 🎯 Features

- 🛒 **Shopping Cart** - Add, update, and remove items in real-time
- 💳 **Checkout** - Secure order placement with form validation
- 📦 **Order Management** - Create and track orders
- 🎨 **Responsive Design** - Works seamlessly on all devices
- 💾 **Data Persistence** - MongoDB backend stores all data

---

## 🏗️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (bundler)
- Context API (state management)
- Tailwind CSS + CSS3

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- REST APIs

---

## 📋 User Journey

1. Browse 10 products from Fake Store API
2. Add items to cart with quantity selector
3. View cart and adjust quantities
4. Proceed to checkout
5. Fill shipping details
6. Place order
7. Receive order confirmation
8. Cart automatically clears

---

## 📁 Project Structure

```
Ecommerce/
├── Frontend/
│   ├── src/
│   │   ├── components/    (5 components)
│   │   ├── pages/         (3 pages)
│   │   ├── context/       (CartContext)
│   │   ├── services/      (API calls)
│   │   └── types/         (TypeScript types)
│   └── vite.config.ts
│
└── Backend/
    ├── src/
    │   ├── controllers/   (3 controllers)
    │   ├── routes/        (3 routers)
    │   ├── models/        (MongoDB models)
    │   └── utils/         (DB connection)
    └── tsconfig.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Fetch all products |
| POST | `/api/cart` | Add item to cart |
| GET | `/api/cart` | Get cart items |
| PATCH | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |
| POST | `/api/checkout` | Place order |
| GET | `/api/checkout` | Get all orders |

---

## 📊 Database Schema

**Carts Collection:**
```json
{
  "_id": "ObjectId",
  "userId": "user123",
  "items": [
    {
      "productId": 1,
      "title": "Product Name",
      "price": 99.99,
      "quantity": 2,
      "image": "url"
    }
  ]
}
```

**Orders Collection:**
```json
{
  "_id": "ObjectId",
  "userId": "user123",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "cartItems": [...],
  "total": 299.97,
  "status": "completed",
  "timestamp": "2025-11-07T10:30:00Z"
}
```

---

## ⚙️ Configuration

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:3000/api
```

**Backend `.env`:**
```
MONGO_URI=mongodb://...
PORT=3000
USER_ID=user123
```

---

## 🚀 Deployment

**Frontend:**
```bash
cd Frontend && npm run build
# Deploy to Vercel, Netlify, or GitHub Pages
```

**Backend:**
```bash
cd Backend && npm run build && npm start
# Deploy to Heroku, Railway, or AWS
```

---

## 📸 Screenshots

![Products]<img width="1899" height="927" alt="Screenshot 2025-11-07 172429" src="https://github.com/user-attachments/assets/ae9a246d-8fb9-4ece-8312-e633d1673498" />


![Cart]<img width="1803" height="933" alt="Screenshot 2025-11-07 172516" src="https://github.com/user-attachments/assets/ebfe7bc4-a844-4e40-ae8e-390f5fe50853" />


![Checkout]<img width="1692" height="917" alt="Screenshot 2025-11-07 172603" src="https://github.com/user-attachments/assets/1dcfec4e-65e9-48e7-ae12-6ce897d13c88" />


![Receipt]<img width="1636" height="933" alt="Screenshot 2025-11-07 172921" src="https://github.com/user-attachments/assets/d551d57e-ee5e-4b4a-9e3a-868171b38b92" />

---

## 🧪 Testing

All features have been tested and verified:
- ✅ Product browsing and filtering
- ✅ Cart operations (add, update, remove)
- ✅ Checkout process
- ✅ Order creation
- ✅ Form validation
- ✅ Responsive design
- ✅ Error handling

---

## 📝 License

MIT License

---

**Status:** ✅ Production Ready

Built with ❤️ using React, Express & MongoDB
