import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProductsPage from "./pages/Products";
import { AddProductForm } from "./pages/AddProductForm";
import { EditProductForm } from "./pages/EditProductForm";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <ProductsPage /> },
            { path: 'create', element: <AddProductForm /> },
            { path: 'edit/:id', element: <EditProductForm /> },
        ],
    },
])
