import { useState, useEffect} from "react";

const url = 'https://fakestoreapi.com/products'


function Apicall() {
    const [cat, setCat] = useState([]);

    const fetchCat = async () => {
        const response = await fetch(url);
        const data = await response.json();
        setCat(data);
    }
    
    useEffect(()=>{
        fetchCat();
    },[])

    return (
        <div>
            <p>{cat.map((iteam)=>{
                return(
                    <div className="apicall">
                        <div className="productscontainer">
                            <div className="product-1">
                                <img id="apimage" src={iteam.image} alt="not found" height="100px" width="100px"/>
                                <span id="title">{iteam.title}</span>
                                <span id="price">Price: ${iteam.price}</span>
                                <span id="category">Category: {iteam.category}</span>
                            </div>
                        
                        </div>
                    </div>
                )
            })}</p>
        </div>
    )
  
  };  

  
export default Apicall;