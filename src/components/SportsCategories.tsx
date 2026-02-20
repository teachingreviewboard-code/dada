import { Link } from 'react-router-dom';
import { sportsCategories } from '../data/sports-categories';
import './SportsCategories.css';

export default function SportsCategories() {
  return (
    <div className="sports-categories">
      <div className="container">
        <h1>Sports Equipment Categories</h1>
        <p>Find everything you need for your favorite sports</p>
        
        <div className="categories-grid">
          {sportsCategories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>
              
              <div className="subcategories">
                {category.subcategories?.map((subcategory) => (
                  <div key={subcategory.id} className="subcategory">
                    <h4>{subcategory.name}</h4>
                    <p>{subcategory.description}</p>
                    {subcategory.products && (
                      <div className="products-list">
                        <h5>Products:</h5>
                        <ul>
                          {subcategory.products.map((product, index) => (
                            <li key={index}>{product}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Link 
                      to={`/products?category=${subcategory.slug}`}
                      className="browse-products-btn"
                    >
                      Browse Products
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
