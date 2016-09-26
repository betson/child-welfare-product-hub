// derived from vote.usa.gov
var childWelfare = childWelfare || {};

childWelfare.website = {

  bindModalClose: function() {
    $(".close").bind("click", function(e){
      e.preventDefault();
      childWelfare.website.closeModal();
    });
  },

  bindLoadSubmission: function() {
  	$(".js-load-submission").bind("click", function(e) {
  		e.preventDefault();
  		childWelfare.website.loadModal();
  	});
  },

  bindFunctions: function() {
  	childWelfare.website.bindLoadSubmission();
    childWelfare.website.bindModalClose();
  },

  closeModal: function() {
    $(".overlay").removeClass("active");
    $(".modal").removeClass("active");
    $("body").removeClass("no-scroll");
  },

  loadModal: function() {
    $(".overlay").addClass("active");
    $(".modal").addClass("active");
    $("body").addClass("no-scroll");
  }
};

// Load the functions
$(document).ready(childWelfare.website.bindFunctions());

$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    childWelfare.website.closeModal();
  }
});
