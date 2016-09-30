---
---
var childWelfare = childWelfare || {};

(function (document, window, $) {
  $(document).ready(function(){
    loadJson('_facets.json', "facets");
    triggerFacetedSearch();
  });

  // Download and parse a JSON file. Store the output in the
  // provided variable name on the parent childWelfare object.
  function loadJson(file, varName) {
    $.getJSON(file, function(json) {
      childWelfare[varName] = json;
    });
  }

  // When any of the category/user checkboxes are selected,
  // trigger an update of the listed products
  function triggerFacetedSearch() {
    var facets = $('#facets');
    if(!facets.length) { return; }

    facets.find('input').change(processFilters);
  }

  // Identify which filters are selcted and display the
  // appropriate products
  function processFilters() {
    var selectedUsers = [];
    var selectedCategories = [];
    var users = $('#facets-users');
    var categories = $('#facets-categories');
    users.find('input:checked').each(function() { selectedUsers.push(this.id); });
    categories.find('input:checked').each(function() { selectedCategories.push(this.id); });
    
    // Display all products if no options are selected
    if(selectedUsers.length + selectedCategories.length == 0) {
      $('#product-listings>ul>li').show();
    }
    else {
      var productTitles = getProducts(selectedUsers, selectedCategories);
      var products = $('#product-listings>ul>li');
      products.each(function() {
        var title = $(this).find('h2').text();
        // Leave the final 'how to submit your product' listing,
        // but show and hide all others
        if(title !== '{{ site.data.submission-listing.title }}') {
          if(productTitles[title]) {
            $(this).show();
          }
          else {
            $(this).hide();
          }
        }
      });
    }
  }

  // Find the names of products that match the provided lists
  // of users and categories.
  function getProducts(users, categories) {
    // Use an object in order to emulate the uniqueness of
    // sets. This is helpful because many titles will be
    // repeated.
    productTitles = {};
    for (var i = 0; i < users.length; i++) {
      var userProducts = childWelfare.facets.users[users[i]];
      for(var j = 0; j < userProducts.length; j++) {
        productTitles[userProducts[j]] = true;
      }
    }
    for (var i = 0; i < categories.length; i++) {
      var categoryProducts = childWelfare.facets.categories[categories[i]];
      for(var j = 0; j < categoryProducts.length; j++) {
        productTitles[categoryProducts[j]] = true;
      }
    }

    return productTitles;
  }
})(document, window, $);
