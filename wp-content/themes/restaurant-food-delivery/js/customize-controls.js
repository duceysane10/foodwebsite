( function( api ) {

	// Extends our custom "restaurant-food-delivery" section.
	api.sectionConstructor['restaurant-food-delivery'] = api.Section.extend( {

		// No events for this type of section.
		attachEvents: function () {},

		// Always make the section active.
		isContextuallyActive: function () {
			return true;
		}
	} );

} )( wp.customize );