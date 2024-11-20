<script>
document.addEventListener('DOMContentLoaded', function () {
  // Sale elements
  const saleBedroomsDropdown = document.querySelector('#sale-beds');
  const saleSortDropdown = document.getElementById('sort-dropdown');
  const salePropertyContainer = document.getElementById('sale-property-container');
  const saleCollectionItems = document.querySelectorAll('.sale-collection-list-item');
  const saleCheckbox = document.getElementById('sale-checkbox');

  // Dropdown elements for price range
  const saleRangeMinDropdown = document.getElementById('rangeMin');
  const saleRangeMaxDropdown = document.getElementById('rangeMax');

  const salePaginationContainer = document.createElement('div');
  salePaginationContainer.id = 'pagination-container';
  salePropertyContainer.parentNode.insertBefore(salePaginationContainer, salePropertyContainer.nextSibling);

  let saleMinValueSet = false;
  let saleMaxValueSet = false;
  let currentSalePage = 1;
  const saleItemsPerPage = 12; // Number of items per page
  let saleFilteredItems = Array.from(saleCollectionItems);

  // Event listeners for sale filters
  saleRangeMinDropdown.addEventListener('change', handleSaleRangeInput);
  saleRangeMaxDropdown.addEventListener('change', handleSaleRangeInput);
  saleBedroomsDropdown.addEventListener('change', applySaleFilters);
  saleCheckbox.addEventListener('change', applySaleFilters);
  saleSortDropdown.addEventListener('change', handleSaleSorting);

  function handleSaleRangeInput() {
    const saleMinValue = saleRangeMinDropdown.value !== "" ? parseInt(saleRangeMinDropdown.value) : null;
    const saleMaxValue = saleRangeMaxDropdown.value !== "" ? parseInt(saleRangeMaxDropdown.value) : null;

    saleMinValueSet = saleMinValue !== null;
    saleMaxValueSet = saleMaxValue !== null;

    applySaleFilters();
  }

function applySaleFilters() {
  const saleMinPrice = saleRangeMinDropdown.value !== "" ? parseInt(saleRangeMinDropdown.value) : null;
  const saleMaxPrice = saleRangeMaxDropdown.value !== "" ? parseInt(saleRangeMaxDropdown.value) : null;
  const saleSelectedBedrooms = saleBedroomsDropdown.value;
  const saleExcludeUnderOffer = saleCheckbox.checked;

  // Filter the items based on the criteria
  saleFilteredItems = Array.from(saleCollectionItems).filter(item => {
    const saleItemPrice = parseFloat(item.getAttribute('data-price').replace(/,/g, ''));
    const saleItemBedrooms = item.getAttribute('data-bedrooms');
    const saleItemOffer = item.getAttribute('data-offer');

    const isSalePriceInRange = (saleMinPrice === null || saleItemPrice >= saleMinPrice) &&
                               (saleMaxPrice === null || saleItemPrice <= saleMaxPrice);
    const isSaleBedroomsMatch = saleSelectedBedrooms === 'All' || saleItemBedrooms === saleSelectedBedrooms;
    const isSaleOfferMatch = !saleExcludeUnderOffer || saleItemOffer !== '1';

    return isSalePriceInRange && isSaleBedroomsMatch && isSaleOfferMatch;
  });

  // Maintain the current sort order
  const saleSelectedSortOption = saleSortDropdown.value;
  const isSaleAscending = saleSelectedSortOption.includes('asc');
  const saleSortByDate = saleSelectedSortOption.startsWith('date');

  saleFilteredItems.sort((a, b) => {
    if (saleSortByDate) {
      const saleDateA = new Date(a.getAttribute('data-date'));
      const saleDateB = new Date(b.getAttribute('data-date'));
      return isSaleAscending ? saleDateA - saleDateB : saleDateB - saleDateA;
    } else {
      const salePriceA = parseFloat(a.getAttribute('data-price').replace(/,/g, ''));
      const salePriceB = parseFloat(b.getAttribute('data-price').replace(/,/g, ''));
      return isSaleAscending ? salePriceA - salePriceB : salePriceB - salePriceA;
    }
  });

  currentSalePage = 1; // Reset to the first page
  updateSalePagination();
}


  function handleSaleSorting() {
    const saleSelectedSortOption = saleSortDropdown.value;
    const isSaleAscending = saleSelectedSortOption.includes('asc');
    const saleSortByDate = saleSelectedSortOption.startsWith('date');

    saleFilteredItems.sort((a, b) => {
      if (saleSortByDate) {
        const saleDateA = new Date(a.getAttribute('data-date'));
        const saleDateB = new Date(b.getAttribute('data-date'));
        return isSaleAscending ? saleDateA - saleDateB : saleDateB - saleDateA;
      } else {
        const salePriceA = parseFloat(a.getAttribute('data-price').replace(/,/g, ''));
        const salePriceB = parseFloat(b.getAttribute('data-price').replace(/,/g, ''));
        return isSaleAscending ? salePriceA - salePriceB : salePriceB - salePriceA;
      }
    });

    currentSalePage = 1;
    updateSalePagination();
  }

  function updateSalePagination() {
    const totalSaleItems = saleFilteredItems.length;
    const totalSalePages = Math.ceil(totalSaleItems / saleItemsPerPage);

    salePropertyContainer.innerHTML = '';

    const saleStartIndex = (currentSalePage - 1) * saleItemsPerPage;
    const saleEndIndex = saleStartIndex + saleItemsPerPage;

    const saleItemsToDisplay = saleFilteredItems.slice(saleStartIndex, saleEndIndex);
    saleItemsToDisplay.forEach(item => salePropertyContainer.appendChild(item));

    updateSalePaginationControls(totalSalePages);
  }

  function updateSalePaginationControls(totalSalePages) {
    salePaginationContainer.innerHTML = '';


  if (currentSalePage > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-arrow';

    // Add SVG for the left arrow
    prevButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
      </svg>
    `;

    prevButton.addEventListener('click', () => {
      currentSalePage--;
      updateSalePagination();
      scrollToSaleContainer();
    });
    salePaginationContainer.appendChild(prevButton);
  }
    for (let i = 1; i <= totalSalePages; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = 'pagination-button';
      pageButton.textContent = i;

      if (i === currentSalePage) {
        pageButton.style.backgroundColor = '#a2a094';
        pageButton.style.color = '#FFFFFF';
      }

      pageButton.addEventListener('click', () => {
        currentSalePage = i;
        updateSalePagination();
        scrollToSaleContainer();
      });

      salePaginationContainer.appendChild(pageButton);
    }

    if (currentSalePage < totalSalePages) {
      const nextButton = document.createElement('button');
      nextButton.className = 'pagination-arrow';

      // Add SVG for the right arrow
      nextButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>
      `;

      nextButton.addEventListener('click', () => {
        currentSalePage++;
        updateSalePagination();
        scrollToSaleContainer();
      });
      salePaginationContainer.appendChild(nextButton);
    }
  }

  function scrollToSaleContainer() {
    // Check if the screen width is 1440px or greater
    const isLargeScreen = window.matchMedia('(min-width: 1440px)').matches;

    // Set the offset based on the media query
    const saleOffset = isLargeScreen ? 220 : 130; // Adjust 220 for large screens, 130 for others
    const saleContainerPosition = salePropertyContainer.getBoundingClientRect().top + window.scrollY;

    // Scroll to the container with the calculated offset
    window.scrollTo({
      top: saleContainerPosition - saleOffset,
      behavior: 'smooth'
    });
  }


  function initializeSaleCollectionItems() {
    saleCollectionItems.forEach(item => {
      item.style.display = 'block';
    });

    // Sort by price descending (highest to lowest)
    saleFilteredItems.sort((a, b) => {
      const salePriceA = parseFloat(a.getAttribute('data-price').replace(/,/g, ''));
      const salePriceB = parseFloat(b.getAttribute('data-price').replace(/,/g, ''));
      return salePriceB - salePriceA; // Descending order
    });

    updateSalePagination();
  }

  initializeSaleCollectionItems();
});
</script>





<script>
document.addEventListener('DOMContentLoaded', function () {
  // Rental elements
  const rentalBedroomsDropdown = document.querySelector('#rental-bed-dropdown');
  const rentalSortDropdown = document.getElementById('rental-sort-dropdown');
  const rentalPropertyContainer = document.getElementById('rental-property-container');
  const rentalCollectionItems = document.querySelectorAll('.rental-collection-list-item');
  const rentalCheckbox = document.getElementById('rental-checkbox');

  // Dropdown elements for rent range
  const rentalRangeMinDropdown = document.getElementById('rangeMinRent');
  const rentalRangeMaxDropdown = document.getElementById('rangeMaxRent');

  const rentalPaginationContainer = document.createElement('div');
  rentalPaginationContainer.id = 'pagination-container';
  rentalPropertyContainer.parentNode.insertBefore(rentalPaginationContainer, rentalPropertyContainer.nextSibling);

  let rentalMinValueSet = false;
  let rentalMaxValueSet = false;
  let currentRentalPage = 1;
  const rentalItemsPerPage = 6; // Number of items per page
  let rentalFilteredItems = Array.from(rentalCollectionItems);

  // Event listeners for rental filters
  rentalRangeMinDropdown.addEventListener('change', handleRentalRangeInput);
  rentalRangeMaxDropdown.addEventListener('change', handleRentalRangeInput);
  rentalBedroomsDropdown.addEventListener('change', applyRentalFilters);
  rentalCheckbox.addEventListener('change', applyRentalFilters);
  rentalSortDropdown.addEventListener('change', handleRentalSorting);

  function handleRentalRangeInput() {
    const rentalMinValue = rentalRangeMinDropdown.value !== "" ? parseInt(rentalRangeMinDropdown.value) : null;
    const rentalMaxValue = rentalRangeMaxDropdown.value !== "" ? parseInt(rentalRangeMaxDropdown.value) : null;

    rentalMinValueSet = rentalMinValue !== null;
    rentalMaxValueSet = rentalMaxValue !== null;

    applyRentalFilters();
  }

  function applyRentalFilters() {
    const rentalMinRent = rentalRangeMinDropdown.value !== "" ? parseInt(rentalRangeMinDropdown.value) : null;
    const rentalMaxRent = rentalRangeMaxDropdown.value !== "" ? parseInt(rentalRangeMaxDropdown.value) : null;
    const rentalSelectedBedrooms = rentalBedroomsDropdown.value;
    const excludeUnderOffer = rentalCheckbox.checked;

    rentalFilteredItems = Array.from(rentalCollectionItems).filter(item => {
      const rentalItemRent = parseFloat(item.getAttribute('data-rent').replace(/,/g, ''));
      const rentalItemBedrooms = item.getAttribute('data-bedrooms');
      const rentalItemOffer = item.getAttribute('data-offer');

      const isRentalRentInRange = (rentalMinRent === null || rentalItemRent >= rentalMinRent) &&
                                  (rentalMaxRent === null || rentalItemRent <= rentalMaxRent);
      const isRentalBedroomsMatch = rentalSelectedBedrooms === 'All' || rentalItemBedrooms === rentalSelectedBedrooms;
      const isRentalOfferMatch = !excludeUnderOffer || rentalItemOffer !== '1';

      return isRentalRentInRange && isRentalBedroomsMatch && isRentalOfferMatch;
    });

    currentRentalPage = 1;
    updateRentalPagination();
  }

  function handleRentalSorting() {
    const rentalSelectedSortOption = rentalSortDropdown.value;
    const isRentalAscending = rentalSelectedSortOption.includes('asc');
    const rentalSortByDate = rentalSelectedSortOption.startsWith('date');

    rentalFilteredItems.sort((a, b) => {
      if (rentalSortByDate) {
        const rentalDateA = new Date(a.getAttribute('data-date'));
        const rentalDateB = new Date(b.getAttribute('data-date'));
        return isRentalAscending ? rentalDateA - rentalDateB : rentalDateB - rentalDateA;
      } else {
        const rentalRentA = parseFloat(a.getAttribute('data-rent').replace(/,/g, ''));
        const rentalRentB = parseFloat(b.getAttribute('data-rent').replace(/,/g, ''));
        return isRentalAscending ? rentalRentA - rentalRentB : rentalRentB - rentalRentA;
      }
    });

    currentRentalPage = 1;
    updateRentalPagination();
  }

  function updateRentalPagination() {
    const totalRentalItems = rentalFilteredItems.length;
    const totalRentalPages = Math.ceil(totalRentalItems / rentalItemsPerPage);

    rentalPropertyContainer.innerHTML = '';

    const rentalStartIndex = (currentRentalPage - 1) * rentalItemsPerPage;
    const rentalEndIndex = rentalStartIndex + rentalItemsPerPage;

    const rentalItemsToDisplay = rentalFilteredItems.slice(rentalStartIndex, rentalEndIndex);
    rentalItemsToDisplay.forEach(item => rentalPropertyContainer.appendChild(item));

    updateRentalPaginationControls(totalRentalPages);
  }

  function updateRentalPaginationControls(totalRentalPages) {
    rentalPaginationContainer.innerHTML = '';

  if (currentRentalPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-arrow';

    // Add SVG for the left arrow
    prevButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
      </svg>
    `;

    prevButton.addEventListener('click', () => {
      currentRentalPage--;
      updateRentalPagination();
      scrollToRentalContainer();
    });
    rentalPaginationContainer.appendChild(prevButton);
  }


    for (let i = 1; i <= totalRentalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = 'pagination-button';
      pageButton.textContent = i;

      if (i === currentRentalPage) {
        pageButton.style.backgroundColor = '#a2a094';
        pageButton.style.color = '#FFFFFF';
      }

      pageButton.addEventListener('click', () => {
        currentRentalPage = i;
        updateRentalPagination();
        scrollToRentalContainer();
      });

      rentalPaginationContainer.appendChild(pageButton);
    }

  if (currentRentalPage < totalRentalPages) {
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-arrow';

    // Add SVG for the right arrow
    nextButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
      </svg>
    `;

    nextButton.addEventListener('click', () => {
      currentRentalPage++;
      updateRentalPagination();
      scrollToRentalContainer();
    });
    rentalPaginationContainer.appendChild(nextButton);
  }
  }

  function scrollToRentalContainer() {
    // Check if the screen width is 1440px or greater
    const isLargeScreen = window.matchMedia('(min-width: 1440px)').matches;

    // Set the offset based on the media query
    const rentalOffset = isLargeScreen ? 220 : 130; // Adjust 200 for large screens, 130 for others
    const rentalContainerPosition = rentalPropertyContainer.getBoundingClientRect().top + window.scrollY;

    // Scroll to the container with the calculated offset
    window.scrollTo({
      top: rentalContainerPosition - rentalOffset,
      behavior: 'smooth'
    });
  }

  function initializeRentalCollectionItems() {
    rentalCollectionItems.forEach(item => {
      item.style.display = 'block';
    });

    rentalFilteredItems = Array.from(rentalCollectionItems);
    updateRentalPagination();
  }

  initializeRentalCollectionItems();
});
</script>
