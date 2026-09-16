import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import "./CatalogueGrid.css";

export default function CatalogueGrid({ products, isLoading, skeletonCount = 8 }) {
  return (
    <div className="catalogue-grid" aria-busy={isLoading} aria-label="Rental catalogue">
      {isLoading ? Array.from({ length: skeletonCount }, (_, index) => (
        <div className="catalogue-tile" key={index} aria-hidden="true">
          <div className="catalogue-tile__image"><Skeleton variant="rectangular" width="100%" height="100%" /></div>
          <div className="catalogue-tile__name"><Skeleton width="90%" /><Skeleton width="60%" /></div>
          <div className="catalogue-tile__price"><Skeleton width="45%" /></div>
        </div>
      )) : products.map((product) => (
        <Link className="catalogue-tile" key={product._id} to={`/products/${product.slug}`} aria-label={`View listing: ${product.title}`}>
          <div className="catalogue-tile__image">
            {product.imageUrl ? <img src={product.imageUrl} alt="" loading="lazy" decoding="async" /> : <span>Image unavailable</span>}
          </div>
          <h3 className="catalogue-tile__name" title={product.title}>{product.title}</h3>
          <p className="catalogue-tile__price">&#8358;{Number(product.price || 0).toLocaleString("en-NG")}</p>
        </Link>
      ))}
    </div>
  );
}
