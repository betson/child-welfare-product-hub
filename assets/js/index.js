---
---
var childWelfare = childWelfare || {};

(function (document, window, $) {
  $(document).ready(function(){
    fixMarkdownRendering();
    updateProductListings();
    loadJson('_facets.json', "facets");
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

  // Federalist isn't rendering the Markdown as expected. This
  // will rearrange the DOM to fit our expectation
  function fixMarkdownRendering() {
    var listings = $('#product-listings>ul');
    if(!listings.length || wasRenderedCorrectly(listings)) { return; }

    listings.children().each(function() {
      var text = $(this).text();
      var headerText = getHeaderText(text);
      var bodyText = getBodyText(text, headerText);
      var header = document.createElement('h2');
      
      // Build header
      if(hasHeaderAnchor($(this))) {
        var anchor = $(this).children('a').first().detach();
        anchor.appendTo(header);
      }
      else {
        header.appendChild(document.createTextNode(headerText));
      }

      // Build product description
      var p = document.createElement('p');
      p.appendChild(document.createTextNode(bodyText));

      // Re-assemble
      $(this).contents().filter(function() {
        return this.nodeType === Node.TEXT_NODE;
      }).remove();
      $(this).append(header, p);
    });
  }

  // Takes the full input text of the list element and attempts
  // to find the header. Assumes that the header ends in a newline.
  function getHeaderText(text) {
    var start = text.indexOf('#');
    var end = text.indexOf('\n', start);
    var markdownHeader = text.substring(start, end);
    return markdownHeader.replace(/\#+\s*/, "");
  }

  // Strips the full input text of the list element of leading
  // linebreaks and the header text.
  function getBodyText(text, headerText) {
    var headerStart = text.indexOf(headerText);
    var textStart = headerStart + headerText.length + 1;
    return text.substring(textStart);
  }

  // Checks if the provided list element has an <a> that is
  // also the header for the element. This is identified by
  // an <a> that is immediately preceeded by text that starts
  // with the Markdown '#'
  function hasHeaderAnchor(li) {
    if(li.children('a').length) {
      var previousText = li.children('a').first()[0].previousSibling.nodeValue;
      return previousText.charAt(previousText.length - 1) === '#' || previousText.charAt(previousText.length - 2) === '#';
    }
    return false;
  }

  // Checks if the listsings contain unformatted Markdown text
  // Our sign is whether the Markdown "##" still exists
  function wasRenderedCorrectly(listings) {
    return listings.children().first().text().indexOf('##') === -1;
  }

  // Download and parse a JSON file. Store the output in the
  // provided variable name on the parent childWelfare object.
  function loadJson(file, varName) {
    $.getJSON(file, function(json) {
      childWelfare[varName] = json;
    });
  }
})(document, window, $);
