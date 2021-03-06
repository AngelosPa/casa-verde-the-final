import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import ShopItem from "../Shop/ShopItem";
import { AuthContext } from "../AuthContext";

export default function UpdateProduct() {
  const [token] = useContext(AuthContext);
  const config = {
    headers: {
      authorization: token,
    },
  };

  const [productData, setProductData] = useState([]);
  const [id, setId] = useState();
  const [name, setName] = useState("any name")
  const [category, setCategory] = useState("Bouquet of flowers");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState();
  const [delivery, setDelivery] = useState(false);
  const [image, setImage] = useState();
  // get all products WE CAN GET THEM WITH USECONTEXT
  const getAllProducts = () => {
    axios
      .get("user/products", config)
      .then((res) => {
        if (res.data) {
          setProductData(res.data);
          localStorage.setItem("product", JSON.stringify(res.data));
         
        } else {
          setProductData({ auth: false });
        }
      })
      .catch((err) => {
        console.log("here", err.response?.data);
      });
  };
  const obj = { name, id, category, price, quantity, description, delivery };
  
  useEffect(() => {
    getAllProducts();
  }, []);
  const handleUpload = (e) => {
    setImage(e.target.files[0]);
  };
  const handleSubmitForUpdate = async (e) => {
    e.preventDefault();
    const updatedProductData = new FormData();
    
    updatedProductData.append("category", category);
    updatedProductData.append("price", price);
    updatedProductData.append("quantity", quantity);
    updatedProductData.append("description", description);
    updatedProductData.append("delivery", delivery);
    updatedProductData.append("image", image);
    console.log(id);
    try {
      const result = await axios.put(
        `admin/product/${id}`,
        updatedProductData,
        config,
        {
          header: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      alert("Product updated successfully");
      
    } catch (err) {
      console.log("error", err.response.data.message);
    }
  };
   
  return (
    <div className="admin-dash-add-products-container">
      <div className="add-product-wrapper">
        <h2>MODIFY PRODUCT</h2>
        <form onSubmit={handleSubmitForUpdate}>
          <input type="file" id="file" onChange={handleUpload} />
          <p>name of the product:</p>
          <select
            id="name"
            onChange={(e) => {
                setId(e.target.value);
            }}
          >
            {productData.map((item) => (
              <option value={item._id}> {item.name} </option>
            ))}
          </select>

          <p>category:</p>

          <select
            id="category"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="Bouquet of flowers"> Bouquet of flowers </option>
            <option value="Flower and plants pots">
              {" "}
              Flower and plants pots{" "}
            </option>
            <option value="Gift baskets"> Gift baskets </option>
            <option value="Italian Products"> Italian Products</option>
          </select>
          <p>RE-price it:</p>
          <input
            type="number"
            value={null}
            name="price"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="value it"
          />

          <p>change amount:</p>

          <input
            type="number"
            value={null}
            name="quantity"
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="remaining amount"
          />

          <p>write an other description:</p>
          <input
            type="text"
            value={null}
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="new description"
          />
          <p>deliverable or zum abholung?:</p>
          <select
            id="delivery"
            onChange={(e) => {
              setDelivery(e.target.value);
            }}
          >
            <option value={true}> deliverable </option>
            <option value={false}> not deliverable </option>
          </select>
          <input className="button-dash" type="submit" value="save changes" />
        </form>
      </div>
      <div className="preview">
        <p>preview</p>
        <ShopItem obj={obj} />
      </div>
    </div>
  );
}
