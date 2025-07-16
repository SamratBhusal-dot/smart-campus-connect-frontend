// Define your deployed backend URL here
const BACKEND_URL = 'https://smart-campus-connect-backend.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    // --- Logic for marketplace.html ---
    const listingsContainer = document.getElementById('listingsContainer');
    const createListingBtn = document.getElementById('createListingBtn');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    if (listingsContainer) { // Check if we are on the marketplace.html page
        // Function to fetch and display listings
        async function fetchListings(filters = {}) {
            listingsContainer.innerHTML = '<p class="loading-message">Loading listings...</p>';
            let queryString = '';
            const params = new URLSearchParams();

            if (filters.search) {
                params.append('search', filters.search);
            }
            if (filters.category) {
                params.append('category', filters.category);
            }
            if (filters.minPrice) {
                params.append('minPrice', filters.minPrice);
            }
            if (filters.maxPrice) {
                params.append('maxPrice', filters.maxPrice);
            }

            if (params.toString()) {
                queryString = `?${params.toString()}`;
            }

            try {
                const token = localStorage.getItem('token'); // Get JWT token from local storage
                if (!token) {
                    alert('You must be logged in to view listings.');
                    window.location.href = 'index.html'; // Redirect to login
                    return;
                }

                const response = await fetch(`${BACKEND_URL}/api/listings${queryString}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include JWT token in header
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    displayListings(data.listings);
                } else {
                    listingsContainer.innerHTML = `<p class="error-message">Failed to load listings: ${data.error || 'Unknown error'}</p>`;
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
                listingsContainer.innerHTML = '<p class="error-message">Network error. Could not load listings.</p>';
            }
        }

        // Function to display listings in the UI
        function displayListings(listings) {
            listingsContainer.innerHTML = ''; // Clear previous listings
            if (listings.length === 0) {
                listingsContainer.innerHTML = '<p class="no-listings">No listings found matching your criteria.</p>';
                return;
            }

            listings.forEach(listing => {
                const listingCard = document.createElement('div');
                listingCard.className = 'listing-card';
                listingCard.innerHTML = `
                    <h3>${listing.title}</h3>
                    <p><strong>Category:</strong> ${listing.category}</p>
                    <p>${listing.description}</p>
                    <p class="price"><strong>Price:</strong> $${parseFloat(listing.price).toFixed(2)}</p>
                    <p class="seller-info">Posted by: ${listing.sellerUsername || 'Unknown'}</p>
                    <p class="status">Status: ${listing.status}</p>
                    <button class="button-secondary contact-seller-btn" data-seller-id="${listing.sellerId}">Contact Seller</button>
                    <!-- Add more details/buttons as needed, e.g., for editing/deleting -->
                `;
                listingsContainer.appendChild(listingCard);
            });
        }

        // Event listeners for marketplace.html
        createListingBtn.addEventListener('click', () => {
            window.location.href = 'create-listing.html';
        });

        searchButton.addEventListener('click', () => {
            const filters = {
                search: searchBar.value
            };
            fetchListings(filters);
        });

        applyFiltersBtn.addEventListener('click', () => {
            const filters = {
                category: categoryFilter.value,
                minPrice: minPrice.value,
                maxPrice: maxPrice.value
            };
            fetchListings(filters);
        });

        resetFiltersBtn.addEventListener('click', () => {
            searchBar.value = '';
            categoryFilter.value = '';
            minPrice.value = '';
            maxPrice.value = '';
            fetchListings(); // Fetch all listings
        });

        // Initial fetch of listings when the page loads
        fetchListings();
    }

    // --- Logic for create-listing.html ---
    const createListingForm = document.getElementById('createListingForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (createListingForm) { // Check if we are on the create-listing.html page
        createListingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const price = parseFloat(document.getElementById('price').value);
            const category = document.getElementById('category').value;

            // Basic validation
            if (!title || !description || isNaN(price) || !category) {
                alert('Please fill in all required fields and ensure price is a valid number.');
                return;
            }

            try {
                const token = localStorage.getItem('token'); // Get JWT token from local storage
                if (!token) {
                    alert('You must be logged in to create a listing.');
                    window.location.href = 'index.html'; // Redirect to login
                    return;
                }

                const response = await fetch(`${BACKEND_URL}/api/listings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include JWT token in header
                    },
                    body: JSON.stringify({ title, description, price, category })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Listing created successfully!');
                    window.location.href = 'marketplace.html'; // Redirect to marketplace
                } else {
                    alert(`Failed to create listing: ${data.error || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error creating listing:', error);
                alert('Network error. Could not create listing.');
            }
        });

        cancelBtn.addEventListener('click', () => {
            window.location.href = 'marketplace.html'; // Go back to marketplace
        });
    }
});
