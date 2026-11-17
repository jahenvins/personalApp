import React from "react";import {createRoot} from "react-dom/client";import {BrowserRouter,Route,Routes} from "react-router-dom";
import "./index.css";import Quiz from "./screens/Quiz";import Admin from "./admin/Admin";
createRoot(document.getElementById("root")!).render(<BrowserRouter><Routes><Route path="/" element={<Quiz/>}/><Route path="/admin" element={<Admin/>}/></Routes></BrowserRouter>);
