import { useSearchParams } from "react-router-dom";
import { productCategories } from "../../utils/productCategories";
import "./CategoryFilter.css";

export default function CategoryFilter({ products }) {
  const [params, setParams] = useSearchParams();
  const selected = params.get("category") || "";
  const categories = [{ key: "", name: "All" }, ...productCategories(products)];
  return <nav className="catalogue-category-filter" aria-label="Product categories">
    {categories.map(c => <button key={c.key} type="button" aria-pressed={selected === c.key} onClick={() => {
      const next = new URLSearchParams(params); if (c.key) next.set("category", c.key); else next.delete("category"); setParams(next);
    }}>{c.name}</button>)}
  </nav>;
}
