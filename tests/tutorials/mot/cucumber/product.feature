Feature: Product

  As a User I want to be able to manage menu items

  Scenario: Editing a product
    Given We have logged in as "fake.email90@gmail.com" with password "abc123!@#"
    When I click on element "Products"
    When I click on sidebar button "Items"
    When I click on element "New Item"
    # Check we can submit the fields
    When I type "New Item 2" into "name_public"
    When I type "New Item 2" into "name_internal"
    # TODO: Select subcategory
    When I type "New description" into "description"
    When I type "0.2" into "abv"
    # TODO: Select tax band
    # TODO: Set in stock
    # TODO: Set delivery
    # TODO: Extra Items
    # TODO: Preferences
    # TODO: Tags
    # TODO: Image
    # When I type "double" into "option_name"
    # When I type "200" into "option_price"
    # When I type "50" into "option_discount"
    When I click on "Submit"

    # Check the product actually updated
    When I click on element "New Item 2"
    Then "name_internal" should show text "New Item 2"
    # TODO: Subcategory
    Then "name_public" should show text "New Item 2"
    Then "description" should show text "New description"
    Then "abv" should show text "0.2"
    # TODO: Select tax band
    # TODO: Set in stock
    # TODO: Set delivery
    # TODO: Extra Items
    # TODO: Preferences
    # TODO: Tags
    # TODO: Image
    # Then "option_name" should show text "double"
    # Then "option_price" should show text "200"
    # Then "option_discount" should show text "50"
    
    # Set the product back to how it was
    When I type "New Item" into "name_public"
    When I type "New Item" into "name_internal"
    # TODO: Select subcategory
    When I type "description" into "description"
    When I type "0.0" into "abv"
    # TODO: Select tax band
    # TODO: Set in stock
    # TODO: Set delivery
    # TODO: Extra Items
    # TODO: Preferences
    # TODO: Tags
    # TODO: Image
    # When I type "single" into "option_name"
    # When I type "100" into "option_price"
    # When I type "0" into "option_discount"
    When I click on "Submit"
    Then "New Item" should exist 

  Scenario: Searching for a product
    Given We have logged in as "fake.email90@gmail.com" with password "abc123!@#"
    When I click on element "Products"
    When I click on sidebar button "Items"
    When I type "New Item" into "search"
    Then "New Item" should exist
