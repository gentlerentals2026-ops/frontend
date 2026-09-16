import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Exercise the existing route table independently of API-dependent page content.
jest.mock('./components/Header/Header', () => () => <header>Header</header>);
jest.mock('./components/Footer/Footer', () => () => <footer>Footer</footer>);
jest.mock('./components/WhatsApp/whatsapp', () => () => <aside>WhatsApp</aside>);
jest.mock('./components/ScrollToTop/ScrollToTop', () => () => null);
jest.mock('./pages/Home/Home', () => () => <main>Home page</main>);
jest.mock('./pages/Account/AccountPage', () => () => <main>Account page</main>);
jest.mock('./pages/About/AboutPage', () => () => <main>About page</main>);
jest.mock('./pages/Contact/ContactPage', () => () => <main>Contact page</main>);
jest.mock('./pages/Info/FaqPage', () => () => <main>FAQ page</main>);
jest.mock('./pages/Info/PolicyPage', () => ({ type }) => <main>{type} page</main>);
jest.mock('./pages/Products/ProductsListingPage', () => () => <main>Listings page</main>);
jest.mock('./pages/Products/ProductDetailsPage', () => () => <main>Details page</main>);
jest.mock('./pages/Cart/CartPage', () => () => <main>Cart page</main>);

test.each([
  ['/', 'Home'], ['/account', 'Account'], ['/about', 'About'], ['/contact', 'Contact'],
  ['/faqs', 'FAQ'], ['/privacy-policy', 'privacy'], ['/cancellation-policy', 'cancellation'],
  ['/brochure', 'brochure'], ['/cart', 'Cart'], ['/generate-quotation', 'Cart'],
  ['/products', 'Listings'], ['/products/example', 'Details'], ['/unknown', 'Home']
])('preserves %s and the shared page shell', (path, page) => {
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  expect(screen.getByRole('main')).toHaveTextContent(`${page} page`);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByText('WhatsApp')).toBeInTheDocument();
});
