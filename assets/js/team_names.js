function populateTeamNames(teamName){
	// given the id of the <select> tag as function argument, it inserts <option> tags
	var countryElement = document.getElementById('team_names');
	countryElement.length=0;
	countryElement.options[0] = new Option('Select Country','');
	countryElement.selectedIndex = 0;
	for (var i=0; i<country_arr.length; i++) {
		countryElement.options[countryElement.length] = new Option(country_arr[i],country_arr[i]);
	}


	// Assigned all countries. Now assign event listener for the states.

	if( stateElementId ){
		countryElement.onchange = function(){
			populateStates( countryElementId, stateElementId );
		};
	}
}

