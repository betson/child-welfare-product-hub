---
---
(function (document, window, $) {
  $(document).ready(function(){
    updateProductListings();
    //ajaxifyContactForm();
  });

  function updateProductListings() {
    var listings = $('#product-listings>ul');
    if(!listings.length) { return; }

    // Create 'Learn More' button to appear underneath each product listing
    var learnButton = document.createElement('a');
    learnButton.className = 'usa-button product-learn-more';
    learnButton.appendChild(document.createTextNode("Learn more"));
    
    // Create <div><div><p> structure required for ellipsis solution
    // http://www.mobify.com/blog/multiline-ellipsis-in-pure-css/
    var ellipsisDiv = document.createElement('div');
    ellipsisDiv.className = "ellipsis";
    var innerDiv = document.createElement('div');
    ellipsisDiv.appendChild(innerDiv);

    listings.children().each(function() {
      // Rearrange DOM for ellipsis
      var ellipsisCopy = ellipsisDiv.cloneNode(true);
      $(this).children('p').detach().appendTo(ellipsisCopy.children[0]);
      $(this).append(ellipsisCopy);

      // Add 'Learn More' button with appropriate hyperlink
      var productLink = $(this).find('a').first().attr('href');
      var newButton = learnButton.cloneNode(true);
      if(productLink) {
        newButton.href = productLink; 
      }
      $(this).append(newButton);
    });
  }

  function ajaxifyContactForm () {
    var contactForm = $('#contact'),
        originalUrl = contactForm.attr('action');
        contactBtn  = $('.contact [type=submit]'),
        alert       = $('#contact-alert');

    contactBtn.on('click', function (e) {
      e.preventDefault();
      var url = [originalUrl, contactForm.serialize()].join('?'),
          img = $('<img></img');

      img.on('error', function (e) {
        console.log('known error', e);
      });

      contactBtn.val('Thank you');
      contactBtn.attr('disabled', true);
      img.attr('src', url);

    });
  }
})(document, window, $);
