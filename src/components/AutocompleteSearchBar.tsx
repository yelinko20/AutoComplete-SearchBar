import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductList from "./ProductList";
import SearchInput from "./SearchInput";

type Product = {
  id: number;
  title: string;
  image: string;
};

const AutocompleteSearchBar = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(-1);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("https://fakestoreapi.com/products");
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedProductIndex(-1);
    setSearchResults(
      products.filter((product) =>
        product.title.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      setSelectedProductIndex((prevIndex) =>
        prevIndex === -1 ? searchResults.length - 1 : prevIndex - 1
      );
    } else if (event.key === "ArrowDown") {
      setSelectedProductIndex((prevIndex) =>
        prevIndex === searchResults.length - 1 ? -1 : prevIndex + 1
      );
    } else if (event.key === "Enter") {
      if (selectedProductIndex !== -1) {
        const selectedProduct = searchResults[selectedProductIndex];
        alert(`You selected ${selectedProduct.title}`);
        setQuery("");
        setSelectedProductIndex(-1);
        setSearchResults([]);
      }
    }
  };

  const handleProductClick = (product: Product) => {
    alert(`You selected ${product.title}`);
    setQuery("");
    setSelectedProductIndex(-1);
  };

  const scrollActiveProductIntoView = (index: number) => {
    const activeProduct = document.getElementById(`product-${index}`);
    if (activeProduct) {
      activeProduct.scrollIntoView({
        block: "nearest",
        inline: "start",
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (selectedProductIndex !== -1) {
      scrollActiveProductIntoView(selectedProductIndex);
    }
  }, [selectedProductIndex]);

  return (
    <div className="flex flex-col max-w-lg mt-20 mx-auto font-FiraCode">
      <SearchInput
        value={query}
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        placeholder="Search products"
      />

      {query !== "" && searchResults.length > 0 && (
        <ProductList
          products={searchResults}
          selectedProductIndex={selectedProductIndex}
          handleProductClick={handleProductClick}
        />
      )}
    </div>
  );
};

export default AutocompleteSearchBar;
