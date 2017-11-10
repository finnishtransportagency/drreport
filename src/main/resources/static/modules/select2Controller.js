var $ = require('jquery');

var select2controller = (function(){
	
var activate = function(element, url, multi, pituus, oletusTeksti) {
	
	  $(element).select2({
	  theme: "classic",
	  placeholder: oletusTeksti,
	  multiple: multi,
	  ajax: {
	    url: url,
	    dataType: 'json',
	    delay: 250,
	    data: function (params) {
	    	if(!params.term) {
	    	params.term = '';}
	        var query = {
	        q: params.term, // search term
	        page: params.page
	              }
	        return query;},
	    processResults: function (data, params) {
	      // parse the results into the format expected by Select2
	      // since we are using custom formatting functions we do not need to
	      // alter the remote JSON data, except to indicate that infinite
	      // scrolling can be used
	      params.page = params.page || 1;

	      return {
	    	  results: $.map(data, function(obj) {
	              return { id: obj.id, text: obj.text };
	          }),
	          pagination: {
		          more: (params.page * 30) < data.total_count
		        }
	      };
	    },
	    cache: true
	  },
	  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
	  minimumInputLength: pituus,
	  language: {
		    inputTooShort: function(args) {
		      // args.minimum is the minimum required length
		      // args.input is the user-typed text
		      return "Kirjoita lisää";
		    },
		    inputTooLong: function(args) {
		      // args.maximum is the maximum allowed length
		      // args.input is the user-typed text
		      return "Kirjoitit liikaa";
		    },
		    errorLoading: function() {
		      return "Virhe";
		    },
		    loadingMore: function() {
		      return "Loading more results";
		    },
		    noResults: function() {
		      return "Ei löytynyt";
		    },
		    searching: function() {
		      return "Etsitään...";
		    },
		    maximumSelected: function(args) {
		      // args.maximum is the maximum number of items the user may select
		      return "Virhe";
		    }
		  }
//	  templateResult: formatRepo, // omitted for brevity, see the source of this page
//	  templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
	});
	};
	
	return{
		activate: activate,
	  };

	  
	  
})();

module.exports = select2controller;